import React, { Component, Fragment } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ApiClient from "../../api-client/index";
import Alert from "react-bootstrap/Alert";
import RobotsTable from "../Table/Robots";

class RobotForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createRobotMessage: null,
      createRobotCode: null,
      deleteRobotMessage: null,
      deleteRobotCode: null,
      robotToDelete: "",
      robots: []
    };
  }
  componentDidMount() {
    ApiClient.getAllRobots().then(({ data }) => {
      this.setState({
        robots: data
      });
    });
  }

  createRobot = pos => {
    ApiClient.createRobot({ pos: JSON.parse(pos) })
      .then(({ data, status }) => {
        this.setState({
          createRobotMessage: data,
          createRobotCode: status
        });
      })
      .catch(error => {
        this.setState({
          createRobotMessage: error.response.data,
          createRobotCode: error.response.status
        });
      });
  };

  deleteRobot = idRobot => {
    ApiClient.deleteRobot(idRobot)
      .then(({ data, status }) => {
        this.setState({
          deleteRobotMessage: data,
          deleteRobotCode: status
        });
      })
      .catch(error => {
        this.setState({
          deleteRobotMessage: error.response.data,
          deleteRobotCode: error.response.status
        });
      });
  };
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const {
      createRobotMessage,
      createRobotCode,
      deleteRobotMessage,
      deleteRobotCode,
      robots,
      robotToDelete
    } = this.state;
    const posicion = localStorage.getItem("posicion");
    const platform = localStorage.getItem("platform");
    return (
      <Fragment>
        <Row>
          <Col xs={12}>
            <RobotsTable robots={robots} />
          </Col>
        </Row>
        <hr></hr>
        <Row>
          <Col xs={6}>
            <div class="form-group">
              <span>{`Usted se logueo a la plataforma: ${platform}, el robot se creara en la posicion: ${posicion}`}</span>
            </div>
            <button
              type="submit"
              class="btn btn-primary"
              onClick={() => this.createRobot(posicion)}
            >
              Crear robot
            </button>
          </Col>
          <Col xs={6}>
            {createRobotCode >= 200 && createRobotCode < 300 ? (
              <Alert variant="success">{createRobotMessage}</Alert>
            ) : createRobotCode === 500 ? (
              <Alert variant="danger">{createRobotMessage}</Alert>
            ) : null}
          </Col>
        </Row>
        <hr></hr>
        <Row>
          <Col xs={6}>
            <div class="form-group">
              <label for="exampleInputPassword1">Eliminar robot</label>
              <input
                type="text"
                class="form-control"
                placeholder="Id del robot a eliminar"
                name="robotToDelete"
                value={robotToDelete}
                onChange={this.onChange}
              />
            </div>
            <button
              type="submit"
              class="btn btn-primary"
              onClick={() => this.deleteRobot(robotToDelete)}
            >
              Eliminar robot
            </button>
          </Col>
          <Col xs={6}>
            {deleteRobotCode >= 200 && deleteRobotCode < 300 ? (
              <Alert variant="success">{deleteRobotMessage}</Alert>
            ) : deleteRobotCode === 500 ? (
              <Alert variant="danger">{deleteRobotMessage}</Alert>
            ) : null}
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default RobotForm;

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
      time: null
    };
  }

  startTimer() {
    this.timer = setInterval(
      () =>
        this.setState({
          time: Date.now()
        }),
      1000
    );
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  createRobot = (pos, getAllRobots) => {
    ApiClient.createRobot({ pos: JSON.parse(pos) })
      .then(({ data, status }) => {
        this.setState({
          createRobotMessage: data,
          createRobotCode: status
        });
        getAllRobots();
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
      time
    } = this.state;

    const { robots, getAllRobots } = this.props;
    const posicion = localStorage.getItem("posicion");
    const platform = localStorage.getItem("platform");
    return (
      <Fragment>
        <Row>
          <Col xs={6}>
            <div class="form-group">
              <span>{`Usted inicio sesion en la plataforma: ${platform}, el robot se creara en la posicion: ${posicion}`}</span>
            </div>
            <button
              type="submit"
              class="btn btn-primary"
              onClick={() => this.createRobot(posicion, getAllRobots)}
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
          <Col>
            <span>
              Indique el id de robot para ver la ubicacion en tiempo real
            </span>
            <div class="input-group mb-3">
              <input
                type="text"
                class="form-control"
                placeholder="Id de robot"
                aria-label="Id de robot"
                aria-describedby="button-addon2"
              />

              <div class="input-group-append" style={{ marginTop: "1rem" }}>
                <button
                  class="btn btn-primary"
                  type="button"
                  id="button-addon2"
                  onClick={() => this.startTimer()}
                >
                  Iniciar timer
                </button>
              </div>
            </div>
          </Col>
        </Row>
        <hr></hr>
        <Row>
          <Col xs={12}>
            <RobotsTable robots={robots} getAllRobots={getAllRobots} />
          </Col>
        </Row>
        <hr></hr>
        <Row>
          <Col xs={6}>
            {deleteRobotCode >= 200 && deleteRobotCode < 300 ? (
              <Alert variant="success">{deleteRobotMessage}</Alert>
            ) : deleteRobotCode >= 400 && deleteRobotCode < 500 ? (
              <Alert variant="warning">{deleteRobotMessage}</Alert>
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

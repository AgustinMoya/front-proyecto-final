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
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { createRobotMessage, createRobotCode, robots } = this.state;
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
            <div>
              <div class="form-row">
                <div class="col">
                  <span>{`Usted se logueo a la plataforma: ${platform}, el robot se creara en la posicion: ${posicion}`}</span>
                </div>
                <div class="col">
                  <center>
                    <button
                      type="submit"
                      class="btn btn-primary"
                      onClick={() => this.createRobot(posicion)}
                    >
                      Crear robot
                    </button>
                  </center>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={6}>
            {createRobotCode >= 200 && createRobotCode < 300 ? (
              <Alert variant="success">{createRobotMessage}</Alert>
            ) : createRobotCode === 500 ? (
              <Alert variant="danger">{createRobotMessage}</Alert>
            ) : null}
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default RobotForm;

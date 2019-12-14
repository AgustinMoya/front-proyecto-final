import React, { Component, Fragment } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ApiClient from "../../api-client/index";
import Alert from "react-bootstrap/Alert";
import RobotsTable from "../Table/Robots";
import ReadOnlyDeposit from "../Deposit/ReadOnlyDeposit";
const leyendas = [
  { color: "free", description: "Posicion libre" },
  { color: "initial", description: "Plataforma de descarga" },
  { color: "tower", description: "Torre de producto" },
  { color: "blocked", description: "Columna o pared" },
  { color: "robot", description: "Posicion actual del robot" },
  { color: "camino", description: "Camino a seguir" }
];
class RobotForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createRobotMessage: null,
      createRobotCode: null,
      deleteRobotMessage: null,
      deleteRobotCode: null,
      errorRobotMessage: null,
      errorRobotCode: null,
      errorDepositMessage: null,
      errorDepositCode: null,
      robotToDelete: "",
      idRobot: null,
      caminoRobot: null
    };
  }

  startTimer(idRobot) {
    this.timer = setInterval(() => this.getRobotRealTime(idRobot), 3000);
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
    const { getAllRobots } = this.props;
    ApiClient.deleteRobot(idRobot)
      .then(({ data, status }) => {
        this.setState({
          deleteRobotMessage: data,
          deleteRobotCode: status
        });
        getAllRobots();
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
  handleClick = idRobot => {
    clearInterval(this.timer);
    this.startTimer(idRobot);
  };

  getRobotRealTime = idRobot => {
    const { getAllRobots } = this.props;
    ApiClient.getRobot(idRobot)
      .then(({ data: robot, status }) => {
        if (robot.actual !== null && robot.camino !== null) {
          ApiClient.getMatrix()
            .then(({ data: deposit, status }) => {
              const { actual, camino } = robot;
              const posActual = JSON.parse(actual);
              const filaPosActual = posActual[0];
              const columnaPosActual = posActual[1];
              const caminoASeguir = JSON.parse(camino);
              caminoASeguir.forEach(element => {
                let fila = element[0];
                let columna = element[1];
                deposit[fila][columna] = 5;
              });
              deposit[filaPosActual][columnaPosActual] = 4;
              this.setState({
                caminoRobot: deposit,
                errorDepositMessage: null,
                errorDepositCode: null,
                errorRobotMessage: null,
                errorRobotCode: null
              });
              getAllRobots();
            })
            .catch(e => {
              clearInterval(this.timer);
              this.setState({
                errorDepositMessage: e.response.data,
                errorDepositCode: e.response.status,
                caminoRobot: null
              });
            });
        } else {
          clearInterval(this.timer);
          this.setState({
            errorRobotMessage: "El robot no tiene un camino asignado",
            errorRobotCode: 500,
            caminoRobot: null
          });
        }
      })
      .catch(e => {
        clearInterval(this.timer);
        this.setState({
          errorRobotMessage: e.response.data,
          errorRobotCode: e.response.status,
          caminoRobot: null
        });
      });
  };

  render() {
    const {
      createRobotMessage,
      createRobotCode,
      deleteRobotMessage,
      deleteRobotCode,
      errorRobotMessage,
      errorRobotCode,
      errorDepositMessage,
      errorDepositCode,
      idRobot,
      caminoRobot
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
            <div class="input-group mb-3" style={{ marginTop: "1rem" }}>
              <input
                type="text"
                class="form-control"
                placeholder="Id de robot"
                aria-label="Id de robot"
                aria-describedby="button-addon2"
                name="idRobot"
                value={this.state.idRobot}
                onChange={evt => this.onChange(evt)}
              />

              <div class="input-group-append">
                <button
                  class="btn btn-primary"
                  type="button"
                  id="button-addon2"
                  onClick={() => this.handleClick(idRobot)}
                  disabled={this.state.idRobot === null}
                >
                  Buscar robot
                </button>
              </div>
            </div>
            <Row>
              <Col xs={12}>
                {errorRobotCode >= 200 && errorRobotCode < 300 ? (
                  <Alert variant="success">{errorRobotMessage}</Alert>
                ) : errorRobotCode >= 400 && errorRobotCode < 500 ? (
                  <Alert variant="warning">{errorRobotMessage}</Alert>
                ) : errorRobotCode === 500 ? (
                  <Alert variant="danger">{errorRobotMessage}</Alert>
                ) : null}
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                {errorDepositCode >= 200 && errorDepositCode < 300 ? (
                  <Alert variant="success">{errorDepositMessage}</Alert>
                ) : errorDepositCode >= 400 && errorDepositCode < 500 ? (
                  <Alert variant="warning">{errorDepositMessage}</Alert>
                ) : errorDepositCode === 500 ? (
                  <Alert variant="danger">{errorDepositMessage}</Alert>
                ) : null}
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <div>
                  {leyendas.map((leyenda, idx) => {
                    return (
                      <div key={idx}>
                        <div
                          className={`seat ${leyenda.color}`}
                          style={{ marginRight: "10px" }}
                        />
                        <p>{leyenda.description}</p>
                      </div>
                    );
                  })}
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                {caminoRobot && <ReadOnlyDeposit matrix={caminoRobot} />}
              </Col>
            </Row>
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

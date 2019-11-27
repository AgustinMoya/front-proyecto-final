import React, { Component, Fragment } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import ApiClient from "../../api-client/index";
import { compose } from "recompose";
import { withFirebase } from "../Firebase";
import { AuthUserContext, withAuthorization } from "../Session";
import * as ROLES from "../../constants/roles";

import Deposit from "../Deposit";
import RobotForm from "../Robots";
import Alert from "react-bootstrap/Alert";

import UserTable from "../Table/Users";
import ReadOnlyDeposit from "../Deposit/ReadOnlyDeposit";
import ModifyDeposit from "../Deposit/ModifyForm";

import styles from "./styles.scss";

const INITIAL_STATE = {
  loading: false,
  users: [],
  columns: "",
  rows: "",
  deposit: [],
  robots: [],
  file: null,
  showDeposit: false,
  code: null,
  message: null,
  errorMessage: null,
  stopedAll: localStorage.getItem("stopedAll"),
  showModal: false,
  modifyDeposit: false
};

const leyendas = [
  { color: "free", description: "Posicion libre" },
  { color: "initial", description: "Plataforma de descarga" },
  { color: "tower", description: "Torre de producto" },
  { color: "blocked", description: "Columna o pared" }
];

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.props.firebase.users().on("value", snapshot => {
      const usersObject = snapshot.val();
      const usersList = Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key
      }));
      this.setState({
        users: usersList,
        loading: false
      });
    });
    this.getDeposit();
    this.getAllRobots();
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  createDeposit = () => {
    this.setState({ showDeposit: true });
  };

  restartDeposit = () => {
    this.setState({ showDeposit: false, rows: null, columns: null });
  };

  confirmDeposit = matrix => {
    ApiClient.confirmMatrix(matrix).then(({ data }) => {
      this.setState({
        code: 200,
        message: data.Message
      });
      document.location.reload();
    });
  };
  confirmModifyDeposit = matrix => {
    ApiClient.modifyMatrix(matrix)
      .then(({ data, status }) => {
        this.setState({
          modifyCode: status,
          modifyMessage: data
        });
      })
      .catch(e => {
        this.setState({
          modifyCode: e.response.status,
          modifyMessage: e.response.data
        });
      });
  };
  validateMatrix = matrix => {
    ApiClient.validateMatrix(matrix)
      .then(({ data }) => {
        this.setState({
          message: data.Message,
          code: 200
        });
      })
      .catch(e => {
        this.setState({
          message: e.response.data.Message,
          code: e.response.status
        });
      });
  };

  validateModifyMatrix = matrix => {
    ApiClient.validateMatrix(matrix)
      .then(({ data, status }) => {
        this.setState({
          modifyCode: status,
          modifyMessage: data.Message
        });
      })
      .catch(e => {
        this.setState({
          modifyMessage: e.response.data.Message,
          modifyCode: e.response.status
        });
      });
  };
  getDeposit = () => {
    ApiClient.getMatrix().then(({ data }) => {
      this.setState({
        deposit: data,
        modifyCode: null,
        modifyMessage: null,
        modifyDeposit: false
      });
    });
  };
  sendRequest = () => {
    if (this.state.file === null) {
      this.setState({
        errorMessage: "Antes de enviar, es necesario elegir un archivo",
        fileMessage: null,
        fileCode: null
      });
      return;
    }
    const file = this.state.file;
    const formData = new FormData();
    formData.append("file", file, file.name);

    ApiClient.insertCsv(formData)
      .then(({ data, status }) => {
        this.setState({
          fileMessage: data,
          fileCode: status,
          file: null,
          errorMessage: null
        });
      })
      .catch(error => {
        this.setState({
          fileMessage: error.response.data,
          fileCode: error.response.status
        });
      });
  };
  handleClose = () => {
    this.setState({
      showModal: false
    });
  };
  handleShow = () => {
    this.setState(prevState => ({
      showModal: true
    }));
  };

  stopAllRobotsAction = () => {
    ApiClient.stopAllRobots()
      .then(({ data }) => {
        alert(data);
        this.setState(
          prevState => ({
            stopedAll: !prevState.stopedAll,
            showModal: false
          }),
          () => {
            localStorage.setItem("stopedAll", this.state.stopedAll);
            this.getAllRobots();
          }
        );
      })
      .catch(error => {
        alert(error.response.data);
        this.setState(prevState => ({
          showModal: false
        }));
      });
  };
  resumeAllRobotsAction = () => {
    ApiClient.resumeAllRobots()
      .then(({ data }) => {
        alert(data);
        this.setState(
          prevState => ({
            stopedAll: !prevState.stopedAll,
            showModal: false
          }),
          () => {
            localStorage.setItem("stopedAll", this.state.stopedAll);
            this.getAllRobots();
          }
        );
      })
      .catch(error => {
        alert(error.response.data);
        this.setState(prevState => ({
          showModal: false
        }));
      });
  };

  getAllRobots = () => {
    ApiClient.getAllRobots().then(({ data }) => {
      this.setState({
        robots: data
      });
    });
  };
  handleModifyDeposit = () => {
    this.setState({
      modifyDeposit: true
    });
  };

  cancelModifyDeposit = () => {
    this.setState({
      modifyDeposit: false,
      modifyMessage: null,
      modifyCode: null
    });
    this.getDeposit();
  };

  modifyDeposit = data => {
    ApiClient.modifyMatrix(data)
      .then(({ data }) => {
        this.setState({
          depositMessage: data.Message,
          depositCode: 200
        });
      })
      .catch(e => {
        this.setState({
          depositMessage: e.response.data.Message,
          depositCode: e.response.status
        });
      });
  };
  render() {
    const {
      users,
      loading,
      columns,
      rows,
      showDeposit,
      code,
      message,
      deposit,
      showModal,
      robots,
      modifyDeposit,
      stopedAll
    } = this.state;

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <Tab.Container id="left-tabs-example" defaultActiveKey="usuarios">
            <Row>
              <Col sm={12}>
                <h2>Administrador: {authUser.username}</h2>
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <p>
                  Esta es la pagina de administrador donde podra realizar
                  diferentes acciones
                </p>
              </Col>
            </Row>
            <Row className="borderTabs">
              <Col sm={2} className="borderRight">
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="usuarios">Usuarios</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="crearDeposito"
                      onClick={() => this.getDeposit()}
                    >
                      Deposito
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="files"
                      onClick={() =>
                        this.setState({
                          fileMessage: null,
                          fileCode: null,
                          file: null,
                          errorMessage: null
                        })
                      }
                    >
                      Articulos
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="robots">Robots</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    {!stopedAll ? (
                      <Button
                        variant="danger"
                        style={{
                          width: "100%",
                          textAlign: "left",
                          marginTop: "10px"
                        }}
                        onClick={this.handleShow}
                      >
                        Frenar operatoria
                      </Button>
                    ) : (
                      <Button
                        variant="success"
                        style={{
                          width: "100%",
                          textAlign: "left",
                          marginTop: "10px"
                        }}
                        onClick={this.handleShow}
                      >
                        Reanudar operatoria
                      </Button>
                    )}
                  </Nav.Item>
                </Nav>
              </Col>
              <Col sm={10} className="marginAuto">
                <Tab.Content>
                  <Tab.Pane eventKey="usuarios">
                    {users.length === 0 ? (
                      <center>
                        <Button variant="outline-dark" disabled={loading}>
                          {loading && (
                            <Spinner
                              as="span"
                              animation="grow"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />
                          )}
                          {loading ? "Cargando…" : "Obtener todos los usuarios"}
                        </Button>
                      </center>
                    ) : (
                      <UserTable users={users} />
                    )}
                  </Tab.Pane>
                  <Tab.Pane eventKey="crearDeposito">
                    {deposit.length > 0 ? (
                      <Fragment>
                        {!modifyDeposit ? (
                          <Row>
                            <Col xs={12}>
                              <h2 style={{ marginBottom: "30px" }}>
                                La estructura del deposito es la siguiente:
                              </h2>
                            </Col>
                            <Col xs={12} md={4}>
                              <ReadOnlyDeposit matrix={deposit} />
                            </Col>
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
                            <Col xs={12} md={6} style={{ marginTop: "30px" }}>
                              <Button
                                variant="primary"
                                onClick={this.handleModifyDeposit}
                              >
                                Modificar deposito
                              </Button>
                            </Col>
                          </Row>
                        ) : (
                          <div>
                            <Row>
                              <Col xs={12}>
                                <h2 style={{ marginBottom: "30px" }}>
                                  Modificar deposito:
                                </h2>
                              </Col>
                            </Row>
                            <Row >
                              <Col xs={8}>
                                {this.state.modifyCode >= 200 &&
                                this.state.modifyCode < 300 ? (
                                  <Alert variant="success">
                                    {this.state.modifyMessage}
                                  </Alert>
                                ) : this.state.modifyCode >= 400 &&
                                  this.state.modifyCode < 500 ? (
                                  <Alert variant="warning">
                                    {this.state.modifyMessage}
                                  </Alert>
                                ) : this.state.modifyCode === 500 ? (
                                  <Alert variant="danger">
                                    {this.state.modifyMessage}
                                  </Alert>
                                ) : null}
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={8}>
                                <ModifyDeposit
                                  matrix={deposit}
                                  validateDeposit={this.validateModifyMatrix}
                                  confirmDeposit={this.confirmModifyDeposit}
                                  cancelModifyDeposit={this.cancelModifyDeposit}
                                />
                              </Col>
                              <Col xs={4}>
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
                          </div>
                        )}
                      </Fragment>
                    ) : !showDeposit ? (
                      <div>
                        <h5>Cantidad Filas</h5>
                        <input
                          className="form-control"
                          name="rows"
                          type="number"
                          placeholder="Filas"
                          value={rows}
                          onChange={this.onChange}
                        />
                        <small class="form-text text-muted">
                          El valor de las filas debe ser mayor o igual a dos
                        </small>
                        <h5 className="marginTop">Cantidad Columnas</h5>
                        <input
                          className="form-control"
                          name="columns"
                          type="number"
                          placeholder="Columnas"
                          value={columns}
                          onChange={this.onChange}
                        />
                        <small class="form-text text-muted">
                          El valor de las columnas debe ser mayor o igual a dos
                        </small>

                        <Button
                          className="marginTop"
                          variant="success"
                          type="button"
                          onClick={this.createDeposit}
                          disabled={rows < 2 || columns < 2}
                        >
                          Crear Deposito
                        </Button>
                      </div>
                    ) : null}
                    {showDeposit ? (
                      <Row className="marginTop">
                        <Col xs={12}>
                          <h4>Leyenda: </h4>
                        </Col>
                        <Col xs={12} md={6}>
                          <Deposit
                            rows={rows}
                            columns={columns}
                            confirmDeposit={this.confirmDeposit}
                            restartDeposit={this.restartDeposit}
                            validateDeposit={this.validateMatrix}
                          />
                        </Col>
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
                    ) : null}

                    <Row style={{ marginTop: "20px" }}>
                      <Col xs={12}>
                        {code >= 200 && code < 300 ? (
                          <Alert variant="success">{message}</Alert>
                        ) : code === 500 ? (
                          <Alert variant="danger">{message}</Alert>
                        ) : null}
                      </Col>
                    </Row>
                  </Tab.Pane>
                  <Tab.Pane eventKey="files">
                    <h4 style={{ marginBottom: "20px" }}>
                      Para cargar articulos en sus torres adjunte un archivo csv
                      con el siguiente formato: id articulo, id torre y el
                      estado
                    </h4>
                    <div class="input-group">
                      <div class="custom-file">
                        <input
                          lang="es"
                          type="file"
                          accept=".csv"
                          class="custom-file-input"
                          id="inputGroupFile04"
                          aria-describedby="inputGroupFileAddon04"
                          onChange={evt =>
                            this.setState({
                              file: evt.target.files[0],
                              errorMessage: null
                            })
                          }
                          onClick={event => {
                            event.target.value = null;
                          }}
                        />
                        <label class="custom-file-label" for="inputGroupFile04">
                          {this.state.file
                            ? this.state.file.name
                            : "Elegir un archivo"}
                        </label>
                      </div>
                      <div class="input-group-append">
                        <button
                          className="btn btn-primary"
                          type="button"
                          id="inputGroupFileAddon04"
                          onClick={this.sendRequest}
                        >
                          Subir archivo
                        </button>
                      </div>
                    </div>
                    {this.state.errorMessage && (
                      <Row style={{ marginTop: "20px" }}>
                        <Col xs={12}>
                          <Alert variant="danger">
                            {this.state.errorMessage}
                          </Alert>
                        </Col>
                      </Row>
                    )}
                    <div style={{ marginTop: "20px" }}>
                      {this.state.fileCode >= 200 &&
                      this.state.fileCode < 300 ? (
                        <Alert variant="success">
                          {this.state.fileMessage}
                        </Alert>
                      ) : this.state.fileCode >= 400 &&
                        this.state.fileCode < 500 ? (
                        <Alert variant="warning">
                          {this.state.fileMessage}
                        </Alert>
                      ) : this.state.fileCode === 500 ? (
                        <Alert variant="danger">{this.state.fileMessage}</Alert>
                      ) : null}
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="robots">
                    <RobotForm
                      robots={robots}
                      getAllRobots={this.getAllRobots}
                    />
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
            {!stopedAll ? (
              <Modal show={showModal} onHide={this.handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Atencion</Modal.Title>
                </Modal.Header>
                <Modal.Body>¿Estas seguro que queres frenar todo?</Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={this.handleClose}>
                    Cerrar
                  </Button>
                  <Button variant="danger" onClick={this.stopAllRobotsAction}>
                    Confirmar
                  </Button>
                </Modal.Footer>
              </Modal>
            ) : (
              <Modal show={showModal} onHide={this.handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Atencion</Modal.Title>
                </Modal.Header>
                <Modal.Body>¿Estas seguro que queres reanudar todo?</Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={this.handleClose}>
                    Cerrar
                  </Button>
                  <Button
                    variant="success"
                    onClick={this.resumeAllRobotsAction}
                  >
                    Confirmar
                  </Button>
                </Modal.Footer>
              </Modal>
            )}
          </Tab.Container>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

const condition = authUser => authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(
  withAuthorization(condition),
  withFirebase
)(AdminPage);

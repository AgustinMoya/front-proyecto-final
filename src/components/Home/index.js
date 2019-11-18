import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { compose } from "recompose";

import { withFirebase } from "../Firebase";

import { withAuthorization, withAuthentication } from "../Session";
import { withPlatformValue } from "../Platform/context";

import ApiClient from "../../api-client/index";

import OrdersTable from "../Table/Orders";
import ReadOnlyDeposit from "../Deposit/ReadOnlyDeposit";
import TowersTable from "../Table/Towers";
import UserTable from "../Table/Users";

const leyendas = [
  { color: "free", description: "Posicion libre" },
  { color: "initial", description: "Plataforma de descarga" },
  { color: "tower", description: "Torre de producto" },
  { color: "blocked", description: "Columna o pared" }
];
class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pedidos: null,
      isLoadingPedidos: true,
      errorMessage: null,
      errorCode: null,
      towerMessage: null,
      towerErrorCode: null,
      deposit: [],
      towers: [],
      users: [],
      idTorre: ""
    };
  }

  obtenerPedidos = () => {
    if (this.props.authUser.roles.ADMIN === "ADMIN") {
      ApiClient.getAllPedidos().then(({ data }) => {
        data.forEach((order, index, theArray) => {
          if (theArray[index].id_torre === null) {
            theArray[index].id_torre = theArray[index].id_torre1;
          } else {
            theArray[index].id_torre1 = theArray[index].id_torre;
          }
        });
        this.setState({ pedidos: data, isLoadingPedidos: false });
      });
    } else {
      const platform =
        this.props.platformValue || localStorage.getItem("platform");
      ApiClient.getPedido(platform).then(({ data }) => {
        data.forEach((order, index, theArray) => {
          if (theArray[index].id_torre === null) {
            theArray[index].id_torre = theArray[index].id_torre1;
          } else {
            theArray[index].id_torre1 = theArray[index].id_torre;
          }
        });
        this.setState({ pedidos: data, isLoadingPedidos: false });
      });
    }
  };

  componentDidMount() {
    this.obtenerPedidos();
    this.props.firebase.users().on("value", snapshot => {
      const usersObject = snapshot.val();
      const usersList = Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key
      }));
      this.setState({
        users: usersList.filter(user => user.roles && user.roles.ADMIN),
        loading: false
      });
    });
  }

  deletePedido = idPedido => {
    ApiClient.deletePedido(idPedido)
      .then(() => {
        this.obtenerPedidos();
      })
      .catch(error => {
        this.setState({
          errorMessage: error.response.data.message,
          errorCode: error.response.status
        });
      });
  };

  getDeposit = () => {
    ApiClient.getMatrix().then(({ data }) => {
      this.setState({
        deposit: data
      });
    });
  };
  getAllTowers = () => {
    ApiClient.getAllTorres().then(({ data }) => {
      this.setState({
        towers: data,
        towerMessage: null,
        towerErrorCode: null
      });
    });
  };
  postTorre = selected => {
    const platform =
      this.props.platformValue || localStorage.getItem("platform");
    ApiClient.postTorre({
      id_plataforma: platform,
      id_torre: selected
    })
      .then(({ data, status }) => {
        this.setState({
          towerMessage: data,
          towerErrorCode: status
        });
      })
      .catch(error => {
        this.setState({
          towerMessage: error.response.data,
          towerErrorCode: error.response.status
        });
      });
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const {
      pedidos,
      isLoadingPedidos,
      deposit,
      idTorre,
      towers,
      users,
      errorCode,
      errorMessage
    } = this.state;
    const { authUser } = this.props;
    const isValid = idTorre === "";
    return (
      <Tab.Container id="left-tabs-example" defaultActiveKey="pedidos">
        <Row>
          <Col sm={12}>
            <h2>Bienvenido {authUser.username}</h2>
          </Col>
        </Row>
        <Row className="borderTabs">
          <Col sm={2} className="borderRight">
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="pedidos">Ver pedidos</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="deposito" onClick={this.getDeposit}>
                  Ver deposito
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="tower" onClick={this.getAllTowers}>
                  Traer torre
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="history">Historial de pedidos</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="help">Obtener ayuda</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={10} className="marginAuto">
            <Tab.Content>
              <Tab.Pane eventKey="pedidos">
                {isLoadingPedidos ? (
                  <center>
                    <Button variant="outline-dark" disabled>
                      <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                      Cargando…
                    </Button>
                  </center>
                ) : (
                  <OrdersTable
                    orders={pedidos.filter(
                      pedido => pedido.estado !== "FINALIZADO"
                    )}
                    plataforma={
                      this.props.platformValue ||
                      localStorage.getItem("platform")
                    }
                    handleLiberarPedido={this.obtenerPedidos}
                  />
                )}
                <Row style={{ marginTop: "20px" }}>
                  <Col xs={12}>
                    {errorCode >= 200 && errorCode < 300 ? (
                      <Alert variant="success">{errorMessage}</Alert>
                    ) : errorCode === 500 ? (
                      <Alert variant="danger">{errorMessage}</Alert>
                    ) : null}
                  </Col>
                </Row>
              </Tab.Pane>
              <Tab.Pane eventKey="deposito" onClick={this.getDeposit}>
                {deposit.length === 0 ? (
                  <Row style={{ marginTop: "20px" }}>
                    <Col xs={12}>
                      <Alert variant="warning">
                        El deposito no fue creado todavia. Contactese con el
                        administrador
                      </Alert>
                    </Col>
                  </Row>
                ) : (
                  <Row>
                    <Col xs={12}>
                      <h2 style={{ marginBot: "20px" }}>
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
                  </Row>
                )}
              </Tab.Pane>
              <Tab.Pane eventKey="tower">
                <TowersTable
                  towers={towers}
                  platformValue={
                    this.props.platformValue || localStorage.getItem("platform")
                  }
                  postTorre={this.postTorre}
                />
                <Row style={{ marginTop: "20px" }}>
                  <Col xs={12}>
                    {this.state.towerErrorCode >= 200 &&
                    this.state.towerErrorCode < 300 ? (
                      <Alert variant="success">{this.state.towerMessage}</Alert>
                    ) : this.state.towerErrorCode === 500 ? (
                      <Alert variant="danger">{this.state.towerMessage}</Alert>
                    ) : null}
                  </Col>
                </Row>
              </Tab.Pane>
              <Tab.Pane eventKey="history">
                {isLoadingPedidos ? (
                  <center>
                    <Button variant="outline-dark" disabled>
                      <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                      Cargando…
                    </Button>
                  </center>
                ) : (
                  <OrdersTable
                    orders={pedidos}
                    plataforma={localStorage.getItem("platform")}
                    handleLiberarPedido={this.obtenerPedidos}
                  />
                )}
              </Tab.Pane>
              <Tab.Pane eventKey="help">
                <h3>Listado de administradores</h3>
                <p>
                  Si necesitas ayuda, ponete en contacto con tu administrador
                  mas cercano
                </p>
                <UserTable users={users} />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    );
  }
}
const condition = authUser => !!authUser;
export default compose(
  withAuthentication,
  withAuthorization(condition),
  withFirebase,
  withPlatformValue
)(HomePage);

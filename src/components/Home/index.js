import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { compose } from "recompose";

import { withAuthorization, withAuthentication } from "../Session";
import { withPlatformValue } from "../Platform/context";

import ApiClient from "../../api-client/index";

import OrdersTable from "../Table/Orders";
import ReadOnlyDeposit from "../Deposit/ReadOnlyDeposit";

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
      deposit: []
    };
  }

  obtenerPedidos = () => {
    if (this.props.authUser.roles.ADMIN === "ADMIN") {
      ApiClient.getAllPedidos().then(({ data }) => {
        this.setState({ pedidos: data, isLoadingPedidos: false });
      });
    } else {
      const platform =
        this.props.platformValue || localStorage.getItem("platform");
      ApiClient.getPedido(platform).then(({ data }) => {
        this.setState({ pedidos: data, isLoadingPedidos: false });
      });
    }
  };

  componentDidMount() {
    this.obtenerPedidos();
  }

  deletePedido = idPedido => {
    ApiClient.deletePedido(idPedido)
      .then(() => {
        this.obtenerPedidos();
      })
      .catch(error => {
        this.setState({
          errorMessage: error.response.data.Message,
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
  render() {
    const {
      pedidos,
      isLoadingPedidos,
      deposit,
      errorCode,
      errorMessage
    } = this.state;
    const { authUser } = this.props;
    return (
      <Tab.Container id="left-tabs-example" defaultActiveKey="pedidos">
        <Row>
          <Col sm={12}>
            <h2>Bienvenido {authUser.username}</h2>
          </Col>
        </Row>
        <Row className="borderTabs">
          <Col sm={3} className="borderRight">
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
                <Nav.Link eventKey="tower">Traer torre</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="history">Historial de pedidos</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="help">Obtener ayuda</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9} className="marginAuto">
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
                  <OrdersTable orders={pedidos} />
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
                <span>Traer torre</span>
              </Tab.Pane>
              <Tab.Pane eventKey="history">
                <span>Historial pedidos</span>
              </Tab.Pane>
              <Tab.Pane eventKey="help">
                <span>Obtener ayuda</span>
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
  withPlatformValue
)(HomePage);

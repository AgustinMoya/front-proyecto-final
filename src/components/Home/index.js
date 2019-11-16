import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { compose } from "recompose";

import { withAuthorization, withAuthentication } from "../Session";
import { withPlatformValue } from "../Platform/context";

import ApiClient from "../../api-client/index";

import OrdersTable from "../Table/Orders";

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pedidos: null,
      isLoadingPedidos: true
    };
  }

  componentDidMount() {
    if (this.props.authUser.roles.ADMIN === "ADMIN") {
      ApiClient.getAllPedidos().then(({ data }) => {
        this.setState({ pedidos: data, isLoadingPedidos: false });
      });
    } else {
      const platform = this.props.platformValue || localStorage.getItem("platform")
      ApiClient.getPedido(platform).then(({ data }) => {
        this.setState({ pedidos: data, isLoadingPedidos: false });
      });
    }
  }
  render() {
    const { pedidos, isLoadingPedidos } = this.state;
    const { authUser } = this.props;
    return (
      <Tab.Container id='left-tabs-example' defaultActiveKey='pedidos'>
        <Row>
          <Col sm={12}>
            <h2>Bienvenido {authUser.username}</h2>
          </Col>
        </Row>
        <Row className='borderTabs'>
          <Col sm={3} className='borderRight'>
            <Nav variant='pills' className='flex-column'>
              <Nav.Item>
                <Nav.Link eventKey='pedidos'>Ver pedidos</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey='deposito'>Ver deposito</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey='tower'>Traer torre</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey='history'>Historial de pedidos</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey='help'>Obtener ayuda</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9} className='marginAuto'>
            <Tab.Content>
              <Tab.Pane eventKey='pedidos'>
                {isLoadingPedidos ? (
                  <center>
                    <Button variant='outline-dark' disabled>
                      <Spinner
                        as='span'
                        animation='grow'
                        size='sm'
                        role='status'
                        aria-hidden='true'
                      />
                      Cargando…
                    </Button>
                  </center>
                ) : (
                  <OrdersTable orders={pedidos} />
                )}
              </Tab.Pane>
              <Tab.Pane eventKey='deposito'>
                <span>Ver deposito</span>
              </Tab.Pane>
              <Tab.Pane eventKey='tower'>
                <span>Traer torre</span>
              </Tab.Pane>
              <Tab.Pane eventKey='history'>
                <span>Historial pedidos</span>
              </Tab.Pane>
              <Tab.Pane eventKey='help'>
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

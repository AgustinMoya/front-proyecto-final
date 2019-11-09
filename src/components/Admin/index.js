import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import ApiClient from "../../api-client/index";
import { compose } from "recompose";
import { withFirebase } from "../Firebase";
import { AuthUserContext, withAuthorization } from "../Session";
import * as ROLES from "../../constants/roles";

import Deposit from "../Deposit";
import Alert from "react-bootstrap/Alert";
import FileUploader from "../FileUploader";

import UserTable from "../Table/Users";
import OrdersTable from "../Table/Orders";
import styles from "./styles.scss";

const INITIAL_STATE = {
  loading: false,
  isLoading: false,
  pedidos: [],
  users: [],
  columns: "",
  rows: "",
  showDeposit: false,
  code: null,
  message: null
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
    this.setState({ loading: true, isLoading: true });
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
      this.setState({ isLoading: true });
      ApiClient.getAllPedidos().then(({ data }) => {
        this.setState({
          isLoading: false,
          pedidos: data
        });
      });
    });
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
    ApiClient.confirmMatrix(matrix).then(data => {
      console.log(data);
      this.setState({
        code: 200,
        message: data.Message
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
        console.log(e.response.data.Message, e.response.status);
        this.setState({
          message: e.response.data.Message,
          code: e.response.status
        });
      });
  };
  handleCsv = e => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", this.uploadInput.files[0]);
    ApiClient.insertCsv(data).then(({ data }) => {
      this.setState({
        code: data.Status,
        message: data.Message
      });
    });
  };

  render() {
    const {
      users,
      pedidos,
      loading,
      isLoading,
      columns,
      rows,
      showDeposit,
      code,
      message
    } = this.state;

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <Tab.Container id='left-tabs-example' defaultActiveKey='usuarios'>
            <Row>
              <Col sm={12}>
                <h1>Administrador: {authUser.username}</h1>
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
            <Row className='borderTabs'>
              <Col sm={3} className='borderRight'>
                <Nav variant='pills' className='flex-column'>
                  <Nav.Item>
                    <Nav.Link eventKey='usuarios'>Usuarios</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey='pedidos'>Pedidos</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey='crearDeposito'>Deposito</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey='files'>Productos</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col sm={9} className='marginAuto'>
                <Tab.Content>
                  <Tab.Pane eventKey='usuarios'>
                    {users.length === 0 ? (
                      <center>
                        <Button variant='outline-dark' disabled={loading}>
                          {loading && (
                            <Spinner
                              as='span'
                              animation='grow'
                              size='sm'
                              role='status'
                              aria-hidden='true'
                            />
                          )}
                          {loading ? "Cargando…" : "Obtener todos los usuarios"}
                        </Button>
                      </center>
                    ) : (
                      <UserTable users={users} />
                    )}
                  </Tab.Pane>
                  <Tab.Pane eventKey='pedidos'>
                    {pedidos.length === 0 ? (
                      <center>
                        <Button variant='outline-dark' disabled={loading}>
                          {isLoading && (
                            <Spinner
                              as='span'
                              animation='grow'
                              size='sm'
                              role='status'
                              aria-hidden='true'
                            />
                          )}
                          {isLoading
                            ? "Cargando…"
                            : "Obtener todos los pedidos"}
                        </Button>
                      </center>
                    ) : (
                      <OrdersTable orders={pedidos} />
                    )}
                  </Tab.Pane>
                  <Tab.Pane eventKey='crearDeposito'>
                    {!showDeposit && (
                      <div>
                        <h5>Cantidad Filas</h5>
                        <input
                          className='form-control'
                          name='rows'
                          type='number'
                          placeholder='Filas'
                          value={rows}
                          onChange={this.onChange}
                        />
                        <h5 className='marginTop'>Cantidad Columnas</h5>
                        <input
                          className='form-control'
                          name='columns'
                          type='number'
                          placeholder='Columnas'
                          value={columns}
                          onChange={this.onChange}
                        />
                        <Button
                          className='marginTop'
                          variant='success'
                          type='button'
                          onClick={this.createDeposit}
                        >
                          Crear Deposito
                        </Button>
                      </div>
                    )}

                    {showDeposit && (
                      <Row className='marginTop'>
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
                                  <div className={`seat ${leyenda.color}`} />
                                  <p>{leyenda.description}</p>
                                </div>
                              );
                            })}
                          </div>
                        </Col>
                      </Row>
                    )}
                    <Row style={{ marginTop: "20px" }}>
                      <Col xs={6}>
                        {code => 200 && code < 300 ? (
                          <Alert variant='success'>{message}</Alert>
                        ) : code === 500 ? (
                          <Alert variant='danger'>{message}</Alert>
                        ) : null}
                      </Col>
                    </Row>
                  </Tab.Pane>
                  <Tab.Pane eventKey='files'>
                    <FileUploader />
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
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

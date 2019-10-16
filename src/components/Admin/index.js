import React, { Component } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import ApiClient from "../../api-client/index";
import { compose } from "recompose";
import { withFirebase } from "../Firebase";
import { withAuthorization } from "../Session";
import * as ROLES from "../../constants/roles";

import styles from "./styles.scss";
import Deposit from "../Deposit";
import Alert from "react-bootstrap/Alert";
import FileUploader from "../FileUploader";

const INITIAL_STATE = {
  loading: false,
  isLoading: false,
  pedidos: null,
  users: [],
  columns: "",
  rows: "",
  showDeposit: false,
  code: null,
  message: null
};
const leyendas = [
  { color: "free", description: "Posicion libre" },
  { color: "initial", description: "Posicion inicial" },
  { color: "tower", description: "Estante" },
  { color: "blocked", description: "Columna o pared" }
];

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  getAllUsers = () => {
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
  };

  getAllPedidos = () => {
    this.setState({ isLoading: true });
    ApiClient.getAllPedidos().then(({ data }) => {

      console.log("Los productos son: ",data.Message);
      this.setState({
        isLoading: false,
        pedidos: data.Message
      });
    });
  };

  componentWillUnmount() {
    this.props.firebase.users().off();
  }
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  createDeposit = () => {
    console.log(this.state.rows, this.state.columns);
    this.setState({ showDeposit: true });
  };
  restartDeposit = () => {
    this.setState({ showDeposit: false, rows: null, columns: null });
  };

  confirmDeposit = matrix => {
    ApiClient.confirmMatrix(matrix).then(({ data }) => {
      this.setState({
        code: data.Status,
        message: data.Message
      });
    });
  };

  handleCsv = e => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", this.uploadInput.files[0]);
    ApiClient.receiveCsv(data).then(({ data }) => {
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

    const isInvalid =
      rows === "" && rows === 0 && (columns === "" && columns === 0);
    return (
      <Tab.Container id="left-tabs-example" defaultActiveKey="usuarios">
        <Row>
          <Col sm={12}>
            <h1>Admin</h1>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <p>
              La página de administrador es visible por todos los usuarios
              administradores logueados
            </p>
          </Col>
        </Row>
        <Row className="borderTabs">
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="usuarios">Usuarios</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="pedidos">Pedidos</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="crearDeposito">Crear Deposito</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="files">Insertar archivos</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="usuarios">
                {users.length === 0 && (
                  <Button
                    variant="outline-dark"
                    onClick={this.getAllUsers}
                    disabled={loading}
                  >
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
                )}
                <UserList users={users} />
              </Tab.Pane>
              <Tab.Pane eventKey="pedidos">
                <Button
                  variant="outline-info"
                  onClick={!isLoading ? this.getAllPedidos : null}
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Spinner
                      as="span"
                      animation="grow"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  )}
                  {isLoading ? "Cargando…" : "Obtener todos los pedidos"}
                </Button>
                {pedidos &&
                  pedidos.map((pedido, index) => (
                    <Row className="marginTop" key={index}>
                      <Col xs={12}>
                        <p>El id del pedido es:{pedido.id}</p>
                        <p>La orden de compra es: {pedido.id_orden_compra}</p>
                        <p>El id de articulo es: {pedido.id_articulo}</p>
                        <p>El pedido es: {pedido.name}</p>
                        <p>El estado es: {pedido.estado}</p>
                      </Col>
                    </Row>
                  ))}
              </Tab.Pane>
              <Tab.Pane eventKey="crearDeposito">
                {!showDeposit && (
                  <div>
                    <input
                      className="form-control"
                      name="rows"
                      type="number"
                      placeholder="Filas"
                      value={rows}
                      onChange={this.onChange}
                    />
                    <input
                      className="form-control marginTop"
                      name="columns"
                      type="number"
                      placeholder="Columnas"
                      value={columns}
                      onChange={this.onChange}
                    />
                    <Button
                      className="marginTop"
                      disabled={isInvalid}
                      variant="info"
                      type="button"
                      onClick={this.createDeposit}
                    >
                      Crear Deposito
                    </Button>
                  </div>
                )}
                {showDeposit && (
                  <Button
                    style={{ marginLeft: "15px" }}
                    className="marginTop"
                    disabled={isInvalid}
                    type="button"
                    variant="warning"
                    onClick={this.restartDeposit}
                  >
                    Reiniciar deposito
                  </Button>
                )}
                {showDeposit && (
                  <Row className="marginTop">
                    <Col xs={12} md={12}>
                      <h4>Leyenda: </h4>
                      <div className="inlineGrid">
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
                    <Col xs={12} md={6}>
                      <Deposit
                        rows={rows}
                        columns={columns}
                        confirmDeposit={this.confirmDeposit}
                      />
                    </Col>
                  </Row>
                )}
                {code === 200 ? (
                  <Alert variant="success">{this.state.message}</Alert>
                ) : code === 500 ? (
                  <Alert variant="danger">{this.state.message}</Alert>
                ) : null}
              </Tab.Pane>
              <Tab.Pane eventKey="files">
                <FileUploader />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    );
  }
}

const UserList = ({ users }) =>
  users.length > 0 && (
    <Container className={"overflow-auto"}>
      <Row>
        <Col sm={12}>
          <h3>Los usuarios registrados son:</h3>
        </Col>
      </Row>
      <Row as={ListGroup} variant="flush" className="scrollList">
        {users.map(user => (
          <Col xs={12} as={ListGroup.Item} key={user.uid}>
            <p>
              <strong>ID:</strong> {user.uid}
            </p>
            <p>
              <strong>E-Mail:</strong> {user.email}
            </p>
            <p>
              <strong>Nombre de usuario:</strong> {user.username}
            </p>
          </Col>
        ))}
      </Row>
    </Container>
  );
const condition = authUser => authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(
  withAuthorization(condition),
  withFirebase
)(AdminPage);

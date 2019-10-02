import React, { Component } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

import Button from "react-bootstrap/Button";
import ApiClient from "../../api-client/index";
import { compose } from "recompose";
import { withFirebase } from "../Firebase";
import { withAuthorization } from "../Session";
import * as ROLES from "../../constants/roles";
import Deposit from "../Deposit";

import styles from "./styles.scss";

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
  }

  getAllPedidos = () => {
    this.setState({ isLoading: true });
    ApiClient.getAllPedidos().then(({ data }) => {
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

    const isInvalid = rows === "" || columns === "";
    return (
      <Container>
        <Row>
          <Col xs={12}>
            <h1>Admin</h1>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <p>
              La página de administrador es visible por todos los usuarios
              administradores logueados
            </p>
          </Col>
        </Row>

        {loading && (
          <Row className="loader marginTop">
            <Col xs={12}>
              <Spinner animation="border" />
            </Col>
          </Row>
        )}
        <UserList users={users} />

        <Row className="marginTop">
          <Col xs={12}>
            <Button
              variant="primary"
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
          </Col>
        </Row>
        {pedidos &&
          pedidos.map((pedido, index) => (
            <Row className="marginTop" key={index}>
              <Col xs={12}>
                <p>El pedido es: {pedido}</p>
              </Col>
            </Row>
          ))}

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
              className="form-control"
              name="columns"
              type="number"
              placeholder="Columnas"
              value={columns}
              onChange={this.onChange}
            />
          </div>
        )}
        <Button
          disabled={isInvalid}
          variant="info"
          type="button"
          onClick={this.createDeposit}
        >
          Crear Deposito
        </Button>
        <Button
          disabled={isInvalid}
          type="button"
          variant="warning"
          onClick={this.restartDeposit}
        >
          Reiniciar deposito
        </Button>
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
          <Alert variant="success"> {this.state.message}</Alert>
        ) : code === 500 ? (
          <Alert variant="danger">{this.state.message}</Alert>
        ) : null}
      </Container>
    );
  }
}
const UserList = ({ users }) => (
  <Container>
    <Row as={ListGroup}>
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

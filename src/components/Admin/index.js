import React, { Component, Fragment } from "react";
import ListGroup from "react-bootstrap/ListGroup";

import Button from "react-bootstrap/Button";
import ApiClient from "../../api-client/index";
import { compose } from "recompose";
import { withFirebase } from "../Firebase";
import { withAuthorization } from "../Session";
import * as ROLES from "../../constants/roles";
import Deposit from "../Deposit";

const INITIAL_STATE = {
  loading: false,
  isLoading: false,
  pedidos: null,
  users: [],
  columns: "",
  rows: "",
  showDeposit: false
};

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

  render() {
    const {
      users,
      pedidos,
      loading,
      isLoading,
      columns,
      rows,
      showDeposit
    } = this.state;

    const isInvalid = rows === "" || columns === "";

    return (
      <Fragment>
        <h1>Admin</h1>
        <p>
          La página de administrador es visible por todos los usuarios
          <b>ADMINISTRADORES</b> logueados
        </p>
        {loading && <div>Loading ...</div>}
        <UserList users={users} />
        <Button
          disabled={isLoading}
          onClick={!isLoading ? this.getAllPedidos : null}
        >
          {isLoading ? "Cargando…" : "Obtener todos los pedidos"}
        </Button>
        {pedidos &&
          pedidos.map((pedido, key) => <span key={key}> {pedido}</span>)}
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
        <button disabled={isInvalid} type="button" onClick={this.createDeposit}>
          Crear Deposito
        </button>
        <button
          disabled={isInvalid}
          type="button"
          onClick={this.restartDeposit}
        >
          Reiniciar deposito
        </button>
        {showDeposit && <Deposit rows={rows} columns={columns} />}
      </Fragment>
    );
  }
}
const UserList = ({ users }) => (
  <ListGroup>
    {users.map(user => (
      <ListGroup.Item key={user.uid}>
        <span>
          <strong>ID:</strong> {user.uid}
        </span>
        <span>
          <strong>E-Mail:</strong> {user.email}
        </span>
        <span>
          <strong>Nombre de usuario:</strong> {user.username}
        </span>
      </ListGroup.Item>
    ))}
  </ListGroup>
);
const condition = authUser => authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(
  withAuthorization(condition),
  withFirebase
)(AdminPage);

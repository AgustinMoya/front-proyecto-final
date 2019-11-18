import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";

import { withFirebase } from "../Firebase";
import Image from "react-bootstrap/Image";
import Alert from "react-bootstrap/Alert";

import * as ROUTES from "../../constants/routes";
import * as ROLES from "../../constants/roles";

import logo from "./Logo grande 3.PNG";
import "./styles.scss";

const INITIAL_STATE = {
  username: "",
  email: "",
  passwordOne: "",
  passwordTwo: "",
  isAdmin: false,
  error: null
};

const ERROR_CODE_ACCOUNT_EXISTS = "auth/email-already-in-use";

const ERROR_MSG_ACCOUNT_EXISTS = `
Ya existe una cuenta con esta dirección de correo electrónico.
Intenta crear una cuenta con distinto mail`;
const SignUpPage = () => (
  <div className="form-signin">
    <Image src={logo} fluid />
    <h1>Registrate</h1>
    <SignUpForm />
  </div>
);

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { username, email, passwordOne, isAdmin } = this.state;
    const roles = {};
    if (isAdmin) {
      roles[ROLES.ADMIN] = ROLES.ADMIN;
    }
    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Se crea el usuario en firebase database
        return this.props.firebase.user(authUser.user.uid).set({
          username,
          email,
          roles
        });
      })
      .then(authUser => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onChangeCheckbox = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
      isAdmin
    } = this.state;
    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === "" ||
      email === "" ||
      username === "";
    return (
      <form onSubmit={this.onSubmit}>
        <label htmlFor="inputNombre" className="sr-only">
          Nombre completo
        </label>
        <input
          id="inputNombre"
          className="form-control"
          name="username"
          type="text"
          placeholder="Nombre completo"
          value={username}
          onChange={this.onChange}
          style={{ marginBottom: "15px" }}
        />
        <label htmlFor="inputEmail" className="sr-only">
          Correo electrónico
        </label>
        <input
          id="inputEmail"
          className="form-control"
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={this.onChange}
        />
        <label htmlFor="inputPassword" className="sr-only">
          Contraseña
        </label>
        <input
          id="inputPassword"
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          placeholder="Contraseña"
          className="form-control"
          type="password"
        />
        <label htmlFor="inputPassword2" className="sr-only">
          Confirmar contraseña
        </label>
        <input
          id="inputPassword2"
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          placeholder="Confirmar contraseña"
          className="form-control"
          type="password"
        />

        <div class="form-group form-check">
          <input
            type="checkbox"
            class="form-check-input"
            id="admin"
            name="isAdmin"
            checked={isAdmin}
            onChange={this.onChangeCheckbox}
          />
          <label class="form-check-label" for="admin">
            Administrador
          </label>
        </div>
        <button
          className="btn btn-lg btn-primary btn-block"
          disabled={isInvalid}
          style={{ padding: "initial" }}
          type="submit"
        >
          Registrarse
        </button>

        {error && <Alert variant="danger">{error.message}</Alert>}
      </form>
    );
  }
}

const SignUpLink = () => (
  <p>
    ¿No tenés una cuenta? <Link to={ROUTES.SIGN_UP}>Registrate!</Link>
  </p>
);

const SignUpForm = compose(
  withRouter,
  withFirebase
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };

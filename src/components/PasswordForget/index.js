import React, { Component } from "react";
import { Link } from "react-router-dom";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import Alert from "react-bootstrap/Alert";
import Image from "react-bootstrap/Image";

import logo from "./Logo grande 3.PNG";

const ERROR_CODE_USER_NOT_FOUND = "auth/user-not-found";

const ERROR_MSG_USER_NOT_FOUND = `Mail no encontrado`;

const PasswordForgetPage = () => (
  <div className="form-signin">
    <Image src={logo} fluid />

    <h2>Recuperar contraseña</h2>
    <PasswordForgetForm />
  </div>
);

const INITIAL_STATE = {
  email: "",
  error: null
};

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email } = this.state;

    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        console.log("error firebase", error);
        if (error.code === ERROR_CODE_USER_NOT_FOUND) {
          error.message = ERROR_MSG_USER_NOT_FOUND;
        }
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, error } = this.state;

    const isInvalid = email === "";

    return (
      <form onSubmit={this.onSubmit}>
        <label htmlFor="inputEmail" className="sr-only">
          Correo electrónico
        </label>
        <input
          id="inputEmail"
          className="form-control"
          name="email"
          type="email"
          placeholder="Email"
          value={this.state.email}
          onChange={this.onChange}
        />
        <button
          className="btn btn-lg btn-primary btn-block"
          disabled={isInvalid}
          style={{ padding: "initial", marginBottom: "15px" }}
          type="submit"
        >
          Recuperar mi contraseña
        </button>

        {error && <Alert variant="danger">{error.message}</Alert>}
      </form>
    );
  }
}
const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>¿Olvidaste tu contraseña?</Link>
  </p>
);

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };

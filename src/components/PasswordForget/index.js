import React, { Component } from "react";
import { Link } from "react-router-dom";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import Alert from "react-bootstrap/Alert";

const PasswordForgetPage = () => (
  <div>
    <h1>PasswordForget</h1>
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
          style={{ padding: "initial" }}
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

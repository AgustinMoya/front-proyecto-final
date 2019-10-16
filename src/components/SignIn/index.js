import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Image from "react-bootstrap/Image";

import { SignUpLink } from "../SignUp";
import { PasswordForgetLink } from "../PasswordForget";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

import logo from "./Logo grande 3.PNG";
import "./styles.scss";

const ERROR_CODE_ACCOUNT_EXISTS =
  "auth/account-exists-with-different-credential";

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with an E-Mail address to
  this social account already exists. Try to login from
  this account instead and associate your social accounts on
  your personal account page.
`;
const SignInPage = () => (
  <div className="form-signin">
    <Image src={logo} fluid />
    <SignInForm />
    <SignInGoogle />
    <PasswordForgetLink />
    <SignUpLink />
  </div>
);

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
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
    const { email, password, error } = this.state;

    const isInvalid = password === "" || email === "";

    return (
      <form onSubmit={this.onSubmit}>
        <h1 className="h3 mb-3 font-weight-normal">Por favor, ingresá</h1>
        <label htmlFor="inputEmail" className="sr-only">
          Correo electrónico
        </label>
        <input
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
          className="form-control"
          id="inputPassword"
          name="password"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={this.onChange}
        />

        <button
          disabled={isInvalid}
          className="btn btn-lg btn-primary btn-block"
          type="submit"
        >
          Ingresar
        </button>
        {error && <Alert variant="danger">{error.message}</Alert>}

        <p className="mt-5 mb-3 text-muted">© 2019-2019</p>
      </form>
    );
  }
}

class SignInGoogleBase extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  onSubmit = event => {
    this.props.firebase
      .doSignInWithGoogle()
      .then(socialAuthUser => {
        return this.props.firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.user.displayName,
          email: socialAuthUser.user.email,
          roles: {}
        });
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }
        this.setState({ error });
      });
    event.preventDefault();
  };
  render() {
    const { error } = this.state;
    return (
      <form onSubmit={this.onSubmit} className="margin-bottom">
        <Button type="submit" variant="info" disabled>
          Ingresar con Google
        </Button>
        {error && <Alert variant="danger">{error.message}</Alert>}
      </form>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase
)(SignInFormBase);

const SignInGoogle = compose(
  withRouter,
  withFirebase
)(SignInGoogleBase);

export default SignInPage;

export { SignInForm, SignInGoogle };

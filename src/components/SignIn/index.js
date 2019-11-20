import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Image from "react-bootstrap/Image";

import { SignUpLink } from "../SignUp";
import { PasswordForgetLink } from "../PasswordForget";
import { withFirebase } from "../Firebase";
import { withPlatformValue } from "../Platform/context";
import * as ROUTES from "../../constants/routes";

import ApiClient from "../../api-client/index";

import logo from "./Logo grande 3.PNG";
import "./styles.scss";

const ERROR_CODE_ACCOUNT_EXISTS =
  "auth/account-exists-with-different-credential";

const ERROR_CODE_WRONG_PASSWORD = "auth/wrong-password";
const ERROR_MSG_WRONG_PASSWORD =
  "La contraseña es invalida o el usuario no existe";

const ERROR_MSG_ACCOUNT_EXISTS = `Datos erroneos, verificar mail o contraseña`;

const SignInPage = () => (
  <div className="form-signin">
    <Image src={logo} fluid />
    <SignInForm />
    <PasswordForgetLink />
    <SignUpLink />
  </div>
);

const INITIAL_STATE = {
  email: "",
  password: "",
  platform: "Seleccionar plataforma",
  platforms: [],
  error: null
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    ApiClient.getAllPlatforms().then(({ data }) => {
      this.setState({
        platforms: data
      });
    });
  }
  onSubmit = event => {
    const { email, password, platform, platforms } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.setPlatformValue(platform);
        // eslint-disable-next-line eqeqeq
        const found = platforms.find(p => p.id == platform);
        localStorage.setItem("platform", platform);
        localStorage.setItem(
          "posicion",
          JSON.stringify([found.loc1, found.loc2])
        );
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_WRONG_PASSWORD) {
          error.message = ERROR_MSG_WRONG_PASSWORD;
        }
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, platform, platforms, error } = this.state;

    const isInvalid =
      password === "" || email === "" || platform === "Seleccionar plataforma";

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
        <select
          className="custom-select margin-bottom"
          name="platform"
          value={platform}
          onChange={this.onChange}
        >
          <option disabled>Seleccionar plataforma</option>
          {platforms.map(platform => (
            <option value={platform.id}>{platform.id}</option>
          ))}
        </select>
        <button
          disabled={isInvalid}
          className="btn btn-lg btn-primary btn-block"
          type="submit"
          style={{ padding: "initial" }}
        >
          <span>Ingresar</span>
        </button>
        {error && (
          <Alert style={{ marginTop: "20px" }} variant="danger">
            {error.message}
          </Alert>
        )}

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
  withFirebase,
  withPlatformValue
)(SignInFormBase);

const SignInGoogle = compose(
  withRouter,
  withFirebase,
  withPlatformValue
)(SignInGoogleBase);

export default SignInPage;

export { SignInForm, SignInGoogle };

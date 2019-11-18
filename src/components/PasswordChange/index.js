import React, { Component } from "react";

import { withFirebase } from "../Firebase";
import Alert from "react-bootstrap/Alert";

const INITIAL_STATE = {
  passwordOne: "",
  passwordTwo: "",
  error: null
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { passwordOne } = this.state;

    this.props.firebase
      .doPasswordUpdate(passwordOne)
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
    const { passwordOne, passwordTwo, error } = this.state;

    const isInvalid = passwordOne !== passwordTwo || passwordOne === "";

    return (
      <form onSubmit={this.onSubmit}>
        <label htmlFor="inputPassword" className="sr-only">
          Contraseña
        </label>
        <input
          id="inputPassword"
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          placeholder="Nueva contraseña"
          className="form-control"
          type="password"
          style={{ marginTop: "15px" }}
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
        <button
          className="btn btn-lg btn-primary btn-block"
          disabled={isInvalid}
          style={{ padding: "initial" }}
          type="submit"
        >
          Cambiar mi contraseña
        </button>

        {error && <Alert variant="danger">{error.message}</Alert>}
      </form>
    );
  }
}

export default withFirebase(PasswordChangeForm);

import React, { Component } from "react";

import { withFirebase } from "../Firebase";
import Alert from "react-bootstrap/Alert";

const INITIAL_STATE = {
  passwordOne: "",
  passwordTwo: "",
  passwordTitle: null,
  passwordMessages: [],
  error: null
};
const passwordRegex = /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/;

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { passwordOne } = this.state;

    if (!passwordRegex.test(passwordOne)) {
      event.preventDefault();
      this.setState({
        passwordTitle: "La contraseña debera tener:",
        passwordMessages: [
          "Al menos 8 caracteres",
          "Incluir al menos 1 letra minuscula",
          "Incluir al menos 1 letra mayuscula",
          "Incluir al menos 1 numero",
          "Incluir al menos un caracter especial -> !@#$%^&*"
        ]
      });
      return;
    }
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
    const {
      passwordOne,
      passwordTwo,
      error,
      passwordTitle,
      passwordMessages
    } = this.state;

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

        {passwordTitle && (
          <Alert
            variant="warning"
            style={{ marginTop: "15px", textAlign: "left" }}
          >
            {passwordTitle}
            <ul>
              {passwordMessages.map(message => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </Alert>
        )}
        {error && <Alert variant="danger">{error.message}</Alert>}
      </form>
    );
  }
}

export default withFirebase(PasswordChangeForm);

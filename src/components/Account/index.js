import React, { Component } from "react";
import { AuthUserContext, withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";

import { PasswordForgetForm } from "../PasswordForget";
import PasswordChangeForm from "../PasswordChange";

import Image from "react-bootstrap/Image";

import logo from "./Logo grande 3.PNG";

import "./styles.scss";

const SIGN_IN_METHODS = [
  {
    id: "password",
    provider: null
  },
  {
    id: "google.com",
    provider: "googleProvider"
  }
];

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div className="form-signin">
        <Image src={logo} fluid />
        <div>
          <h2>Mi cuenta:</h2>
          <span>{authUser.email}</span>
        </div>
        <hr />
        <h4>Recuperar contraseña</h4>
        <PasswordForgetForm />
        <hr />
        <h4>Cambiar contraseña</h4>
        <PasswordChangeForm />
      </div>
    )}
  </AuthUserContext.Consumer>
);
class LoginManagementBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSignInMethods: [],
      error: null
    };
  }
  componentDidMount() {
    this.fetchSignInMethods();
  }
  fetchSignInMethods = () => {
    this.props.firebase.auth
      .fetchSignInMethodsForEmail(this.props.authUser.email)
      .then(activeSignInMethods =>
        this.setState({ activeSignInMethods, error: null })
      )
      .catch(error => this.setState({ error }));
  };

  onSocialLoginLink = provider => {
    this.props.firebase.auth.currentUser
      .linkWithPopup(this.props.firebase[provider])
      .then(this.fetchSignInMethods)
      .catch(error => this.setState({ error }));
  };
  onUnlink = providerId => {
    this.props.firebase.auth.currentUser
      .unlink(providerId)
      .then(this.fetchSignInMethods)
      .catch(error => this.setState({ error }));
  };

  render() {
    const { activeSignInMethods, error } = this.state;

    return (
      <div>
        Sign In Methods:
        <ul>
          {SIGN_IN_METHODS.map(signInMethod => {
            const onlyOneLeft = activeSignInMethods.length === 1;
            const isEnabled = activeSignInMethods.includes(signInMethod.id);
            return (
              <li key={signInMethod.id}>
                {isEnabled ? (
                  <button
                    type="button"
                    onClick={() => this.onUnlink(signInMethod.id)}
                    disabled={onlyOneLeft}
                  >
                    Deactivate {signInMethod.id}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      this.onSocialLoginLink(signInMethod.provider)
                    }
                  >
                    Link {signInMethod.id}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
        {error && error.message}
      </div>
    );
  }
}
const LoginManagement = withFirebase(LoginManagementBase);

const condition = authUser => !!authUser;
export default withAuthorization(condition)(AccountPage);

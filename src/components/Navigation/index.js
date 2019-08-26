import React from "react";
import { Link } from "react-router-dom";

import { AuthUserContext } from "../Session";

import SignOutButton from "../SignOut";
import * as ROUTES from "../../constants/routes";

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser => (authUser ? <NavigationAuth /> : <NavigationNonAuth />)}
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuth = () => (
  <ul>
    <li>
      <Link to={ROUTES.LANDING}>Landing</Link>
    </li>
    <li>
      <Link to={ROUTES.HOME}>Casa</Link>
    </li>
    <li>
      <Link to={ROUTES.ACCOUNT}>Mi cuenta</Link>
    </li>
    <li>
      <Link to={ROUTES.ADMIN}>Admin</Link>
    </li>
    <li>
      <SignOutButton />
    </li>
  </ul>
);

const NavigationNonAuth = () => (
  <ul>
    <li>
      <Link to={ROUTES.LANDING}>Landing</Link>
    </li>
    <li>
      <Link to={ROUTES.SIGN_IN}>Ingresa</Link>
    </li>
  </ul>
);
export default Navigation;

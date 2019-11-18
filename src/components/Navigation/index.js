import React from "react";
import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import { AuthUserContext } from "../Session";

import SignOutButton from "../SignOut";
import * as ROUTES from "../../constants/routes";
import * as ROLES from "../../constants/roles";

import logo from "./Logo Chico2.png";

const Navigation = () => (
  <AuthUserContext.Consumer>
    {authUser =>
      authUser ? <NavigationAuth authUser={authUser} /> : <NavigationNonAuth />
    }
  </AuthUserContext.Consumer>
);

const NavigationAuth = ({ authUser }) => (
  <Navbar collapseOnSelect expand="md" bg="dark" variant="dark" sticky="top">
    <Navbar.Brand as={Link} to={ROUTES.LANDING}>
      <img
        src={logo}
        width="30"
        height="30"
        className="d-inline-block align-top"
        alt="React Bootstrap logo"
      />
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      <Nav className="mr-auto">
        <Nav.Item>
          <Nav.Link as={Link} to={ROUTES.HOME}>
            Inicio
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to={ROUTES.ACCOUNT}>
            Mi cuenta
          </Nav.Link>
        </Nav.Item>
        {!!authUser.roles[ROLES.ADMIN] && (
          <Nav.Item>
            <Nav.Link as={Link} to={ROUTES.ADMIN}>
              Administrador
            </Nav.Link>
          </Nav.Item>
        )}
      </Nav>
      <Nav>
        <Navbar.Text style={{ marginRight: "15px" }}>
          Conectado como: <a href={ROUTES.ACCOUNT}>{authUser.username}</a>
        </Navbar.Text>
        <Nav.Item>
          <SignOutButton />
        </Nav.Item>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

const NavigationNonAuth = () => (
  <Navbar bg="dark" variant="dark">
    <Navbar.Brand as={Link} to={ROUTES.LANDING}>
      <img
        src={logo}
        width="30"
        height="30"
        className="d-inline-block align-top"
        alt=""
      />
    </Navbar.Brand>
    <Nav className="mr-auto">
      <Nav.Item>
        <Nav.Link as={Link} to={ROUTES.SIGN_IN}>
          Ingresa
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to={ROUTES.SIGN_UP}>
          Registrarse
        </Nav.Link>
      </Nav.Item>
    </Nav>
  </Navbar>
);
export default Navigation;

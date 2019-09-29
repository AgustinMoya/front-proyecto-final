import React from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";

const Landing = () => (
  <Jumbotron fluid>
    <Container>
      <h1>Bienvenidos al proyecto final del Team wall-e</h1>
      <p>
        Este es el frontend de la aplicación, usted podrá realizar diferentes
        acciones dependiendo si es un usuario o un administrador.
      </p>
    </Container>
  </Jumbotron>
);

export default Landing;

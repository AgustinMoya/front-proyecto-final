import React from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import ControlledCarousel from "../Carousel";

const Landing = () => (
  <div>
    <Jumbotron fluid>
      <Container>
        <h1>Bienvenidos al proyecto final del equipo wall-e</h1>
        <p>
          Esta es la pantalla inicial de la aplicacion, usted podra realizar diferentes
          acciones dependiendo si es un usuario o un administrador.
        </p>
      </Container>
    </Jumbotron>
  </div>
);

export default Landing;

import React from "react";
import Carousel from "react-bootstrap/Carousel";
import arduino from "./Arduino.jpeg";
import logo from "./Logo grande 3.PNG";
import prueba from "./Logo Chico2.png";
import styles from "./styles.css";

const ControlledCarousel = () => {
  return (
      <Carousel className="carousel">
        <Carousel.Item>
          <img className='d-block w-100' src={prueba} alt='First slide' />
          <Carousel.Caption>
            <h3>Equipo wall-e</h3>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img className='d-block w-100' src={prueba} alt='Second slide' />
          <Carousel.Caption>
            <h3>Arduino</h3>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
  );
};

export default ControlledCarousel;

import React, { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import arduino from "./Arduino.jpeg";
import logo from "./Logo grande 3.PNG";

const ControlledCarousel = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(null);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
    setDirection(e.direction);
  };

  return (
    <Carousel activeIndex={index} direction={direction} onSelect={handleSelect} style={{ color: 'black' }}>
      <Carousel.Item>
        <img className="d-block w-100" src={logo} alt="First slide" height="300" width="100%"/>
        <Carousel.Caption>
          <h3>Team wall-e</h3>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img className="d-block w-100" src={arduino} alt="Second slide" height="300" width="100%" />
        <Carousel.Caption>
          <h3>Powered by:</h3>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default ControlledCarousel;

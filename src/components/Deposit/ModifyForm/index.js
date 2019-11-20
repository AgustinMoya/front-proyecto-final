import React, { Fragment, useState, Component } from "react";

import styles from "../styles.scss";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ReadOnlyEstante from "../../Estante/ReadOnlyEstante/index";
import ModifyEstante from "../../Estante/ModifyEstante/index";
import Estante from "../../Estante";

class ModifyDeposit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matrix: props.matrix
    };
  }
  updateMatrix = (row, column, flag) => {
    this.setState(prevState => {
      let newMatrix = prevState.matrix;
      newMatrix[row][column] = flag;
      return {
        matrix: newMatrix
      };
    });
  };
  createDeposit = matrix => {
    let depositValue = [];

    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        const seatingStyle = (
          <ModifyEstante
            column={j}
            row={i}
            value={matrix[i][j]}
            handleClick={this.updateMatrix}
          />
        );
        depositValue.push(seatingStyle);

        if (j === matrix[i].length - 1) {
          const seatClear = <div className="clearfix" />;
          depositValue.push(seatClear);
        }
      }
    }
    return depositValue;
  };
  agregarFilaAbajo = matrix => {
    var nuevaFila = new Array(matrix[0].length);
    nuevaFila.fill(0);
    matrix.push(nuevaFila);
    this.setState({
      matrix: matrix
    });
  };

  eliminarFilaAbajo = matrix => {
    matrix.pop();
    this.setState({
      matrix: matrix
    });
  };

  agregarColumnaDerecha = matrix => {
    matrix.forEach(element => element.push(0));
    this.setState({
      matrix: matrix
    });
  };
  eliminarColumnaDerecha = matrix => {
    matrix.forEach(element => element.pop());
    this.setState({
      matrix: matrix
    });
  };

  agregarFilaArriba = matrix => {
    var nuevaFila = new Array(matrix[0].length);
    nuevaFila.fill(0);
    matrix.unshift(nuevaFila);
    this.setState({
      matrix: matrix
    });
  };
  eliminarFilaArriba = matrix => {
    matrix.shift();
    this.setState({
      matrix: matrix
    });
  };
  agregarColumnaIzquierda = matrix => {
    matrix.forEach(element => element.unshift(0));
    this.setState({
      matrix: matrix
    });
  };
  eliminarColumnaIzquierda = matrix => {
    matrix.forEach(element => element.shift());
    this.setState({
      matrix: matrix
    });
  };
  render() {
    const { matrix } = this.state;
    return (
      <Fragment>
        <div className="messagePanel">
          {this.createDeposit(matrix).map(estante => estante)}
        </div>
        <Row style={{ marginTop: "20px" }}>
          <Col xs={12}>
            <h4>Arriba</h4>
          </Col>
          <Col xs={6}>
            <button
              type="button"
              class="btn btn-primary"
              onClick={() => this.agregarFilaArriba(matrix)}
            >
              Agregar fila
            </button>
          </Col>
          <Col xs={6}>
            <button
              type="button"
              class="btn btn-primary"
              onClick={() => this.eliminarFilaArriba(matrix)}
            >
              Eliminar fila
            </button>
          </Col>
        </Row>
        <hr />
        <Row style={{ marginTop: "20px" }}>
          <Col xs={12}>
            <h4>Abajo</h4>
          </Col>
          <Col xs={6}>
            <button
              type="button"
              class="btn btn-primary"
              onClick={() => this.agregarFilaAbajo(matrix)}
            >
              Agregar fila
            </button>
          </Col>
          <Col xs={6}>
            <button
              type="button"
              class="btn btn-primary"
              onClick={() => this.eliminarFilaAbajo(matrix)}
            >
              Eliminar fila
            </button>
          </Col>
        </Row>
        <hr />
        <Row style={{ marginTop: "20px" }}>
          <Col xs={12}>
            <h4>Derecha</h4>
          </Col>
          <Col xs={6}>
            <button
              type="button"
              class="btn btn-primary"
              onClick={() => this.agregarColumnaDerecha(matrix)}
            >
              Agregar columna
            </button>
          </Col>
          <Col xs={6}>
            <button
              type="button"
              class="btn btn-primary"
              onClick={() => this.eliminarColumnaDerecha(matrix)}
            >
              Eliminar columna
            </button>
          </Col>
        </Row>
        <hr />
        <Row style={{ marginTop: "20px" }}>
          <Col xs={12}>
            <h4>Izquierda</h4>
          </Col>
          <Col xs={6}>
            <button
              type="button"
              class="btn btn-primary"
              onClick={() => this.agregarColumnaIzquierda(matrix)}
            >
              Agregar columna
            </button>
          </Col>
          <Col xs={6}>
            <button
              type="button"
              class="btn btn-primary"
              onClick={() => this.eliminarColumnaIzquierda(matrix)}
            >
              Eliminar columna
            </button>
          </Col>
        </Row>
        <hr />
      </Fragment>
    );
  }
}

export default ModifyDeposit;

/*
<Row>
        <Col>
          <Button
            style={{ width: "100%" }}
            className="marginTop"
            type="button"
            variant="success"
            onClick={() => confirmDeposit(matrix)}
          >
            Confirmar depósito
          </Button>
        </Col>
        <Col>
          <Button
            style={{ width: "100%" }}
            className="marginTop"
            type="button"
            variant="warning"
            onClick={() => restartDeposit()}
          >
            Reiniciar deposito
          </Button>
        </Col>
        <Col>
          <Button
            style={{ width: "100%" }}
            className="marginTop"
            type="button"
            variant="info"
            onClick={() => validateDeposit(matrix)}
          >
            Validar deposito
          </Button>
        </Col>
      </Row>
*/

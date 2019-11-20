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
      matrix: props.matrix,
      columnaDerecha: 0,
      columnaIzquierda: 0,
      filaArriba: 0,
      filaAbajo: 0
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
    this.setState(prevState => ({
      matrix: matrix,
      filaAbajo: prevState.filaAbajo + 1
    }));
  };

  eliminarFilaAbajo = matrix => {
    matrix.pop();
    this.setState(prevState => ({
      matrix: matrix,
      filaAbajo: prevState.filaAbajo - 1
    }));
  };

  agregarColumnaDerecha = matrix => {
    matrix.forEach(element => element.push(0));
    this.setState(prevState => ({
      matrix: matrix,
      columnaDerecha: prevState.columnaDerecha + 1
    }));
  };
  eliminarColumnaDerecha = matrix => {
    matrix.forEach(element => element.pop());
    this.setState(prevState => ({
      matrix: matrix,
      columnaDerecha: prevState.columnaDerecha - 1
    }));
  };

  agregarFilaArriba = matrix => {
    var nuevaFila = new Array(matrix[0].length);
    nuevaFila.fill(0);
    matrix.unshift(nuevaFila);
    this.setState(prevState => ({
      matrix: matrix,
      filaArriba: prevState.filaArriba + 1
    }));
  };
  eliminarFilaArriba = matrix => {
    matrix.shift();
    this.setState(prevState => ({
      matrix: matrix,
      filaArriba: prevState.filaArriba - 1
    }));
  };
  agregarColumnaIzquierda = matrix => {
    matrix.forEach(element => element.unshift(0));
    this.setState(prevState => ({
      matrix: matrix,
      columnaIzquierda: prevState.columnaIzquierda + 1
    }));
  };
  eliminarColumnaIzquierda = matrix => {
    matrix.forEach(element => element.shift());
    this.setState(prevState => ({
      matrix: matrix,
      columnaIzquierda: prevState.columnaIzquierda - 1
    }));
  };

  cancelModificarDeposito = cancelModifyDeposit => {
    this.setState({
      columnaDerecha: 0,
      columnaIzquierda: 0,
      filaArriba: 0,
      filaAbajo: 0
    });
    cancelModifyDeposit();
  };

  validarDeposito = (matrix, validateDeposit) => {
    validateDeposit(matrix);
  };
  render() {
    const { matrix } = this.state;
    const { validateDeposit, confirmDeposit, cancelModifyDeposit } = this.props;
    return (
      <Fragment>
        <Row style={{ marginBottom: "30px" }}>
          <Col>
            <Button
              style={{ width: "100%" }}
              className="marginTop"
              type="button"
              variant="success"
              onClick={() => confirmDeposit(this.state)}
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
              onClick={() => this.cancelModificarDeposito(cancelModifyDeposit)}
            >
              Cancelar modificacion deposito
            </Button>
          </Col>
          <Col>
            <Button
              style={{ width: "100%" }}
              className="marginTop"
              type="button"
              variant="info"
              onClick={() => this.validarDeposito(matrix, validateDeposit)}
            >
              Validar deposito
            </Button>
          </Col>
        </Row>
        <div className="messagePanel" style={{ margin: "auto" }}>
          {this.createDeposit(matrix).map(estante => estante)}
        </div>
        <div style={{ marginTop: "30px" }}>
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
                disabled={matrix.length === 2}
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
                disabled={matrix.length === 2}
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
                disabled={matrix[0].length === 2}
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
                disabled={matrix[0].length === 2}
              >
                Eliminar columna
              </button>
            </Col>
          </Row>
          <hr />
        </div>
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

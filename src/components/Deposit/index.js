import React, { Fragment, useState } from "react";

import Estante from "../Estante";
import styles from "./styles.scss";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const initialMatrix = (columns, rows) => {
  let matrix = [];
  for (let i = 0; i < rows; i++) {
    matrix[i] = [];
    for (let j = 0; j < columns; j++) {
      matrix[i][j] = 0;
    }
  }
  return matrix;
};

const Deposit = ({
  columns,
  rows,
  confirmDeposit,
  restartDeposit,
  validateDeposit,
}) => {
  const [matrix, setMatrix] = useState(initialMatrix(columns, rows));

  const updateMatrix = (row, column, flag) => {
    matrix[row][column] = flag;
  };

  const createDeposit = (row, column) => {
    let depositValue = [];

    for (let i = 0; i < row; i++) {
      for (let j = 0; j < column; j++) {
        const seatingStyle = (
          <Estante column={j} row={i} handleClick={updateMatrix} />
        );
        depositValue.push(seatingStyle);

        if (j === column - 1) {
          const seatClear = <div className="clearfix" />;
          depositValue.push(seatClear);
        }
      }
    }
    return depositValue;
  };

  return (
    <Fragment>
      <div className="messagePanel">
        {createDeposit(rows, columns).map(estante => estante)}
      </div>
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
    </Fragment>
  );
};

export default Deposit;

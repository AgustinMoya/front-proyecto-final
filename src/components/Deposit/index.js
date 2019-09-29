import React, { useState } from "react";

import classnames from "classnames";

import styles from "./styles.scss";

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

const Deposit = ({ columns, rows }) => {
  const [matrix, setMatrix] = useState(initialMatrix(columns, rows));

  const updateMatrix = (row, column, flag) => {
    //TODO: Chequear
    // setMatrix((matrix[row][column] = flag));
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
    <div className="messagePanel">
      {createDeposit(rows, columns).map(estante => estante)}
    </div>
  );
};

const Estante = ({ row, column, handleClick }) => {
  const [count, setCount] = useState(0);

  const toggleSelected = () => {
    if (count === 3) {
      setCount(0);
    } else {
      setCount(count + 1);
    }
  };

  const selected = () => {
    handleClick(row, column, count);
    switch (count) {
      case 1:
        return "tower";
      case 2:
        return "initial";
      case 3:
        return "blocked";
      default:
        return "free";
    }
  };
  return (
    <div
      key={column}
      onClick={() => {
        toggleSelected();
      }}
      className={classnames("seat", selected())}
    />
  );
};
export default Deposit;

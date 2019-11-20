import React from "react";

import ReadOnlyEstante from "../../Estante/ReadOnlyEstante/index";
import styles from "../styles.scss";

const ReadOnlyDeposit = ({ matrix }) => {
  const createDeposit = matrix => {
    let depositValue = [];

    for (let i = 0; i < matrix.length ; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        const seatingStyle = (
          <ReadOnlyEstante column={j} row={i} value={matrix[i][j]} />
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

  return (
    <div className="messagePanel" style={{ margin: "auto" }}>
      {createDeposit(matrix).map(estante => estante)}
    </div>
  );
};

export default ReadOnlyDeposit;

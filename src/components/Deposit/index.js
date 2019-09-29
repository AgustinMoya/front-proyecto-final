import React, { useState } from "react";

import classnames from "classnames";

import styles from "./styles.scss";

const Deposit = ({ columns, rows }) => {
  const createDeposit = (row, column) => {
    let depositValue = [];

    for (let i = 0; i < row; i++) {
      for (let j = 0; j < column; j++) {
        const seatingStyle = <Estante index={j} />;
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

const Estante = index => {
  const [activeSelected, setSelected] = useState(false);
  const [activeHover, setHover] = useState(false);

  const toggleSelected = () => {
    setSelected(!activeSelected);
  };
  const onMouseEnter = () => {
    setHover(true);
  };
  const onMouseLeave = () => {
    setHover(false);
  };

  return (
    <div
      key={index}
      onClick={toggleSelected}
      className={classnames(
        "seat available",
        activeSelected ? "selected" : null,
        activeHover ? "hovering" : null
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
};
export default Deposit;

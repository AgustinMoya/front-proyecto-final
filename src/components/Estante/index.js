import React, { useState, useEffect } from "react";
import classnames from "classnames";
import styles from "./styles.scss";

const Estante = ({ row, column, handleClick }) => {
  const [count, setCount] = useState(0);

  const toggleSelected = () => {
    if (count === 3) {
      setCount(0);
    } else {
      setCount(count + 1);
    }
  };

  useEffect(() => {
    handleClick(row, column, count);
  }, [count]);

  const selected = () => {
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

export default Estante;

import React from "react";
import classnames from "classnames";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import styles from "../styles.scss";

const ReadOnlyEstante = ({ row, column, value }) => {
  const selected = value => {
    switch (value) {
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
    <OverlayTrigger
      placement="right-start"
      delay={{ show: 100, hide: 100 }}
      overlay={renderTooltip(row, column)}
      trigger="hover"
    >
      <div key={column} className={classnames("seat", selected(value))} />
    </OverlayTrigger>
  );
};
const renderTooltip = (row, column) => (
  <div
    style={{
      backgroundColor: "rgba(0, 0, 0, 0.85)",
      padding: "2px 10px",
      color: "white",
      borderRadius: 3
    }}
  >
    {`Fila: ${row}, Columna ${column}`}
  </div>
);

export default ReadOnlyEstante;

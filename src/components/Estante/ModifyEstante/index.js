import React, { Component } from "react";
import classnames from "classnames";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import styles from "../styles.scss";

class ModifyEstante extends Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0
    };
  }
  selected = value => {
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

  handleCount = () => {
    const { handleClick, row, column } = this.props;
    if (this.state.count === 3) {
      this.setState(
        {
          count: 0
        },
        () => handleClick(row, column, this.state.count)
      );
    } else {
      this.setState(
        prevState => ({
          count: prevState.count + 1
        }),
        () => handleClick(row, column, this.state.count)
      );
      handleClick(row, column, this.state.count);
    }
  };
  render() {
    const { row, column, value } = this.props;

    return (
      <OverlayTrigger
        placement="right-start"
        delay={{ show: 100, hide: 100 }}
        overlay={renderTooltip(row, column)}
        trigger="hover"
      >
        <div
          key={column}
          onClick={() => this.handleCount()}
          className={classnames("seat", this.selected(value))}
        />
      </OverlayTrigger>
    );
  }
}
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

export default ModifyEstante;

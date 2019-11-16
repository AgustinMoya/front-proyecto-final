import React from "react";
import Button from "react-bootstrap/Button";

import { withFirebase } from "../Firebase";

const SignOutButton = ({ firebase }) => {
  const handleClick = () => {
    localStorage.clear();
    firebase.doSignOut();
  };
  return (
    <Button onClick={handleClick} variant="danger" style={{ width: "100%" }}>
      Desloguear
    </Button>
  );
};

export default withFirebase(SignOutButton);

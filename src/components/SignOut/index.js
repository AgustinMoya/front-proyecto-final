import React from "react";
import Button from "react-bootstrap/Button";

import { withFirebase } from "../Firebase";

const SignOutButton = ({ firebase }) => (
  <Button onClick={firebase.doSignOut} variant="danger" style={{width: "100%"}}>
    Desloguear
  </Button>
);

export default withFirebase(SignOutButton);

import React from "react";
import { withAuthorization } from "../Session";
const HomePage = () => (
  <div>
    <h1>Página principal</h1>
    <p>La página de "Home" solo puede ser vista por usuarios logueados</p>
  </div>
);

//TODO: Chequea que no sea null, cambiar por rol de usuario si se implementa alguna pagina solo para ADMIN
const condition = authUser => !!authUser;
export default withAuthorization(condition)(HomePage);

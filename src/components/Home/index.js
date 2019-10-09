import React from "react";
import { withAuthorization } from "../Session";
const HomePage = () => (
  <div class="container">
    <h1>Bienvenidos Nacho</h1>
    <div class="row">
      <div class="col-sm-8">
        <div class="card">
          <h5 class="card-header">Tabla pedidos</h5>
          <div class="card-body">
          <div class="table-responsive">

            <table class="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Numero Articulo</th>
                  <th scope="col">Producto</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Ver</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">1</th>
                  <td>123814</td>
                  <td>Iphone</td>
                  <td>En proceso</td>
                  <td><a href="#" class="btn btn-primary">Go somewhere</a></td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>

      <div class="col-sm-4">
        <div class="card">
          <h5 class="card-header">Acciones</h5>
          <div class="card-body">
            <div class="card" >
              <ul class="list-group list-group-flush">
                <li class="list-group-item">Buscar torre</li>
                <li class="list-group-item">Ver deposito</li>
                <li class="list-group-item">Ver robots</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

//TODO: Chequea que no sea null, cambiar por rol de usuario si se implementa alguna pagina solo para ADMIN
const condition = authUser => !!authUser;
export default withAuthorization(condition)(HomePage);

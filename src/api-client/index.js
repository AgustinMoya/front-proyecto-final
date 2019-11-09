import axios from "axios";

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: "http://localhost:5000",
      timeout: 4000
    });
  }

  endpoints = {
    getAllPedidos: "/v1/pedidos/all",
    getPedido: "/v1/pedidos", //TODO: Query params
    deletePedido: (id) => `/v1/pedidos/${id}`,
    createMatrix: '/v1/matrix', //TODO: POST
    validateMatrix: '/v1/matrix/validate', //TODO: POST
    insertCsv: "/v1/articulos/csv", //TODO: POST
  };

  getAllPedidos() {
    return this.client.get(this.endpoints.getAllPedidos);
  }

  getPedido() {
    //TODO: Faltan los query params q se van a mandar
    return this.client.get(this.endpoints.getPedidoActual);
  }
  deletePedido(id) {
    return this.client.delete(this.endpoints.deletePedido(id));
  }

  confirmMatrix(matrix) {
    return this.client.post(
      this.endpoints.createMatrix,
      { matrix: matrix },
      {
        headers: {
          "Content-type": "application/json"
        }
      }
    );
  }
  validateMatrix(matrix) {
    return this.client.post(
      this.endpoints.validateMatrix,
      { matrix: matrix },
      {
        headers: {
          "Content-type": "application/json"
        }
      }
    );
  }
  insertCsv(file) {
    return this.client.post(
      this.endpoints.insertCsv,
      file,
      {
        headers: {
          "Content-type": "multipart/form-data"
        }
      }
    );
  }
  queuePedido(pedido) {
    return this.client.post(this.endpoints.queuePedido, pedido, {
      headers: {
        "Content-type": "application/json"
      }
    });
  }
}

export default new ApiClient();

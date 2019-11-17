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
    getPedido: idPlataforma => `/v1/pedidos?id_plataforma=${idPlataforma}`, //TODO: Query params
    deletePedido: id => `/v1/pedidos/${id}`,
    getAllPlatforms: "/v1/plataforma/all",
    getTorre: "/v1/pedidos/torre",
    getAllTorres: "/v1/torres/all",
    createMatrix: "/v1/matrix", //TODO: POST
    validateMatrix: "/v1/matrix/validate", //TODO: POST
    getMatrix: "/v1/matrix", //TODO: GET
    insertCsv: "/v1/articulos/csv" //TODO: POST
  };

  getAllPedidos() {
    return this.client.get(this.endpoints.getAllPedidos);
  }

  getAllPlatforms() {
    return this.client.get(this.endpoints.getAllPlatforms);
  }
  getPedido(idPlataforma) {
    return this.client.get(this.endpoints.getPedido(idPlataforma));
  }
  deletePedido(id) {
    return this.client.delete(this.endpoints.deletePedido(id));
  }

  postTorre(data) {
    return this.client.post(this.endpoints.getTorre, data);
  }
  getAllTorres() {
    return this.client.get(this.endpoints.getAllTorres);
  }

  getMatrix() {
    return this.client.get(this.endpoints.getMatrix);
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
    return this.client.post(this.endpoints.insertCsv, file, {
      headers: {
        "Content-type": "multipart/form-data"
      }
    });
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

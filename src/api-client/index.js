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
    getPedido: idPlataforma => `/v1/pedidos?id_plataforma=${idPlataforma}`,
    liberarPedido: (id, plataforma) =>
      `/v1/plataforma/leave?id_pedido=${id}&id_plataforma=${plataforma}`,
    getAllPlatforms: "/v1/plataforma/all",
    getTorre: "/v1/pedidos/torre",
    getAllTorres: "/v1/torres/all",
    createMatrix: "/v1/matrix",
    validateMatrix: "/v1/matrix/validate",
    getMatrix: "/v1/matrix",
    putMatrix: "/v1/matrix",
    insertCsv: "/v1/articulos/csv",
    getAllRobots: "/v1/robots/all",
    getRobot: idRobot => `/v1/robots?id=${idRobot}`,
    deleteRobot: idRobot => `/v1/robots/${idRobot}`,
    createRobot: "/v1/robots",
    stopRobot: idRobot => `/v1/robots/${idRobot}/stop`, //PUT
    resumeRobot: idRobot => `/v1/robots/${idRobot}/resume`, //PUT
    stopAllRobots: "/v1/robots/all/stop",
    resumeAllRobots: "/v1/robots/all/resume"
  };
  getAllRobots() {
    return this.client.get(this.endpoints.getAllRobots);
  }
  getRobot(idRobot) {
    return this.client.get(this.endpoints.getRobot(idRobot));
  }
  deleteRobot(idRobot) {
    return this.client.delete(this.endpoints.deleteRobot(idRobot));
  }
  createRobot(posicion) {
    return this.client.post(this.endpoints.createRobot, posicion);
  }
  stopRobot(idRobot) {
    return this.client.put(this.endpoints.stopRobot(idRobot));
  }
  resumeRobot(idRobot) {
    return this.client.put(this.endpoints.resumeRobot(idRobot));
  }
  stopAllRobots() {
    return this.client.put(this.endpoints.stopAllRobots);
  }
  resumeAllRobots() {
    return this.client.put(this.endpoints.resumeAllRobots);
  }
  getAllPedidos() {
    return this.client.get(this.endpoints.getAllPedidos);
  }

  getAllPlatforms() {
    return this.client.get(this.endpoints.getAllPlatforms);
  }
  getPedido(idPlataforma) {
    return this.client.get(this.endpoints.getPedido(idPlataforma));
  }
  liberarPedido(id, plataforma) {
    return this.client.put(this.endpoints.liberarPedido(id, plataforma));
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
  modifyMatrix(data) {
    return this.client.put(this.endpoints.modifyMatrix, data, {
      headers: {
        "Content-type": "application/json"
      }
    });
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

  insertCsv(formData) {
    return this.client.post(this.endpoints.insertCsv, formData, {
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

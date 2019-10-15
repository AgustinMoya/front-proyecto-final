import axios from "axios";

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: "http://localhost:5000",
      timeout: 4000
    });
  }

  endpoints = {
    getPedidoActual: "/verpedidoactual",
    getAllPedidos: "/vertodospedidos",
    cancelPedido: "/cancelarpedido",
    queuePedido: "/encolarpedido",
    confirmMatrix: "/receivematrix",
    receiveCsv: "/insertcsv",
  };

  getPedido() {
    return this.client.get(this.endpoints.getPedidoActual);
  }

  getAllPedidos() {
    return this.client.get(this.endpoints.getAllPedidos);
  }
  cancelPedido(pedido) {
    return this.client.post(this.endpoints.cancelPedido, pedido, {
      headers: {
        "Content-type": "application/json"
      }
    });
  }
  confirmMatrix(matrix) {
    return this.client.post(
      this.endpoints.confirmMatrix,
      { matrix: matrix },
      {
        headers: {
          "Content-type": "application/json"
        }
      }
    );
  }
  receiveCsv(file) {
    return this.client.post(
      this.endpoints.receiveCsv,
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

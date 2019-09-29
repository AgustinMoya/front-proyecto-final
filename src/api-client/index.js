import axios from "axios";

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: 'http://localhost:5000',
      timeout: 4000,
    });
  }

  endpoints = {
    getPedidoActual: "/verpedidoactual",
    getAllPedidos: "/vertodospedidos",
    cancelPedido: "/cancelarpedido",
    queuePedido: "/encolarpedido"
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
  queuePedido(pedido) {
    return this.client.post(this.endpoints.cancelPedido, pedido, {
      headers: {
        "Content-type": "application/json"
      }
    });
  }
}

export default new ApiClient();

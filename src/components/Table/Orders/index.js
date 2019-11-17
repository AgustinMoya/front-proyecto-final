import React, { useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";

import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import Col from "react-bootstrap/Col";

import ApiClient from "../../../api-client/index";

const { SearchBar } = Search;
const prueba = (from, to, size) => (
  <button type="button" className="btn btn-primary btn-sm">
    Liberar pedido
  </button>
);
const columnTable = (plataforma, setMessage, setCode) => [
  {
    dataField: "id",
    text: "ID de pedido",
    classes: "columnColor",
    headerClasses: "headerColor",
    searchable: false
  },
  {
    dataField: "id_articulo",
    text: "ID de articulo",
    classes: "columnColor",
    headerClasses: "headerColor",
    sort: true,
    searchable: false,
    formatter: cell => (cell ? cell : "No hay articulo asociado")
  },
  {
    dataField: "id_torre",
    text: "ID de torre",
    classes: "columnColor",
    headerClasses: "headerColor",
    sort: true,
    searchable: false
  },
  {
    dataField: "name",
    text: "Nombre de producto",
    classes: "columnColor",
    headerClasses: "headerColor",
    sort: true,
    searchable: true,
    formatter: cell => (cell ? cell : "No hay articulo asociado")
  },
  {
    dataField: "id_orden_compra",
    text: "Orden de compra",
    classes: "columnColor",
    headerClasses: "headerColor",
    sort: true,
    searchable: true,
    formatter: cell => (cell ? cell : "No hay articulo asociado")
  },
  {
    dataField: "estado",
    text: "Estado pedido",
    classes: "columnColor",
    headerClasses: "headerColor",
    sort: true,
    searchable: true
  },
  {
    dataField: "id_robot",
    text: "ID de robot",
    formatter: cell => (cell ? cell : "No hay robot asignado todavia"),
    classes: "columnColor",
    headerClasses: "headerColor",
    sort: true,
    searchable: true
  },
  {
    dataField: "delete",
    text: "Accion",
    classes: "columnColor",
    headerClasses: "headerColor",
    events: {
      onClick: (e, column, columnIndex, row, rowIndex) => {
        ApiClient.liberarPedido(row.id, plataforma)
          .then(({ data, status }) => {
            setCode(status);
            setMessage(data);
          })
          .catch(error => {
            setCode(error.response.status);
            setMessage(error.response.data);
          });
      }
    },
    formatter: prueba
  }
];

const customTotal = (from, to, size) => (
  <span className="marginLeft react-bootstrap-table-pagination-total">
    Mostrando desde {from} a {to} pedidos de {size}
  </span>
);

const tableOptions = orders => ({
  paginationSize: 4,
  pageStartIndex: 1,
  // alwaysShowAllBtns: true, // Always show next and previous button
  // withFirstAndLast: false, // Hide the going to First and Last page button
  // hideSizePerPage: true, // Hide the sizePerPage dropdown always
  hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
  firstPageText: "Primer pagina",
  prePageText: "<",
  nextPageText: ">",
  lastPageText: "Ultima pagina",
  nextPageTitle: "Primera pagina",
  lastPageTitle: "Ultima pagina",
  showTotal: true,
  paginationTotalRenderer: customTotal,
  sizePerPageList: [
    {
      text: "5",
      value: 5
    },
    {
      text: "10",
      value: 10
    },
    {
      text: "Todos",
      value: orders.length
    }
  ]
});

const MyExportCSV = props => {
  const handleClick = () => {
    props.onExport();
  };
  return (
    <button className="btn btn-secondary" onClick={handleClick}>
      Exportar como CSV
    </button>
  );
};

const OrdersTable = ({ orders, plataforma, handleLiberarPedido }) => {
  const [message, setMessage] = useState(null);
  const [code, setCode] = useState(null);

  return (
    <ToolkitProvider
      bootstrap4
      keyField="id"
      data={orders}
      columns={columnTable(
        plataforma,
        setMessage,
        setCode,
        handleLiberarPedido
      )}
      search
      exportCSV
    >
      {props => (
        <div>
          <h3>Listado de pedidos</h3>
          <p>
            Las columnas: nombre de producto, orden de compra y ID de robot son
            filtrables
          </p>
          <div style={{ display: "table-caption" }}>
            <SearchBar
              {...props.searchProps}
              style={{ width: "100%" }}
              placeholder="Buscar"
            />
            <MyExportCSV {...props.csvProps} />
          </div>
          <hr />
          <BootstrapTable
            {...props.baseProps}
            noDataIndication="La tabla no contiene elementos disponibles"
            pagination={paginationFactory(tableOptions(orders))}
          />
          <Row style={{ marginTop: "20px", display: "none" }}>
            <Col xs={12}>
              <button
                className="btn btn-secondary"
                onClick={handleLiberarPedido}
              >
                Refrescar
              </button>
            </Col>
          </Row>
          <Row style={{ marginTop: "20px" }}>
            <Col xs={12}>
              {code === 200 ? (
                <Alert variant="success">{message}</Alert>
              ) : code === 202 ? (
                <Alert variant="info">{message}</Alert>
              ) : code === 404 ? (
                <Alert variant="warning">{message}</Alert>
              ) : code === 500 ? (
                <Alert variant="danger">{message}</Alert>
              ) : null}
            </Col>
          </Row>
        </div>
      )}
    </ToolkitProvider>
  );
};

export default OrdersTable;

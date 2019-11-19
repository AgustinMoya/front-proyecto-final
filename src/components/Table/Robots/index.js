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

const columnTable = [
  {
    dataField: "id",
    text: "ID de robot",
    headerClasses: "headerColor",
    searchable: false
  },
  {
    dataField: "loc1",
    text: "Ubicacion eje X",
    headerClasses: "headerColor",
    sort: true,
    searchable: true
  },
  {
    dataField: "loc2",
    text: "Ubicacion eje Y",
    headerClasses: "headerColor",
    sort: true,
    searchable: true
  },
  {
    dataField: "actual",
    text: "Posicion actual",
    headerClasses: "headerColor",
    sort: true,
    searchable: false,
    formatter: cell => (cell ? cell : "El robot está en la plataforma")
  },
  {
    dataField: "estado",
    text: "Estado del robot",
    headerClasses: "headerColor",
    sort: true,
    searchable: true
  },
  {
    dataField: "camino",
    text: "Camino del robot",
    headerClasses: "headerColor",
    sort: true,
    searchable: true,
    formatter: cell => (cell ? cell : "No tiene un camino asignado")
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

const RobotsTable = ({ robots }) => {
  const selectRow = {
    mode: "radio",
    clickToSelect: true,
    style: { backgroundColor: "lightYellow" },
    headerColumnStyle: {
      backgroundColor: "#343a40"
    }
  };
  return (
    <ToolkitProvider
      bootstrap4
      keyField="id"
      data={robots}
      columns={columnTable}
      search
      exportCSV
    >
      {props => (
        <div>
          <h3>Listado de robots</h3>
          <p>
            Todas las columnas son filtrables, excepto la columna "Id del robot"
          </p>
          <div style={{ display: "table-caption", width: "170px" }}>
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
            selectRow={selectRow}
            pagination={paginationFactory(tableOptions(robots))}
          />
        </div>
      )}
    </ToolkitProvider>
  );
};

export default RobotsTable;

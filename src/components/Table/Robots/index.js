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

const toggleButton = (cell, row) => {
  if (row.estado !== "STOP") {
    return (
      <button type="button" className="btn btn-warning btn-sm">
        Frenar el Robot
      </button>
    );
  } else {
    return (
      <button type="button" className="btn btn-success btn-sm">
        Reanudar el Robot
      </button>
    );
  }
};
const deleteButton = () => (
  <button type="button" className="btn btn-primary btn-sm">
    Eliminar el Robot
  </button>
);
const columnTable = (setMessage, setCode, getAllRobots) => [
  {
    dataField: "id",
    text: "ID de robot",
    classes: "columnColor",
    headerClasses: "headerColor",
    searchable: false
  },
  {
    dataField: "loc1",
    text: "Ubicacion eje X",
    classes: "columnColor",
    headerClasses: "headerColor",
    sort: true,
    searchable: true
  },
  {
    dataField: "loc2",
    text: "Ubicacion eje Y",
    classes: "columnColor",
    headerClasses: "headerColor",
    sort: true,
    searchable: true
  },
  {
    dataField: "estado",
    text: "Estado del robot",
    classes: "columnColor",
    headerClasses: "headerColor",
    sort: true,
    searchable: true
  },
  {
    dataField: "actual",
    text: "Posicion actual",
    classes: "columnColor",
    headerClasses: "headerColor",
    sort: true,
    searchable: false,
    formatter: cell => (cell ? cell : "El robot está en la plataforma")
  },
  {
    dataField: "camino",
    text: "Camino del robot",
    classes: "columnColor",
    headerClasses: "headerColor",
    sort: true,
    searchable: true,
    formatter: cell => (cell ? cell : "No tiene un camino asignado")
  },
  {
    dataField: "delete",
    text: "Eliminar",
    classes: "columnColor",
    headerClasses: "headerColor",
    events: {
      onClick: (e, column, columnIndex, row, rowIndex) => {
        ApiClient.deleteRobot(row.id)
          .then(({ data, status }) => {
            setCode(status);
            setMessage(data);
            getAllRobots();
          })
          .catch(error => {
            setCode(error.response.status);
            setMessage(error.response.data);
          });
      }
    },
    formatter: deleteButton
  },
  {
    dataField: "stop",
    text: "Reanudar/Parar",
    classes: "columnColor",
    headerClasses: "headerColor",
    events: {
      onClick: (e, column, columnIndex, row, rowIndex) => {
        if (row.estado !== "STOP") {
          ApiClient.stopRobot(row.id)
            .then(({ data, status }) => {
              setCode(status);
              setMessage(data);
              getAllRobots();
            })
            .catch(error => {
              setCode(error.response.status);
              setMessage(error.response.data);
            });
        } else {
          ApiClient.resumeRobot(row.id)
            .then(({ data, status }) => {
              setCode(status);
              setMessage(data);
              getAllRobots();
            })
            .catch(error => {
              setCode(error.response.status);
              setMessage(error.response.data);
            });
        }
      }
    },
    formatter: toggleButton
  }
];

const customTotal = (from, to, size) => (
  <span className="marginLeft react-bootstrap-table-pagination-total">
    Mostrando desde {from} a {to} pedidos de {size}
  </span>
);

const tableOptions = robots => ({
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
      value: robots.length
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

const RobotsTable = ({ robots, getAllRobots }) => {
  const [message, setMessage] = useState(null);
  const [code, setCode] = useState(null);
  return (
    <ToolkitProvider
      bootstrap4
      keyField="id"
      data={robots}
      columns={columnTable(setMessage, setCode, getAllRobots)}
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
            pagination={paginationFactory(tableOptions(robots))}
          />
          <Row style={{ marginTop: "20px" }}>
            <Col xs={6}>
              {code >= 200 && code < 300 ? (
                <Alert variant="success">{message}</Alert>
              ) : code >= 400 && code < 500 ? (
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

export default RobotsTable;

import React, { useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";

import ApiClient from "../../../api-client/index";

const { SearchBar } = Search;

const columnTable = () => [
  {
    dataField: "id",
    text: "ID de torre",
    headerClasses: "headerColor",
    searchable: false,
    sort: true
  },
  {
    dataField: "estado",
    text: "Estado de la torre",
    headerClasses: "headerColor",
    sort: true,
    searchable: true
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
  }
];

const customTotal = (from, to, size) => (
  <span className="marginLeft react-bootstrap-table-pagination-total">
    Mostrando desde {from} a {to} pedidos de {size}
  </span>
);

const tableOptions = towers => ({
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
      value: towers.length
    }
  ]
});

const TowersTable = ({ towers, platformValue }) => {
  const [nonSelectables, setNonSelectables] = useState([]);
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState(null);
  const [code, setCode] = useState(null);

  const handleOnSelect = (row, isSelect) => {
    if (isSelect) {
      setSelected([row.id]);
    } else {
      setSelected([]);
    }
  };

  const selectRow = {
    mode: "radio",
    clickToSelect: true,
    style: { backgroundColor: "#c8e6c9" },
    headerColumnStyle: {
      backgroundColor: "#343a40"
    },
    onSelect: handleOnSelect,
    selected: selected,
    nonSelectable: nonSelectables
  };
  return (
    <ToolkitProvider
      bootstrap4
      keyField="id"
      data={towers}
      columns={columnTable()}
      search
    >
      {props => (
        <div>
          <h3>Listado de torres</h3>
          <p>Todas las columnas de la tabla son filtrables</p>
          <div style={{ display: "table-caption" }}>
            <SearchBar
              {...props.searchProps}
              style={{ width: "100%", minWidth: "141px" }}
              placeholder="Buscar"
            />
          </div>
          <hr />
          <BootstrapTable
            keyField="id"
            noDataIndication="La tabla no contiene elementos disponibles"
            selectRow={selectRow}
            pagination={paginationFactory(tableOptions(towers))}
            {...props.baseProps}
          />
          {nonSelectables.length === 1 && (
            <div class="alert alert-info" role="alert">
              <p>La torre: {nonSelectables[0]} esta en camino</p>
            </div>
          )}
          {nonSelectables.length > 1 && (
            <div class="alert alert-info" role="alert">
              <p>Las torres: {nonSelectables.join(",")} estan en camino</p>
            </div>
          )}

          <button
            className="btn btn-primary"
            disabled={selected.length === 0}
            onClick={() => {
              ApiClient.postTorre({
                id_plataforma: platformValue,
                id_torre: selected[0]
              })
                .then(({ data, status }) => {
                  setCode(status);
                  setMessage(data);
                })
                .catch(error => {
                  setCode(error.response.status);
                  setMessage(error.response.data.message);
                });
              setNonSelectables([...nonSelectables, selected[0]]);
              setSelected([]);
            }}
          >
            Traer torre
          </button>

          <Row style={{ marginTop: "20px" }}>
            <Col xs={12}>
              {code >= 200 && code < 300 ? (
                <Alert variant="success">{message}</Alert>
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

export default TowersTable;

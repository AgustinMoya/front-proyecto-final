import React from "react";
import Button from "react-bootstrap/Button";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";

const { SearchBar } = Search;

const columnTable = [
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
    searchable: false
  },
  {
    dataField: "name",
    text: "Nombre de producto",
    classes: "columnColor",
    headerClasses: "headerColor",
    sort: true,
    searchable: true
  },
  {
    dataField: "id_orden_compra",
    text: "Orden de compra",
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
  }
];

const customTotal = (from, to, size) => (
  <span className='marginLeft react-bootstrap-table-pagination-total'>
    Mostrando desde {from} a {to} pedidos de {size}
  </span>
);

const tableOptions = orders => ({
  paginationSize: 4,
  pageStartIndex: 1,
  // alwaysShowAllBtns: true, // Always show next and previous button
  // withFirstAndLast: false, // Hide the going to First and Last page button
  // hideSizePerPage: true, // Hide the sizePerPage dropdown always
  // hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
  firstPageText: "Primer pagina",
  prePageText: "<",
  nextPageText: ">",
  lastPageText: "Ultima pagina",
  nextPageTitle: "Primera pagina",
  prePageTitle: "<",
  firstPageTitle: ">",
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
    <button className='btn btn-secondary' onClick={handleClick}>
      Exportar como CSV
    </button>
  );
};
const OrdersTable = ({ orders }) => (
  <ToolkitProvider
    bootstrap4
    keyField='id'
    data={orders}
    columns={columnTable}
    search
    exportCSV
  >
    {props => (
      <div>
        <h3>Listado de pedidos</h3>
        <p>
          Las columnas: <bold>nombre de producto</bold>,
          <bold>orden de compra</bold> y <bold>ID de robot</bold> son filtrables
        </p>
        <div style={{ display: "table-caption" }}>
          <SearchBar
            {...props.searchProps}
            style={{ width: "100%" }}
            placeholder='Buscar'
          />
          <MyExportCSV {...props.csvProps} />
        </div>
        <hr />
        <BootstrapTable
          {...props.baseProps}
          pagination={paginationFactory(tableOptions(orders))}
        />
      </div>
    )}
  </ToolkitProvider>
);

export default OrdersTable;

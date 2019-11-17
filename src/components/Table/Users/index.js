import React, { Fragment } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";

const columnTable = [
  {
    dataField: "uid",
    text: "ID de usuario",
    classes: "columnColor",
    headerClasses: "headerColor"
  },
  {
    dataField: "username",
    text: "Nombre de usuario",
    classes: "columnColor",
    headerClasses: "headerColor",
    sort: true
  },
  {
    dataField: "email",
    text: "Email",
    classes: "columnColor",
    headerClasses: "headerColor",
    sort: true
  }
];

const customTotal = (from, to, size) => (
  <span className='marginLeft react-bootstrap-table-pagination-total'>
    Mostrando desde {from} a {to} usuarios de {size}
  </span>
);

const tableOptions = users => ({
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
      value: users.length
    }
  ]
});

const UserTable = ({ users }) => (
  <Fragment>
    <BootstrapTable
      bootstrap4
      keyField='uid'
      data={users}
      columns={columnTable}
      pagination={paginationFactory(tableOptions(users))}
    />
  </Fragment>
);

export default UserTable
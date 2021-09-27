import React from "react";
import Table from "./Table";

/**
 * Defines a list of table cards
 * @param {*} table - data to populate the fields of a table card
 * @param {*} reservationUnassignment - API call to DELETE reservation_id from table data
 * @returns
 */
export default function TableList({ tables, reservationUnassignment }) {
  let tablesHTML = tables.map((table) => (
    <Table
      key={table.table_id}
      table={table}
      reservationUnassignment={reservationUnassignment}
    />
  ));
  return (
    <>
      <h4 className="m-10">Tables</h4>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
        {tablesHTML}
      </div>
    </>
  );
}

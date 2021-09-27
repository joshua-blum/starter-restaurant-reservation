import React from "react";
import { useHistory } from "react-router-dom";

import "../colors.css";

/**
 * Defines a table card
 * @param {*} table - data to populate the fields of a table card
 * @param {*} reservationUnassignment - API call to DELETE reservation_id from table data
 * @returns {JSX.element}
 */
export default function Table({ table, reservationUnassignment }) {
  let history = useHistory();

  const finishTable = async (id) => {
    try {
      await reservationUnassignment(id);
      history.push("/dashboard");
    } catch (error) {
      throw error;
    }
  };

  const isOccupied = (table) => {
    if (!table.reservation_id) return false;
    else return true;
  };

  return (
    <div className="col">
      <div className="table card h-100 border-secondary align-items-left light-silver">
        <div className="card-body">
          <h4 className="card-title">{table.table_name}</h4>
          <ul className="card-text list-unstyled">
            <li key={`table-capacity`}>Capacity: {table.capacity}</li>
            <li key={`table-status`} data-table-id-status={table.table_id}>
              Status: {!isOccupied(table) ? "Free" : "Occupied"}
            </li>
          </ul>
          {isOccupied(table) ? (
            <button
              type="button"
              className="btn dark-violet align-item-center"
              data-table-id-finish={table.table_id}
              onClick={() => finishTable(table.table_id)}
            >
              Finish
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

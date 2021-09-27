import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";

/**
 * Defines a form to assign reservations to a table
 * @param {*} tables - tables to be selected from for reservation assignment
 * @param {*} getTables - API call to GET tables from database
 * @param {*} reservationAssignment - API call to PUT reservation_id to a specified table
 * @param {*} reservationStatusChange - API call to PUT changes to reservation status
 * @returns {JSX.element}
 */
export default function SeatForm({
  tables,
  getTables,
  reservationAssignment,
  reservationStatusChange,
}) {
  const { reservation_id } = useParams();
  let history = useHistory();

  useEffect(() => {
    getTables();
  }, [getTables]);

  const handleCancel = (event) => {
    event.preventDefault();
    history.goBack();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await reservationAssignment(reservation_id, event.target.table_id.value);
      await reservationStatusChange(reservation_id, "seated");
      history.push("/dashboard");
    } catch (error) {
      throw error;
    }
  };

  const tableOptions = tables.map((table) => {
    return (
      <option key={`option-${table.table_id}`} value={table.table_id}>
        {table.table_name} - {table.capacity}
      </option>
    );
  });

  return (
    <>
      <h4>Find a Seat</h4>
      <form onSubmit={handleSubmit}>
        <select name="table_id">
          <option value="default">--Please select a table--</option>
          {tableOptions}
        </select>
        <button type="submit" onSubmit={handleSubmit}>
          Submit
        </button>
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
      </form>
    </>
  );
}

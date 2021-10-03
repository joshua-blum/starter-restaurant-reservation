import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import '../colors.css';

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

  const handleCancel = async (event) => {
    event.preventDefault();
    try {
      await reservationStatusChange(reservation_id, "booked");
      history.goBack();
    } catch(error){throw error};
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
      <div className="violet p-4 m-0">
      <h1 className="oi oi-location"> Find a Seat</h1>
      </div>
      <form className="m-4" onSubmit={handleSubmit}>
        <div className="m-0">
        <select name="table_id">
          <option value="default">-- Please select a table --</option>
          {tableOptions}
        </select>
        </div>
        <br />
        <div className="d-flex justify-content-between">
        <button className="btn dark-violet" type="submit" onSubmit={handleSubmit}>
          Submit
        </button>
        <button className="btn light-silver" type="button" onClick={handleCancel}>
          Cancel
        </button>
        </div>
      </form>
    </>
  );
}

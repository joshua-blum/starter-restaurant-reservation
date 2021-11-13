import React, { useCallback, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import ReservationForm from "../reservations/ReservationForm";
import CreateTableForm from "../tables/CreateTableForm";
import SeatForm from "../reservations/SeatForm";
import SearchReservations from "../search/searchReservations";
import {
  createTable,
  createReservation,
  listTables,
  listReservations,
  editReservation,
  updateReservationStatus,
  assignReservation,
  unassignReservation,
} from "../utils/api";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const date = useQuery().get("date");

  /**
   * State functions
   * @params reservations - array of reservation objects called from the API
   * @params tables - array of table objects called from the API
   */

  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);

  /* GET REQUESTS */

  //GET request for all reservations
  const getReservations = useCallback(async (signal, date = null) => {
    setReservationsError(null);
    listReservations({ date }, signal)
      .then(setReservations)
      .catch((error) => {
        if (error.name !== "AbortError") {
          setReservationsError(error);
          throw error;
        }
      });
  }, []);

  //GET request for all tables
  const getTables = useCallback(async (signal) => {
    setTablesError(null);
    listTables(signal)
      .then(setTables)
      .catch((error) => {
        if (error.name !== "AbortError") {
          setTablesError(error);
          throw error;
        }
      });
  }, []);

  /* PUT REQUESTS */

  /** === reservationAssignment() ===
   * PUT request to assign a reservation_id to a table
   * @param {*} reservation_id - reservation_id to be assigned to the specified table
   * @param {*} table_id - table_id of the table to which the reservation is to be assigned
   * @param {*} signal - (optional) signal to communicate with or abort a DOM request
   * @returns table with table_id updated with the passed in reservation_id
   */
  const reservationAssignment = async (reservation_id, table_id, signal) => {
    const updatedTable = await assignReservation(
      reservation_id,
      table_id,
      signal
    );
    return updatedTable;
  };

  /** === reservationStatusChange() ===
   * PUT request to change the designated status of a reservation
   * @param {*} reservation_id - reservation_id of the reservation to which the status is to be assigned
   * @param {*} newStatus - status with which to update reservation
   * @param {*} signal - (optional) signal to communicate with or abort a DOM request
   * @returns reservation with reservation_id updated with the passed in newStatus
   */
  const reservationStatusChange = async (reservation_id, newStatus, signal) => {
    const updatedReservation = await updateReservationStatus(
      reservation_id,
      newStatus,
      signal
    );
    return updatedReservation;
  };

  /** === reservationUpdate() ===
   * PUT request to edit some or all contents of a reservation
   * @param {*} modifiedReservation - reservation data after user modification
   * @param {*} id - reservation_id of the reservation to be modified
   * @param {*} signal - (optional) signal to communicate with or abort a DOM request
   * @returns reservation with updated contents
   */
  const reservationUpdate = async (modifiedReservation, id, signal) => {
    const updatedReservation = await editReservation(
      modifiedReservation,
      id,
      signal
    );
    return updatedReservation;
  };

  /* POST requests */

  /** === reservationCreation() ===
   * POST request to create a new reservation
   * @param {*} reservation - reservation data from user input
   * @param {*} signal - (optional) signal to communicate with or abort a DOM request
   * @returns reservation data as new reservation
   */
  const reservationCreation = async (reservation, signal) => {
    const newReservation = await createReservation(reservation, signal);
    return newReservation;
  };

  /** === tableCreation() ===
   * POST request to create a new table
   * @param {*} table - table data from user input
   * @param {*} signal - (optional) signal to communicate with or abort a DOM request
   * @returns ttable data as a new table
   */
  const tableCreation = async (table, signal) => {
    const newTable = await createTable(table, signal);
    getTables(signal);
    return newTable;
  };

  /* DELETE request */

  /** === reservationUnassignment() ===
   * DELETE request to unassign a reservation from a table
   * @param {*} table_id - table_id of table from which to remove an assigned reservation
   * @param {*} signal - (optional) signal to communicate with or abort a DOM request
   */
  const reservationUnassignment = async (table_id, signal) => {
    if (window.confirm("Is this table ready to seat new guests?")) {
      await unassignReservation(table_id, signal);
    }
  };

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <ReservationForm
          reservationUpdate={reservationUpdate}
          reservationCreation={reservationCreation}
        />
      </Route>
      <Route exact={true} path="/reservations/new">
        <ReservationForm
          reservationUpdate={reservationUpdate}
          reservationCreation={reservationCreation}
        />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <SeatForm
          tables={tables}
          getTables={getTables}
          reservationAssignment={reservationAssignment}
          reservationStatusChange={reservationStatusChange}
        />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard
          date={date ? date : today()}
          reservations={reservations}
          reservationsError={reservationsError}
          getReservations={getReservations}
          tables={tables}
          tablesError={tablesError}
          getTables={getTables}
          reservationStatusChange={reservationStatusChange}
          reservationUnassignment={reservationUnassignment}
        />
      </Route>
      <Route exact={true} path="/tables/new">
        <CreateTableForm tableCreation={tableCreation} />
      </Route>
      <Route exact={true} path="/search">
        <SearchReservations reservationStatusChange={reservationStatusChange} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;

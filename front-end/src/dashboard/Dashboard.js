import React, { useEffect, useState } from "react";
import {useHistory} from "react-router-dom";
import { listReservations, listTables } from "../utils/api";
import {previous, today, next} from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationList from "../reservations/ReservationList";
import TableList from '../tables/TableList';

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const history = useHistory();
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadDashboard, [date, tables]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({date}, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    console.log("tables ", tables);
    return () => abortController.abort();
  }


  return (    
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      {/*{JSON.stringify(reservations)}*/}
      <ReservationList reservations={reservations} />
      <TableList tables={tables} />
      <button type="button" onClick={() => history.push(`/dashboard?date=${previous(date)}`)}>Prior</button>
      <button type='button' onClick={() => history.push(`/dashboard?date=${today()}`)}>Today</button>
      <button type='button' onClick={() => history.push(`/dashboard?date=${next(date)}`)}>Next</button>
    </main>
  );
}

export default Dashboard;

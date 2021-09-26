import React, { useEffect, useCallback } from "react";
import {useHistory} from "react-router-dom";
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
function Dashboard({ date, reservations, reservationsError, getReservations, tables, tablesError, getTables, reservationStatusChange, reservationUnassignment }) {
  const history = useHistory();

  const loadDashboard = useCallback(async () => {
      const abortController = new AbortController();
      await getReservations(abortController.signal, date);
      await getTables(abortController.signal);
      return () => abortController.abort();
  }, [getReservations, getTables, date])

  useEffect(() => {loadDashboard();}, [loadDashboard, date])

  return (    
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
      <ReservationList reservations={reservations} reservationStatusChange={reservationStatusChange} />
      <TableList tables={tables} reservationUnassignment={reservationUnassignment} />
      <button type="button" onClick={() => history.push(`/dashboard?date=${previous(date)}`)}>Prior</button>
      <button type='button' onClick={() => history.push(`/dashboard?date=${today()}`)}>Today</button>
      <button type='button' onClick={() => history.push(`/dashboard?date=${next(date)}`)}>Next</button>
    </main>
  );
}

export default Dashboard;

import React, { useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { previous, today, next } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationList from "../reservations/ReservationList";
import TableList from "../tables/TableList";

import "../colors.css";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({
  date,
  reservations,
  reservationsError,
  getReservations,
  tables,
  tablesError,
  getTables,
  reservationStatusChange,
  reservationUnassignment,
}) {
  const history = useHistory();

  const loadDashboard = useCallback(async () => {
    const abortController = new AbortController();
    await getReservations(abortController.signal, date);
    await getTables(abortController.signal);
    return () => abortController.abort();
  }, [getReservations, getTables, date]);

  //renders the dashboard properly when loading reservations and tables
  useEffect(() => {
    loadDashboard();
  }, [loadDashboard, date]);

  return (
    <main>
      <div className="violet p-4 m-0">
        <h1 className="oi oi-dashboard"> Dashboard</h1>
      </div>
      <br />
      <div className="col d-flex btn-group m-0" role="group">
        <button
          type="button"
          className="btn violet"
          onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
        >
          Prior
        </button>
        <button
          type="button"
          className="btn violet"
          onClick={() => history.push(`/dashboard?date=${today()}`)}
        >
          Today
        </button>
        <button
          type="button"
          className="btn violet"
          onClick={() => history.push(`/dashboard?date=${next(date)}`)}
        >
          Next
        </button>
      </div>
      <br />
      <div className="d-md-flex mb-2 p-2">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <section className="col dashboard-body">
        <ErrorAlert error={reservationsError} />
        <ErrorAlert error={tablesError} />
        <ReservationList
          reservations={reservations}
          reservationStatusChange={reservationStatusChange}
        />
        <hr className="dark-violet" />
        <TableList
          tables={tables}
          reservationUnassignment={reservationUnassignment}
        />
      </section>
    </main>
  );
}

export default Dashboard;

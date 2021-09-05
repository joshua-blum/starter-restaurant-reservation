import React, { useEffect, useState } from "react";
import {useHistory} from "react-router-dom";
import { listReservations } from "../utils/api";
import {previous, today, next} from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationList from "../reservations/ReservationList";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const history = useHistory();
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({date}, abortController.signal)
      .then((response) => {
        console.log("here is the response",response);
        if(response.length !== 0) setReservations(response);
        else console.log("there are no reservations at this time")})
      .catch((error) => {
        console.log("here is the error", error);
        setReservationsError(error)});
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
      <button type="button" onClick={() => history.push(`/dashboard?date=${previous(date)}`)}>Prior</button>
      <button type='button' onClick={() => history.push(`/dashboard?date=${today()}`)}>Today</button>
      <button type='button' onClick={() => history.push(`/dashboard?date=${next(date)}`)}>Next</button>
    </main>
  );
}

export default Dashboard;

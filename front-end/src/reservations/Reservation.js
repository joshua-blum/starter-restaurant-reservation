import React from "react";
import { useHistory } from "react-router-dom";

import "../colors.css";

/**
 * Defines a reservation card
 * @param {*} reservation - data to populate the fields of a reservation card
 * @param {*} reservationStatusChange - API call to PUT changes to reservation status
 * @returns {JSX.element}
 */
export default function Reservation({ reservation, reservationStatusChange }) {
  const abortController = new AbortController();
  const history = useHistory();

  const isBooked = ({ status }) => {
    if (status === "booked" || status === null) return true;
    else return false;
  };

  const seatReservation = async (id) => {
    await reservationStatusChange(id, "seated", abortController.signal);
    return () => abortController.abort();
  };

  const cancelReservation = async (id) => {
    try {
      if (
        window.confirm(
          "Do you want to cancel this reservation? This cannot be undone"
        )
      ) {
        await reservationStatusChange(id, "cancelled");
        history.push("/dashboard");
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="col p-10 m-10">
      <div className="reservation card h-100 border-secondary align-items-center light-silver">
        <div className="card-body">
          <h4 className="card-title">
            Reservation for {reservation.first_name} {reservation.last_name}
          </h4>
          <ul className="card-text list-unstyled">
            <li key={`reservation-date`}>
              Date: {reservation.reservation_date}
            </li>
            <li key={`reservation-time`}>
              Time: {reservation.reservation_time}
            </li>
            <li key={`reservation-people`}>Party Size: {reservation.people}</li>
            <li
              key={`reservation-status`}
              data-reservation-id-status={reservation.reservation_id}
            >
              Status: {isBooked(reservation) ? "booked" : reservation.status}
            </li>
          </ul>
          <div className="d-flex justify-content-between">
            {isBooked(reservation) ? (
              <a href={`/reservations/${reservation.reservation_id}/seat`}>
                <button
                  type="button"
                  className="btn dark-violet"
                  onClick={() => seatReservation(reservation.reservation_id)}
                >
                  Seat
                </button>
              </a>
            ) : null}
            <a href={`/reservations/${reservation.reservation_id}/edit`}>
              <button type="button" className="btn dark-silver">
                Edit
              </button>
            </a>
            <button
              type="button"
              className="btn btn-danger"
              data-reservation-id-cancel={reservation.reservation_id}
              onClick={() => cancelReservation(reservation.reservation_id)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

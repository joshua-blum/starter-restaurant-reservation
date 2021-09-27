import React from "react";
import Reservation from "./Reservation";

/**
 * Defines a list of reservation cards
 * @param {*} reservations - reservation data to be made into reservation cards
 * @param {*} reservationStatusChange - API call to PUT changes to reservation status
 * @returns {JSX.element}
 */
export default function ReservationList({
  reservations,
  reservationStatusChange,
}) {
  let reservationHTML = reservations.map((reservation) => (
    <Reservation
      key={`reservation-${reservation.reservation_id}`}
      reservation={reservation}
      reservationStatusChange={reservationStatusChange}
    />
  ));
  return reservationHTML;
}

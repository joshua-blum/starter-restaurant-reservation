import React from "react";
import Reservation from './Reservation';

//component that displays the reservations in a list, first sorting the passed in reservations array by time
export default function ReservationList({reservations, reservationStatusChange}){
    let reservationHTML = reservations.map((reservation) => <Reservation key={`reservation-${reservation.reservation_id}`} reservation={reservation} reservationStatusChange={reservationStatusChange}/>);
    return reservationHTML;
}
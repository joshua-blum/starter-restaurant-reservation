import React from "react";
import Reservation from './Reservation';

//component that displays the reservations in a list, first sorting the passed in reservations array by time
export default function ReservationList({reservations}){
    let reservationHTML = reservations.map((reservation) => <Reservation reservation={reservation} />);
    return reservationHTML;
}
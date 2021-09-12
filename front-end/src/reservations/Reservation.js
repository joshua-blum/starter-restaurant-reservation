import React from "react";
import {updateReservationStatus} from '../utils/api';

export default function Reservation({reservation}){
    const isBooked = () => {return !reservation.status || reservation.status === 'booked'};

    const seatReservation = (id) => {
        const abortController = new AbortController();
        updateReservationStatus(id, 'seated', abortController.signal)
            .catch((error) => {throw error});
        return () => abortController.abort();
    }
    return (
    <div>
        <hr />
        <h4>Reservation for {reservation.first_name} {reservation.last_name}</h4>
        <ul>
            <li>Date: {reservation.reservation_date}</li>
            <li>Time: {reservation.reservation_time}</li>
            <li>Party Size: {reservation.people}</li>
            <li>Status: {reservation.status ? reservation.status:'booked'}</li>
        </ul>
        {isBooked ? (<a href={`/reservations/${reservation.reservation_id}/seat`} onClick={seatReservation(reservation.reservation_id)}>Seat</a>):null}
        <hr/>
    </div>
    )
}
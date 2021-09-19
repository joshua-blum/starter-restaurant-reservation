import React from "react";
import {useHistory} from 'react-router-dom';
import {updateReservationStatus} from '../utils/api';

export default function Reservation({reservation}){
    
    const isBooked = ({status}) => {
        if(status === 'booked' || status === null) return true;
        else return false;
    }
    const seatReservation = (id) => {
        console.log('in seatReservation click function with id ', id);
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
            <li data-reservation-id-status={reservation.reservation_id}>Status: {reservation.status === null ? 'booked':reservation.status}</li>
        </ul>
        {isBooked(reservation) ? <a href={`/reservations/${reservation.reservation_id}/seat`}><button onClick={() => seatReservation(reservation.reservation_id)}>Seat</button></a>:null}
        <hr/>
    </div>
    )
}
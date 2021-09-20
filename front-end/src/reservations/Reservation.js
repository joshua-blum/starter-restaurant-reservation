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

    const cancelReservation = (id) => {
        if(window.confirm('Do you want to cancel this reservation? This cannot be undone')){
            console.log('execute code to cancel the reservation i.e. set the reservation.status to cancelled using a put request')
            const abortController = new AbortController();
            updateReservationStatus(id, 'cancelled', abortController.signal)
                .catch((error) => {throw error});
            return () => abortController.abort();
        }
    }

    return (
    <div>
        <hr />
        <h4>Reservation for {reservation.first_name} {reservation.last_name}</h4>
        <ul>
            <li>Date: {reservation.reservation_date}</li>
            <li>Time: {reservation.reservation_time}</li>
            <li>Party Size: {reservation.people}</li>
            <li data-reservation-id-status={reservation.reservation_id}>Status: {isBooked(reservation) ? 'booked':reservation.status}</li>
        </ul>
        {isBooked(reservation) ? <a href={`/reservations/${reservation.reservation_id}/seat`}><button onClick={() => seatReservation(reservation.reservation_id)}>Seat</button></a>:null}
        <a href={`/reservations/${reservation.reservation_id}/edit`}>Edit</a>
        <button type='button' data-reservation-id-cancel={reservation.reservation_id} onClick={() => cancelReservation(reservation.reservation_id)}>Cancel</button>
        <hr/>
    </div>
    )
}
import React from "react";
import {useHistory} from 'react-router-dom';

export default function Reservation({ reservation, reservationStatusChange}){
    const abortController = new AbortController();
    const history = useHistory();

    const isBooked = ({status}) => {
        if(status === 'booked' || status === null) return true;
        else return false;
    }
    
    const seatReservation = async (id) => {
        await reservationStatusChange(id, 'seated', abortController.signal);
        return () => abortController.abort();
    }

    const cancelReservation = async (id) => {
        try {
            if(window.confirm('Do you want to cancel this reservation? This cannot be undone')){ 
                await reservationStatusChange(id, 'cancelled');
                history.push('/dashboard');        
        }} catch(error) {throw error};
    }

    return (
    <div className={`reservation`}>
        <hr />
        <h4>Reservation for {reservation.first_name} {reservation.last_name}</h4>
        <ul>
            <li key={`reservation-date`}>Date: {reservation.reservation_date}</li>
            <li key={`reservation-time`}>Time: {reservation.reservation_time}</li>
            <li key={`reservation-people`}>Party Size: {reservation.people}</li>
            <li key={`reservation-status`}data-reservation-id-status={reservation.reservation_id}>Status: {isBooked(reservation) ? 'booked':reservation.status}</li>
        </ul>
        {isBooked(reservation) ? <a href={`/reservations/${reservation.reservation_id}/seat`}><button onClick={() => seatReservation(reservation.reservation_id)}>Seat</button></a>:null}
        <a href={`/reservations/${reservation.reservation_id}/edit`}>Edit</a>
        <button type='button' data-reservation-id-cancel={reservation.reservation_id} onClick={() => cancelReservation(reservation.reservation_id)}>Cancel</button>
        <hr/>
    </div>
    )
}
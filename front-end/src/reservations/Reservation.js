import React from "react";

export default function Reservation({reservation}){
    return (
    <div>
        <hr />
        <h4>Reservation for {reservation.first_name} {reservation.last_name}</h4>
        <ul>
            <li>Date: {reservation.reservation_date}</li>
            <li>Time: {reservation.reservation_time}</li>
            <li>Party Size: {reservation.people}</li>
        </ul>
        <a href={`/reservations/${reservation.reservation_id}/seat`}>Seat</a>
        <hr/>
    </div>
    )
}
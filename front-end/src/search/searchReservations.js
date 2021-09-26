import React, {useState} from 'react';
import ReservationList from '../reservations/ReservationList';
import {listReservations} from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';

export default function SearchReservations(){
    const initialFormData = {mobile_number: ''};
    const initialReservationSearchMessage = 'Use the mobile phone of the reservation';
    const [reservations, setReservations] = useState([initialReservationSearchMessage]);
    const [mobilePhone, setMobilePhone] = useState({...initialFormData});
    const [reservationsError, setReservationsError] = useState(null);


    const handleChange = (event) => {
        event.preventDefault();
        setMobilePhone({...mobilePhone, mobile_number: event.target.value});
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const abortController = new AbortController();
        setReservationsError(null);
        if(mobilePhone.mobile_number.length > 0) {
            listReservations(mobilePhone, abortController.signal)
            .then(setReservations)
            .catch(setReservationsError);
        }
        else setReservations([initialReservationSearchMessage]);
        return () => abortController.abort(); 
    }

    const searchHTML = (reservations) => {
        if(typeof reservations[0] === 'object') return <ReservationList reservations={reservations} />
        else if (typeof reservations[0] === 'string') return <h5>{reservations[0]}</h5>
        else return <h4>No reservations found</h4>
    }

    return (
        <>
            <ErrorAlert error={reservationsError} />
            <div className='searchByPhoneNumber'>
                <h4>Search for a Reservation</h4>
                <form onSubmit={handleSubmit}>
                    <p>Phone number: </p>
                    <input name='mobile_number' value={mobilePhone.mobile_number} onChange={handleChange}/>
                    <button value='Submit' type='submit'>Find</button>
                </form>
            </div>
            {searchHTML(reservations)}
        </>
    )
}
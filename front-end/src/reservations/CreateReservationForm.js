import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {createReservation} from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';

export default function CreateReservationForm(){
    const [error, setError] = useState(null);
    const history = useHistory();
    const initialFormState = {
        first_name: '',
        last_name: '',
        mobile_number: '',
        reservation_date: '',
        reservation_time: '',
        people: 0,
    };

    const [formData, setFormData] = useState({...initialFormState});
    const handleChange = ({target}) => {
        console.log("typeof people is ", typeof formData.people);
        setFormData({
            ...formData,
            [target.name]: target.value
        })
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        createReservation(formData)
            .then(() => {
                history.push(`/dashboard?date=${formData.reservation_date}`);
                setFormData({...initialFormState});
            })
            .catch(setError);
    }

    const handleCancel = (event) => {
        event.preventDefault();
        setFormData({...initialFormState});
        history.goBack();
    }

    return (
        <>
            <h1>Make a Reservation</h1>
            <ErrorAlert error={error} />
            <form onSubmit={handleSubmit}>
            <label htmlFor='first_name'>
                First Name: 
                <input
                    id='first_name'
                    type='text'
                    name='first_name'
                    onChange={handleChange}
                    value={formData.first_name}
                 />
            </label>
            <br />
            <label htmlFor='last_name'>
                Last Name:
                <input
                    id='last_name'
                    type='text'
                    name='last_name'
                    onChange={handleChange}
                    value={formData.last_name} 
                />
            </label>
            <br />
            <label htmlFor='mobile_number'>
                Mobile Number:
                <input
                    id='mobile_number'
                    type='text'
                    name='mobile_number'
                    onChange={handleChange}
                    value={formData.mobile_number} 
                />
            </label>
            <br />
            <label htmlFor='reservation_date'>
                Date of Reservation:
                <input
                    id='reservation_date'
                    type="date" 
                    placeholder="YYYY-MM-DD" 
                    pattern="\d{4}-\d{2}-\d{2}"
                    name='reservation_date'
                    onChange={handleChange}
                    value={formData.reservation_date} 
                />
            </label>
            <br />
            <label htmlFor='reservation_time'>
                Time of Reservation:
                <input
                    id='reservation_time'
                    type="time" 
                    placeholder="HH:MM" 
                    pattern="[0-9]{2}:[0-9]{2}"
                    name='reservation_time'
                    onChange={handleChange}
                    value={formData.reservation_time} 
                />
            </label>
            <br />
            <label htmlFor='people'>
                Party Size:
                <input
                    id='people'
                    type='number'
                    name='people'
                    onChange={handleChange}
                    value={formData.people} 
                />
            </label>
            <br/>
            <button type='submit' onSubmit={handleSubmit}>Submit</button>
            <button type='button' onClick={handleCancel}>Cancel</button>
        </form>
        </>
    )
}
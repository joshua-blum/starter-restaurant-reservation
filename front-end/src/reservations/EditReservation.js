import React, {useEffect, useState} from 'react';


export default function EditReservation({reservation}){
    const [formData, setFormData] = useState({
        first_name: reservation.first_name,
        last_name: reservation.last_name,
        mobile_number: reservation.mobile_number,
        reservation_date: reservation.reservation_date,
        reservation_time: reservation.reservation_time,
        people: reservation.people
    });

    const [tempReservation, setTempReservation] = useState({
        first_name: formData.first_name,
        last_name: formData.last_name,
        mobile_number: formData.mobile_number,
        reservation_date: formData.reservation_date,
        reservation_time: formData.reservation_time,
        people: formData.people
    })

    useEffect(() => {
        setTempReservation({
            first_name: formData.first_name,
            last_name: formData.last_name,
            mobile_number: formData.mobile_number,
            reservation_date: formData.reservation_date,
            reservation_time: formData.reservation_time,
            people: formData.people
        })
    }, [formData])

    useEffect(() => {
        setFormData({ 
            first_name: reservation.first_name,
            last_name: reservation.last_name,
            mobile_number: reservation.mobile_number,
            reservation_date: reservation.reservation_date,
            reservation_time: reservation.reservation_time,
            people: reservation.people
        })
    }, [reservation])

    const handleChange = ({target}) => {
        setFormData({...formData, [target.name]:target.value});
    }

    const handleCancel = (event) => {
        event.preventDefault();
        setFormData({...initialFormState});
        history.goBack();
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const abortController = new AbortController();
        editReservation(tempReservation, abortController.signal)
            .catch((error) => {throw error});
        return () => abortController.abort();
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
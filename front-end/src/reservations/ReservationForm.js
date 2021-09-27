import React, { useEffect, useRef, useState } from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {findReservation} from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';

export default function ReservationForm({reservationUpdate, reservationCreation, }){
    const history = useHistory();
    const [error, setError] = useState(null);
    const [reservation, setReservation] = useState({});
    const {reservation_id} = useParams();
    const hasFetchedReservation = useRef(false);
    
    useEffect(() => {
        if(!hasFetchedReservation.current){
            const abortController = new AbortController();
            if(reservation_id) findSpecificReservation(reservation_id, abortController.signal);
            hasFetchedReservation.current = true;
            return () => abortController.abort();
        }
    }, [reservation_id])

    let initialFormState = {
        first_name: '',
        last_name: '',
        mobile_number: '',
        reservation_date: '',
        reservation_time: '',
        people: 0,
    };
    

    const [formData, setFormData] = useState({...initialFormState});

    const findSpecificReservation = async (reservation_id) => {
        try {
            const response = await findReservation(reservation_id);
            if(response) {
                setReservation(response)
                setFormData(response)};
        } catch (error) {setError(error); throw error}
    }
    const handleChange = ({target}) => {
        setFormData({
            ...formData,
            [target.name]: target.value
        })
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if(!reservation_id) {await reservationCreation({...formData, people: parseInt(formData.people), status: 'booked'})}
        else {
            await reservationUpdate({...formData, people: parseInt(formData.people), status: reservation.status}, reservation_id)}
            history.push(`/dashboard?date=${formData.reservation_date}`);
            setFormData({...initialFormState});
        }
        catch(error){setError(error); throw error}
    }

    const handleCancel = (event) => {
        event.preventDefault();
        setFormData({...initialFormState});
        history.goBack();
    }

    return (
        <>
            <div className='violet p-4 m-0'>
            {!reservation_id ? <h1 className='oi oi-plus'> Make a Reservation</h1>:<h1 className='oi oi-pencil'> Edit a Reservation</h1>}
            </div>
            <ErrorAlert error={error} />
            <form className='m-4' onSubmit={handleSubmit}>
                <div className='form-group m-0'>
                <label htmlFor='first_name'>
                First Name:
                </label>
                <input
                    id='first_name'
                    type='text'
                    className='form-control'
                    name='first_name'
                    placeholder='First Name'
                    onChange={handleChange}
                    value={formData.first_name}
                 />
                </div>

          
<div className='form-group m-0'>
<label htmlFor='last_name'>
                Last Name:
</label>
                <input
                    id='last_name'
                    type='text'
                    className='form-control'
                    name='last_name'
                    onChange={handleChange}
                    value={formData.last_name} 
                />
    </div>         
    
    <div className='form-group m-0'>
    <label htmlFor='mobile_number'>
                Mobile Number:
    </label>
                <input
                    id='mobile_number'
                    type='text'
                    className='form-control'
                    name='mobile_number'
                    onChange={handleChange}
                    value={formData.mobile_number} 
                />
    </div>  
      <div className='form-group m-0'>
      <label htmlFor='reservation_date'>
                Date of Reservation:
        </label>
                <input
                    id='reservation_date'
                    type="date" 
                    className='form-control'
                    placeholder="YYYY-MM-DD" 
                    pattern="\d{4}-\d{2}-\d{2}"
                    name='reservation_date'
                    onChange={handleChange}
                    value={formData.reservation_date} 
                />
    </div>   
     <div className='form-group m-0'>
     <label htmlFor='reservation_time'>
                Time of Reservation:
    </label>
                <input
                    id='reservation_time'
                    type="time" 
                    className='form-control'
                    placeholder="HH:MM" 
                    pattern="[0-9]{2}:[0-9]{2}"
                    name='reservation_time'
                    onChange={handleChange}
                    value={formData.reservation_time} 
                />
    </div>       
    <div className='form-group m-0'>
    <label htmlFor='people'>
                Party Size:
                </label>
                <input
                    id='people'
                    type='number'
                    className='form-control'
                    name='people'
                    onChange={handleChange}
                    value={formData.people} 
                />
    </div>  
    <br />
            <div className='d-flex justify-content-between'>
            <button className='btn dark-violet' type='submit' onSubmit={handleSubmit}>Submit</button>
            <button className='btn light-silver' type='button' onClick={handleCancel}>Cancel</button>
            </div>
            
        </form>
        <br />
        </>
    )
    
}
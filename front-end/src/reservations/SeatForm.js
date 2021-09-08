import React, {useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';

export default function SeatForm(){
    const [error, setError] = useState(null);
    let history = useHistory();

    const handleCancel = (event) => {
        event.preventDefault();
        history.goBack();
    }

    const handleSubmit = (event) => {

    }

    async function seatChoices(){

    }

    return (
        <>
            <h4>Find a Seat</h4>
            <form onSubmit={handleSubmit}>
                <select name='table_id'>
                    <option value='default'>--Please select a table--</option>
                </select>
                <button type='submit' onSubmit={handleSubmit}>Submit</button>
                <button type='button' onClick={handleCancel}>Cancel</button>
            </form>
        </>
    )

}
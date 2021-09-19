import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {assignReservation, listTables, updateReservationStatus} from '../utils/api';

export default function SeatForm(){
    const [tables, setTables] = useState([]);
    const [tablesError, setTablesError] = useState(null);
    const [error, setError] = useState(null);
    const {reservation_id} = useParams();
    let history = useHistory();

    const handleCancel = (event) => {
        event.preventDefault();
        console.log('cancelling the seating');
        history.goBack();
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const abortController = new AbortController();
        console.log('in handleSubmit of SeatForm ');
        console.log('and here are friends. reservation_id: ', reservation_id);
        assignReservation(reservation_id, event.target.table_id.value, abortController.signal)
            .then(() => history.push('/dashboard'))
            .catch(setError);
        updateReservationStatus(reservation_id, 'seated', abortController.signal)
            .catch(setError);
        return () => abortController.abort();
    }


    useEffect(loadTables, []);

    function loadTables(){
        console.log('loading table options for seating...');
        const abortController = new AbortController();
        setTablesError(null);
        listTables(abortController.signal)
            .then(setTables)
            .catch(setTablesError);
        return () => abortController.abort();
    }

    const tableOptions = tables.map((table) => {return <option value={table.table_id}>{table.table_name} - {table.capacity}</option>})

    return (
        <>
            <h4>Find a Seat</h4>
            <form onSubmit={handleSubmit}>
                <select name='table_id'>
                    <option value='default'>--Please select a table--</option>
                    {tableOptions}
                </select>
                <button type='submit' value='Submit'>Submit</button>
                <button type='button' onClick={handleCancel}>Cancel</button>
            </form>
        </>
    )

}
import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {updateTable, listTables} from '../utils/api';

export default function SeatForm(){
    const [tables, setTables] = useState([]);
    const [tablesError, setTablesError] = useState(null);
    const [error, setError] = useState(null);
    const {reservation_id} = useParams();
    let history = useHistory();

    const handleCancel = (event) => {
        event.preventDefault();
        history.goBack();
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('event.target ', event.target.table_id.value);
        updateTable(reservation_id, event.target.table_id.value)
            .then(() => history.push('/dashboard'))
            .catch(setError);
    }

    useEffect(loadTables, []);

    function loadTables(){
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
                <button type='submit' onSubmit={handleSubmit}>Submit</button>
                <button type='button' onClick={handleCancel}>Cancel</button>
            </form>
        </>
    )

}
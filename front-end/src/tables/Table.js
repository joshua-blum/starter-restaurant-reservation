import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {unassignReservation} from '../utils/api';


export default function Table({table}){
    let history = useHistory();

    const handleDeletion = () => {
        if(window.confirm('Is this table ready to seat new guests?')){
            const abortController = new AbortController();
            unassignReservation(table.reservation_id, table.table_id, abortController.signal)
                .then(() => history.push('/dashboard'))
                .catch((error) => {throw error});
            return () => abortController.abort();
        }
    }

    const vacancy = ({reservation_id}) => {
        if(reservation_id) return false;
        else return true;
    }

    const finishHTML = vacancy(table) ? null: (
        <button 
        type='button' 
        data-table-id-finish={table.table_id} 
        onClick={handleDeletion}
        >Finish
        </button>
    );

    

    return (
    <div>
        <h4>{table.table_name}</h4>
        <ul>
            <li key='capacity'>Capacity: {table.capacity}</li>
            <li key='status' data-table-id-status={table.table_id}>Status: {vacancy(table) ? "Free": "Occupied"}</li>
        </ul>
        {finishHTML}
        <hr />
    </div>
)}
import React, { useEffect } from 'react';
import {useHistory} from 'react-router-dom';
import {listTables, unassignReservation} from '../utils/api';


export default function Table({table}){
    let history = useHistory();

    const finishTable = (id) => {
        console.log('in handle deletion of table_id ', id);
        if(window.confirm('Is this table ready to seat new guests?')){
            const abortController = new AbortController();
            console.log('here is the table id? ', id);
            unassignReservation(id, abortController.signal)
                .catch((error) => {throw error});
            listTables(abortController.signal)
                .catch((error) => {throw error});
            return () => abortController.abort();
        }
        
    }

    const isOccupied = (table) => {
        console.log('here is a table ', table)
        if(!table.reservation_id) return false;
        else return true;
    }


    return (
    <div>
        <h4>{table.table_name}</h4>
        <ul>
            <li key='capacity'>Capacity: {table.capacity}</li>
            <li key='status' data-table-id-status={table.table_id}>Status: {!isOccupied(table) ? "Free": "Occupied"}</li>
        </ul>
        {isOccupied(table) ? <button type='button' data-table-id-finish={table.table_id} onClick={() => finishTable(table.table_id)}>Finish</button>:null}
        <hr />
    </div>
)}
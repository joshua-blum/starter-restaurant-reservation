import React from 'react';
import {useHistory} from 'react-router-dom';


export default function Table({ table, reservationUnassignment }){
    let history = useHistory();

    const finishTable = async (id) => {
        try {
            await reservationUnassignment(id);
            history.push('/dashboard');
        } catch(error) {throw error};
    }

    const isOccupied = (table) => {
        if(!table.reservation_id) return false;
        else return true;
    }


    return (
    <div className={`table`}>
        <h4>{table.table_name}</h4>
        <ul>
            <li key={`table-capacity`}>Capacity: {table.capacity}</li>
            <li key={`table-status`} data-table-id-status={table.table_id}>Status: {!isOccupied(table) ? "Free": "Occupied"}</li>
        </ul>
        {isOccupied(table) ? <button type='button' data-table-id-finish={table.table_id} onClick={() => finishTable(table.table_id)}>Finish</button>:null}
        <hr />
    </div>
)}
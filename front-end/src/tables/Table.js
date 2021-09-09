import React from 'react';

export default function Table({table}){
    const vacancy = () => {
        if(table.reservation_id) return "Occupied"
        else return "Free";
    }
    
    return (
    <div>
        <h4>{table.table_name}</h4>
        <ul>
            <li key='capacity'>Capacity: {table.capacity}</li>
            <li key='status' data-table-id-status={table.table_id}>Status: {vacancy()}</li>
        </ul>
    </div>
)}
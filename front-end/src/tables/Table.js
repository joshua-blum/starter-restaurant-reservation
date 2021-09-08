import React from 'react';

export default function Table(table){
    const vacancy = () => {
        //check if table has a reservation
            //if so, return "Occupied"
        return "Free";
    }
    
    return (
    <div>
        <h4>Table: {table.table_name}</h4>
        <ul>
            <li>Capacity: {table.capacity}</li>
            <li data-table-id-status={table.table_id}>{vacancy}</li>
        </ul>
    </div>
)}
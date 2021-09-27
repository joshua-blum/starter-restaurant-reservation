import React from "react";
import Table from './Table';

//component that displays all the tables and their capacities
export default function TableList({tables, reservationUnassignment}){
    let tablesHTML = tables.map((table) => <Table key={table.table_id} table={table} reservationUnassignment={reservationUnassignment}/>);
    return (
    <>
        <h4 className='m-10'>Tables</h4>
        <div className='row row-cols-1 row-cols-md-2 row-cols-lg-3'>
        {tablesHTML}
        </div>
    </>
        );
}
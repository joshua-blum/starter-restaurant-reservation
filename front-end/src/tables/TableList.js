import React from "react";
import Table from './Table';

//component that displays all the tables and their capacities
export default function TableList({tables}){
    let tablesHTML = tables.map((table) => <Table table={table} />);
    return (
        <>
        <h4>Tables</h4>
        {tablesHTML}
        </>
        );
}
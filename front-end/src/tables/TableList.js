import React from "react";
import Table from './Table';

//component that displays all the tables and their capacities
export default function TableList({tables}){
    console.log('here is the tables ', JSON.stringify(tables), 'and it is type ', typeof tables);
    let tablesHTML = tables.map((table) => <Table table={table} />);
    return tablesHTML;
}
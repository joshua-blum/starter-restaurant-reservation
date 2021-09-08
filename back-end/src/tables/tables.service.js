const knex = require("../db/connection");

const create = (table) => {
    return knex('tables').insert(table).returning('*');
}

const read = (table_id) => {
    return knex('tables').select('*').where({table_id}).first();
}

const update = (updatedTable) => {
    return knex('tables')
        .select('*')
        .where({table_id: updatedTable.table_id})
        .update(updatedTable, '*')
        .then((updatedRecord) => updatedRecord[0]);
}

const list = () => {
    return knex('tables').select('*').orderBy('table_name');
}

module.exports = {create, read, update, list};
const knex = require("../db/connection");

const list = (date) => {
    //if a date is specified, return only the reservations specified by that date
    if(date){
        return knex('reservations').select('*').where({reservation_date: date}).orderBy('reservation_time');
    }
    //by default, return ALL reservations
    return knex('reservations').select('*').orderBy('reservation_time');
}

const create = (newReservation) => {
    return knex('reservations').insert(newReservation).returning('*');
}

module.exports = {
    list, create
}
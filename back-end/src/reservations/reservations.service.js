const knex = require("../db/connection");

const list = (date) => {
    //if a date is specified, return only the reservations specified by that date
    if(date){
        // return knex('reservations').select('*').where({reservation_date: date}).whereNot('status', 'finished').orderBy('reservation_time');
        return knex('reservations').where((builder) => builder.whereNull('status').orWhere('status', 'booked').orWhere('status', 'seated')).andWhere({reservation_date: date}).orderBy('reservation_time');
    }
    //by default, return ALL reservations
    //return knex('reservations').select('*').whereNot({'status': 'finished'}).orderBy('reservation_time');
    else return knex('reservations').select('*').whereNot({'status': 'finished'}).orderBy('reservation_time');

}

const search = (mobile_number) => {
    return knex("reservations")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_date");
  }
  

const create = (newReservation) => {
    return knex('reservations').insert(newReservation).returning('*');
}

const read = (reservation_id) => {
    return knex('reservations').select('*').where({reservation_id});
}

const update = (updatedReservation) => {
    return knex('reservations')
        .select('*')
        .where({reservation_id: updatedReservation.reservation_id})
        .update(updatedReservation, '*')
        .then((updatedRecord) => updatedRecord[0]);
}

const destroy = (id) => {
    return knex('reservations').where({reservation_id: id}).del();
}

module.exports = {
    list, search, create, read, update, delete: destroy
}
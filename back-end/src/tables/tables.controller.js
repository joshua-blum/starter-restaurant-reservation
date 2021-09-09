const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
const reservationService = require('../reservations/reservations.service');
const service = require('./tables.service');

const validateBody = (req,res,next) => {
    //check if there is a req.body
    if(!req.body.data) return next({status:400,message:'Body must include a data object'});

    //check if there is a req body with accurate properties
    const requiredFields = ['table_name', 'capacity'];
    requiredFields.forEach((requirement) => {
        if(!req.body.data.hasOwnProperty(requirement) || req.body.data[requirement] === "") 
          return next({status:400,message:`Field required: ${requirement}`});
      });

    //check if the table name and capacity are valid
    if(req.body.data.table_name.split('').length <= 1) return next({status:400, message:`The table_name must be longer than 1 character`});
    if(req.body.data.capacity === 0) return next({status:400, message: 'The table must not have a capacity of zero'});

    next();
}

//validation for updating table with reservation_id
const canUpdate = async (req,res,next) => {
    //validate that there is data being sent to update
    if(!req.body.data) return next({status:400, message:'Body must include a data object'});
    if(!req.body.data.reservation_id) return next({status:400, message:'To seat you, we need your reservation_id'});

    //ensure that the reservation_id belongs to an actual reservation
    const reservation = await reservationService.read(req.body.data.reservation_id);
    if(!reservation) return next({status:404, message:`The reservation with the id ${req.body.data.reservation_id} does not exist`});

    //check that the table has enough capacity for the reservation, and that it is not already being reserved
    const {table_id} = req.params;
    const originalTable = await service.read(table_id);
    res.locals.table = originalTable[0];
    if(res.locals.table.capacity < reservation.people) return next({status:400, message:`The table only has capacity for ${res.locals.table.capacity} spaces, which is not enough space for the ${reservation.people} people in the reservation`});
    if(res.locals.table.reservation_id) return next({status:400, message:`The table is already occupied by the reservation with the following id: ${res.locals.table.reservation_id}`});
    next();
}

//to be used with CreateTableForm
async function create(req,res){
    try {
        const newTable = req.body.data;
        const response = await service.create(newTable);
        res.status(201).json({data: response[0]});
    } catch(error){throw error}
}

//to be used with SeatForm
async function update(req,res){
    try {
        const updatedTable = {...res.locals.table, reservation_id: req.body.data.reservation_id};
        const response = await service.update(updatedTable);
        res.status(200).json({data: response});
    } catch(error){throw error};
}

//to be used on the Dashboard
async function list(req,res){
    try {
        const response = await service.list();
        res.status(200).json({data: response});
    } catch(error){throw error};
}

module.exports = {
    create: [validateBody, asyncErrorBoundary(create)],
    update: [canUpdate, asyncErrorBoundary(update)],
    list: asyncErrorBoundary(list)
}
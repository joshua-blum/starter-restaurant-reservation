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

    if(req.body.data.table_name.split('').length <= 1) return next({status:400, message:`The table_name must be longer than 1 character`});
    if(req.body.data.capacity === 0) return next({status:400, message: 'The table must not have a capacity of zero'});

    next();
}

const canUpdate = async (req,res,next) => {
    if(req.body.data.reservation_id) return next({status:400, message:`The reservation with the id ${req.body.data.reservation_id} is currently reserving this table`});
    const {reservation_id} = req.params;
    const reservation = await reservationService.read(reservation_id);
    if(req.body.data.capacity < reservation.people) return next({status:400, message:`The table only has ${req.body.data.capacity} spaces, which is not enough space for the ${reservation.people} people in the reservation`});
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
        const {reservation_id} = req.params;
        const originalTable = await service.read(req.body.data.table_id);
        const updatedTable = {...originalTable, reservation_id: reservation_id};
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
    update: [validateBody, canUpdate, asyncErrorBoundary(update)],
    list: asyncErrorBoundary(list)
}
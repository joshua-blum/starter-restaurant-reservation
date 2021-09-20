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
    console.log('in can update...');
    console.log('trying to validate the following with update ', req.body, ' and here is the reslocals.reservation ', res.locals.reservation);
    //check that the table has enough capacity for the reservation, and that it is not already being reserved
    const {table_id} = req.params;
    const originalTable = await service.read(table_id);
    if(!originalTable || !originalTable[0]) return next({status: 404, message: `There does not exist a table with the id ${table_id}`});
    
    res.locals.table = originalTable[0];
   
    if(res.locals.table.capacity < res.locals.reservation.people) return next({status:400, message:`The table only has capacity for ${res.locals.table.capacity} spaces, which is not enough space for the ${res.locals.reservation.people} people in the reservation`});
    
    if(res.locals.table.reservation_id) return next({status:400, message:`The table is already occupied by the reservation with the following id: ${res.locals.table.reservation_id}`});

    const alreadySeated = await service.checkIfReserved(res.locals.reservation.reservation_id);
    if(alreadySeated[0]) {
        console.log('it is already seated: ', JSON.stringify(alreadySeated[0]));
        return next({status:400, message:`The reservation with id ${res.locals.reservation.reservation_id} is already seated`})
    } else console.log('it is not already seated, and here is why: alreadySeated is returning... ', JSON.stringify(alreadySeated));
    console.log('passed all tests in canUpdate! being pushed to tables.controller.update')
    next();
}

const canUnassignReservation = async (req,res,next) => {
    const {table_id} = req.params;
    const originalTable = await service.read(table_id);
    if(!originalTable || !originalTable[0]) return next({status: 404, message: `There does not exist a table with the id ${table_id}`});
    
    res.locals.table = originalTable[0];
    console.log('here is the table that we are trying to get rid of the reservation for: ', res.locals.table);
    if(!res.locals.table.reservation_id) return next({status: 400, message: `The table with id ${res.locals.table.table_id} is not occupied`});
    //ensure that the reservation_id belongs to an actual reservation
    const reservation = await reservationService.read(res.locals.table.reservation_id);
    if(!reservation || !reservation[0]) return next({status:404, message:`The reservation with the id ${res.locals.table.reservation_id} does not exist`});
    res.locals.reservation = reservation[0];
    console.log('the reservation DOES in fact belong to an actual reservation and has been assigned to res locals', res.locals.reservation);
    next();
}
const hasValidReservation = async (req,res,next) => {
    console.log('in hasValidREservation with req body ', req.body);
    //validate that there is data being sent to update
    if(!req.body.data) return next({status:400, message:'Body must include a data object'});
    if(!req.body.data.reservation_id) return next({status:400, message:'To seat you, we need your reservation_id'});
    console.log('basic req body is good');
    //ensure that the reservation_id belongs to an actual reservation
    const reservation = await reservationService.read(req.body.data.reservation_id);
    if(!reservation || !reservation[0]) return next({status:404, message:`The reservation with the id ${req.body.data.reservation_id} does not exist`});
    res.locals.reservation = reservation[0];
    console.log('the reservation DOES in fact belong to an actual reservation and has been assigned to res locals', res.locals.reservation);
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
        console.log('============')
        console.log('in tables.controller.update');
        const updatedTable = {...res.locals.table, reservation_id: req.body.data.reservation_id};
        const tableResponse = await service.update(updatedTable);
        await reservationService.update({...res.locals.reservation, status: 'seated'})
        //^this IS needed here because it is part of what is supposed to happen during the put request to tables/:tableId/seat
        console.log('here is the response from tableResponse: ', tableResponse);
        res.status(200).json({data: tableResponse});
    } catch(error){
        console.log('an error is being thrown in tables.controller.update ', error.stack);
        throw error};
}

//to be used on the Dashboard
async function list(req,res){
    try {
        const response = await service.list();
        res.status(200).json({data: response});
    } catch(error){throw error};
}

async function destroy(req,res){
    try{
        console.log('in tablesController.destroy with this table ', res.locals.table)
        const updatedTable = {...res.locals.table, reservation_id: null};
        console.log('sending the table to update: ', updatedTable);
        const tableResponse = await service.update(updatedTable);
        console.log('survived first awiat, and this is the response ', tableResponse);
        console.log('sending this reservation to become finished ', res.locals.reservation);
        const reservationResponse = await reservationService.update({...res.locals.reservation, status: 'finished'})
        console.log('this should be a finished reservation now ==> ', reservationResponse)
        console.log('survived second await')
        res.sendStatus(200)
    }catch(error){
        console.log('throwing error from tables.destroy ', error.stack);
        throw error};
  }

module.exports = {
    create: [validateBody, asyncErrorBoundary(create)],
    update: [hasValidReservation, canUpdate, asyncErrorBoundary(update)],
    destroy: [canUnassignReservation, asyncErrorBoundary(destroy)],
    list: asyncErrorBoundary(list),

}
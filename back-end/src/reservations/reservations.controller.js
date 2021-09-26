const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
const service = require('./reservations.service');

/**
 * List handler for reservation resources
 */
const today = new Date();
const validateBody = (req,res,next) => {

  //test that there is a req body
  if(!req.body.data) return next({status:400,message:'Body must include a data object'});

  //comfirm all required fields are present in the req body
  const requiredFields = ['first_name', 'last_name', 'mobile_number', 'reservation_date', 'reservation_time', 'people'];
  requiredFields.forEach((requirement) => {
    if(!req.body.data.hasOwnProperty(requirement) || req.body.data[requirement] === "") 
      return next({status:400,message:`Field required: ${requirement}`});
  })

  let reservationDate = new Date(req.body.data.reservation_date)
  //test if reservation_date is on a Tuesday
  if(reservationDate.getDay() === 1) return next({status:400, message: "The restaurant is closed on Tuesdays"});
  //test if reservation_date is in the past
  if (reservationDate  < today) return next({status:400, message: "Please choose either today or a future date to schedule your visit"});

  //test if reservation_date is in Date format
  if(Number.isNaN(Date.parse(req.body.data.reservation_date))){
    return next({status:400, message: 'reservation_date field is in an incorrect format'});
  }

  //test if reservation_time is in HH:MM format
  if(!/^([0-1][0-9]|[2][0-3]):([0-5][0-9])$/.test(req.body.data.reservation_time)){
    return next({status:400, message: 'reservation_time field is in an incorrect format'});
  }

  //test if reservation_time bounds are not crossed
  if(req.body.data.reservation_time < "10:30" || req.body.data.reservation_time > "21:30"){
    return next({status:400, message: "Please choose a reservation time within the working hours of the restaurant"});
  }

  //test if date and time combo is future
  if(reservationDate === today && reservation_time <= `${today.getHours()}:${today.getMinutes()}`) {
    return next({status:400, message: "Please select a future reservation time"});
  }

  //test if people is a number
  if((typeof req.body.data.people) != "number") return next({status:400, message:'people must be a number'});

  //test if people is a number greater than 0
  if(parseInt(req.body.data.people) < 1) return next({status:400, message: 'people must be greater than or equal to 1'});

  //test if the status is correct
  if(req.body.data.status && req.body.data.status !== 'booked') return next({status:400, message: `Reservations must always start off booked, not ${req.body.data.status}`});

  next();
}


const validReservation = async (req,res, next) => {
  if(!req.body.data.reservation_id) return next({status:404, message:`Please input a reservation`})
  const checkIfExists = await service.read(req.body.data.reservation_id);
  if(!checkIfExists) return next({status: 404, message: `The reservation with the id ${req.body.data.reservation_id} does not exist`});
  next();
}

const canUpdate = async (req,res,next) => {
  if(!req.body.data) return next({status:400, message: 'Body must include a data object'});
  if(!req.body.data.status) return next({status:400, message: 'There must be a status to which the reservation is being updated'});
  const possibleStatuses = ['booked', 'seated', 'finished', 'cancelled'];
  let statusIsPossible = false;
  for(let i=0; i < 4; i++){
    if(req.body.data.status === possibleStatuses[i]) statusIsPossible = true;
  }
  if(!statusIsPossible) return next({status:400, message: 'The status you are attempting to update is unknown'});
  const {reservation_id} = req.params;
  const originalReservation = await service.read(reservation_id);
  if(!originalReservation[0]) return next({status:404, message:`The reservation with the id ${reservation_id} does not exist`});
  if(originalReservation[0].status === 'finished') return next({status:400, message: 'A finished reservation cannot be updated'});
  res.locals.reservation = originalReservation[0];
  next();
}

async function create(req,res) {
  try {
    const newReservation = req.body.data;
    const response = await service.create(newReservation);
    res.status(201).json({data:response[0]}); 
  } catch(error){throw error};
}

async function read(req,res,next) {
  try{
    const {reservation_id} = req.params;
    const reservation = await service.read(reservation_id);
    if(!reservation[0]) return next({status:404, message:`A reservation with the id ${reservation_id} does not exist`});
    res.status(200).json({data: reservation[0]});
  } catch(error){throw error};
}

async function update(req,res,next){
  try {
    const updatedReservation = {...res.locals.reservation, status: req.body.data.status};
    const response = await service.update(updatedReservation);
    res.status(200).json({data: response});
  } catch(error){throw error};
}

async function edit(req,res) {
  try {
    const updatedReservation = req.body.data;
    const response = await service.update(updatedReservation);
    res.status(200).json({data:response});
  } catch (error) {throw error};
}

async function list(req, res) {
  try {
    let response;
    if(req.query.hasOwnProperty('mobile_number')) response = await service.search(req.query.mobile_number)
    else response = await service.list(req.query.date);
    res.json({data: response});
  } catch(error){throw error};
}


module.exports = {
  create: [validateBody, asyncErrorBoundary(create)], 
  edit: [validateBody, validReservation, asyncErrorBoundary(edit)],
  list: asyncErrorBoundary(list),
  read: asyncErrorBoundary(read),
  update: [canUpdate, asyncErrorBoundary(update)],
};

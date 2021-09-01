const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
const service = require('./reservations.service');

async function create(req,res) {
  const newReservation = req.body.data;
  const response = await service.create(newReservation);
  res.status(201).json({data:response[0]}); 
}
/**
 * List handler for reservation resources
 */
const validateBody = (req,res,next) => {
  if(!req.body.data) return next({status:400,message:'Body must include a data object'});
  const requiredFields = ['first_name', 'last_name', 'mobile_number', 'reservation_date', 'reservation_time', 'people'];
  requiredFields.forEach((requirement) => {
    if(!req.body.data.hasOwnProperty(requirement) || req.body.data[requirement] === "") 
      return next({status:400,message:`Field required: ${requirement}`});
  })
  if(Number.isNaN(Date.parse(`${req.body.data.reservation_date}`))){
    return next({status:400, message: 'reservation_date field is in an incorrect format'});
  }

  // if(Number.isNaN(Date.parse(`${req.body.data.reservation_time}`))){
  //   return next({status:400, message: 'reservation_time field is in an incorrect format'});
  // }

  if(Number.isNaN(parseInt(req.body.data.people))) return next({status:400, message:'party size must be a number'});
  if(req.body.data.people < 1) return next({status:400, message: 'party size must be greater than or equal to 1'});
  next();
}


async function list(req, res) {
  const date = req.query.date;
  const response = await service.list(date);
  res.json({data: response});
}

module.exports = {
  create: [validateBody, asyncErrorBoundary(create)], 
  list: asyncErrorBoundary(list),
};

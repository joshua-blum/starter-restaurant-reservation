const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
const service = require('./reservations.service');

async function create(req,res) {
  try {
    const newReservation = req.body.data;
    const response = await service.create(newReservation);
    res.status(201).json({data:response[0]}); 
  } catch(error){throw error};
}
/**
 * List handler for reservation resources
 */
const validateBody = (req,res,next) => {
  //test that there is a req body
  if(!req.body.data) return next({status:400,message:'Body must include a data object'});

  //comfirm all required fields are present in the req body
  const requiredFields = ['first_name', 'last_name', 'mobile_number', 'reservation_date', 'reservation_time', 'people'];
  requiredFields.forEach((requirement) => {
    if(!req.body.data.hasOwnProperty(requirement) || req.body.data[requirement] === "") 
      return next({status:400,message:`Field required: ${requirement}`});
  })

  //test if reservation_date is in Date format
  if(Number.isNaN(Date.parse(`${req.body.data.reservation_date}`))){
    return next({status:400, message: 'reservation_date field is in an incorrect format'});
  }

  //test if reservation_time is in HH:MM format
  if(!/^([0-1][0-9]|[2][0-3]):([0-5][0-9])$/.test(req.body.data.reservation_time)){
    return next({status:400, message: 'reservation_time field is in an incorrect format'});
  }

  //test if people is a number
  console.log('here is the typeof people', typeof req.body.data.people);
  if((typeof req.body.data.people) != "number") return next({status:400, message:'people must be a number'});

  //test if people is a number greater than 0
  if(parseInt(req.body.data.people) < 1) return next({status:400, message: 'people must be greater than or equal to 1'});

  next();
}


async function list(req, res) {
  try {
    const date = req.query.date;
    const response = await service.list(date);
    res.json({data: response});
  } catch(error){throw error};
}

module.exports = {
  create: [validateBody, asyncErrorBoundary(create)], 
  list: asyncErrorBoundary(list),
};

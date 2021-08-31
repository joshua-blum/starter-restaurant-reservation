const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

/**
 * List handler for reservation resources
 */
async function create(req,res) {
  const newReservation = req.body.data;
  res.status(201).json({data:newReservation}); 
}


async function list(req, res) {
  res.json({
    data: [],
  });
}

module.exports = {
  create: asyncErrorBoundary(create), 
  list: asyncErrorBoundary(list),
};

const router = require("express").Router();
const controller = require("./tables.controller");
const reservationsController = require('../reservations/reservations.controller');
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route('/:table_id/seat').put(controller.update).delete(controller.destroy).all(methodNotAllowed);
router.route('/').post(controller.create).get(controller.list).all(methodNotAllowed);

module.exports = router;
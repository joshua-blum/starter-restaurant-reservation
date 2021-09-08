/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");
const tablesController = require('../tables/tables.controller');
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route('/:reservation_id/seat').put(tablesController.update);
router.route('/:reservation_id').get(controller.read);
router.route('/').post(controller.create).get(controller.list).all(methodNotAllowed);

module.exports = router;

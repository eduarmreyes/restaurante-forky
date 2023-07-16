/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");

router.route("/").get(controller.list)
    .post(controller.insert)

router.route("/:reservation_id").get(controller.retrieveReservation)
    .put(controller.update);

router.route("/:reservation_id/status").put(controller.updateStatus);

module.exports = router;

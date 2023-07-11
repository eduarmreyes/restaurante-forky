/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");

router.route("/").get(controller.list)
    .post(controller.insert);

router.route("/get").post(controller.getReservation);

module.exports = router;

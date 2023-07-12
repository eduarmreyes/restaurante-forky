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

router.route("/:reservation_id/status").put(controller.update)
    .delete(controller.destroy);

module.exports = router;


const tourController = require("./../controller/tourController");
const express = require('express')
const router = express.Router();

//tours route handlers
router.param('id',tourController.checkId)
router
  .route("/")
  .get(tourController.getAllTours) //get all tours
  .post(tourController.createTour);
router
  .route("/:id")
  .patch(tourController.updateTour)
  .get(tourController.getTour)
  .delete(tourController.deleteTour);

//routes for users

module.exports = router;

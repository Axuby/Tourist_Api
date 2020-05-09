
const tourController = require("./../controller/tourController");
const express = require('express')
const router = express.Router();
const authController = require('../controller/AuthController')
//tours route handlers
router.param('id',tourController.checkId)
router
  .route("/")
  .get(authController.protect,tourController.getAllTours) //get all tours
  .post(authController.protect,tourController.createTour);
router
  .route("/:id")
  .patch(tourController.updateTour)
  .get(tourController.getTour)
  .delete(authController.restrictAccess('admin','lead-guide'),tourController.deleteTour);

//routes for users

module.exports = router;

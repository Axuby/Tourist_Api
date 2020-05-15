
const tourController = require("./../controller/tourController");
const express = require('express')
const router = express.Router();
const authController = require('../controller/AuthController')
const reviewCtrler = require('../controller/reviewController') 
const reviewRouter  = require('../routes/reviewRoutes')
//tours route handlers
router.param('id',tourController.checkId)

router.route('/top-5-tours')
.get(()=> tourController.aliasTopTours,tourController.getAllTours)

router.route('/tour-stats').get(tourController.getTourStats)
router.route('/monthly-plan').get(authController.restrictAccess('admin','lead-guide','guide'),tourController.getMonthlyPlan)


router.route('/tours-within/:distance/center/:latlng/unit/:unit')
.get(tourController.getToursWithin)

router
  .route("/")
  .get(tourController.getAllTours) //get all tours
  .post(authController.protect,authController.restrictAccess('admin','lead-guide'),tourController.createTour);
router
  .route("/:id")
  .patch(authController.protect,authController.restrictAccess('admin','lead-guide'),tourController.updateTour)
  .get(tourController.getTour)
  .delete(authController.restrictAccess('admin','lead-guide'),tourController.deleteTour);

//routes for review
//router.route('/:tourId/reviews').post(authController.protect,authController.restrictAccess('users'),reviewCtrler.createReview)
router.use('/:tourId/reviews',reviewRouter)

module.exports = router;

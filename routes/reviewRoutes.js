const express = require("express");
 const userController = require('../controller/userController')
 const authController  = require('../controller/AuthController')
 const reviewController = require('../controller/reviewController')
const router = express.Router({mergeParams:true});

router.use(authController.protect)
router.route('/')
.get(()=>reviewController.getAllReviews)
.post(authController.restrictAccess('user'),reviewController.setTourUserId,reviewController.createReview );
router.route('/:id')
.delete(authController.restrictAccess('user','admin'),reviewController.deleteReview)
.patch(authController.restrictAccess('user','admin'),reviewController.updateReview)
.get(reviewController.getReview)
module.exports = router;
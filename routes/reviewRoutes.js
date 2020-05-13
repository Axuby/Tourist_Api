const express = require("express");
 const userController = require('../controller/userController')
 const authController  = require('../controller/AuthController')
 const reviewController = require('../controller/reviewController')
const router = express.Router({mergeParams:true});


router.route('/')
.get(authController.protect,reviewController.getAllReviews)
.post(authController.protect,authController.restrictAccess('user'),reviewController.setTourUserId,reviewController.createReview );
router.route('/:id')
.delete(authController.protect,authController.restrictAccess('user'),reviewController.deleteReview)
.patch(authController.protect,authController.restrictAccess('user'),reviewController.updateReview)
.get(authController.protect,reviewController.getReview)
module.exports = router;
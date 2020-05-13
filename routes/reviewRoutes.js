const express = require("express");
 const userController = require('../controller/userController')
 const authController  = require('../controller/AuthController')
 const reviewController = require('../controller/reviewController')
const router = express.Router();


router.route('/').get(authController.protect,reviewController.getAllReviews)
.post(authController.protect,authController.restrictAccess('users'),reviewController.createReview );



module.exports = router;
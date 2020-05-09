const express = require("express");
 const userController = require('../controller/userController')
 const authController  = require('../controller/AuthController')
const router = express.Router();

//users handlers
router.post('/signup', authController.signUp)
router.get('/login',authController.login);

router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password', authController.resetPassword)

router
  .route("/")
  .get(authController.protect,userController.getAllStuff)
  .post(authController.protect,()=> userController.createThing);
router
  .route("/:id")
  .get(userController.getOneThing)
  .patch(userController.modifyThing)
  .delete(userController.deleteThing);


module.exports = router;

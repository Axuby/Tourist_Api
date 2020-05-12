const express = require("express");
 const userController = require('../controller/userController')
 const authController  = require('../controller/AuthController')
const router = express.Router();

//users handlers
router.post('/signup', authController.signUp)
router.post('/login',authController.login);


router.post('/forgot-password', authController.forgotPassword)
router.patch('/reset-password', authController.resetPassword)

router
  .route("/")
  .get(authController.protect,() => userController.getAllUsers)
  .post(authController.protect,()=> userController.createUser);
router
  .route("/:id")
  .get(userController.getOneUser)
  .patch(userController.modifyUser)
  .delete(userController.deleteUser);


module.exports = router;

const express = require("express");
 const userController = require('../controller/userController')
 const authController  = require('../controller/AuthController')
const router = express.Router();
const {getAllStuff,createThing} = userController
//users handlers
router.post('/signup', authController.signUp)
router.get('/login',authController.login);

router
  .route("/")
  .get(getAllStuff)
  .post(createThing);
router
  .route("/:id")
  .get(userController.getOneThing)
  .patch(userController.modifyThing)
  .delete(userController.deleteThing);


module.exports = route;

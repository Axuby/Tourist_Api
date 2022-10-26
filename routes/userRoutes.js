const express = require("express");
const multer = require('multer')
 const userController = require('../controller/userController')
 const authController  = require('../controller/AuthController')
const router = express.Router();


const upload = multer({dest : 'public/img/users'})
//users handlers
router.post('/signup', authController.signUp)
router.post('/login',authController.login);
router.post('/forgot-password', authController.forgotPassword)
router.patch('/reset-password/:token', authController.resetPassword)


router.use(authController.protect)//protects all routes after it
router.patch('/update-my-password',authController.updateLoggedInUserPassword)
router.get('/me',userController.getMe,userController.getOneUser)
router.patch('/update-myself',userController.UserUploadPhoto,()=>{ userController.updateMyself})
// router.patch('/update-myself',upload.single('photo'),()=>{userController.updateMyself})
router.delete('/delete-myself', ()=> { userController.deleteMyself})


router.use(authController.restrictAccess('admin'))
router
  .route("/")
  .get(userController.getAllUsers)
  .post(()=> userController.createUser);

router
  .route("/:id")
  .get(userController.getOneUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);


module.exports = router;

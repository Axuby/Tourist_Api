const  jwt = require('jsonwebtoken');

const User = require("../model/userMode;l")
const catchAsync = require('../utils/catchAsync')


exports.signUp = catchAsync( async (req,res,next)=>{
    // const newUser = await User.create(req.body)
    try {
   
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    })

    const token =  jwt.sign({
        id:newUser._id},
        process.env.JWT_SECRET,
        {
        expiresIn:process.env.JWT_SECRET_IN
    }
    )
    res.status(201).json({
      status:'succes',
        data:{
        newUser
     }
    })
         
} catch (error) {
     res.status(404).json({
         message:"Error",
         error
     })   
}
    next()
  })

  exports.login = (req,res,next)=>{
      
  }
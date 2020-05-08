const  jwt = require('jsonwebtoken');
const AppError = require('../utils/appError')
 const User = require("../model/userMode;l")
const catchAsync = require('../utils/catchAsync')
const {promisify} = require('util')


const signToken = id => {
    return jwt.sign({
        id:newUser._id},
        process.env.JWT_SECRET,
        {
        expiresIn:process.env.JWT_SECRET_IN
    })
}

exports.signUp = catchAsync( async (req,res,next)=>{
    // const newUser = await User.create(req.body)
   
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    })

    const token =  signToken(newUser._id)
    res.status(201).json({
      status:'succes',
        data:{
      user: newUser,
      token
     }
    })
         
})



  exports.login = catchAsync(async(req,res,next)=>{
      const {email,password} = req.body
    
      if (!email || !password) 
      return next(new AppError(`Please provide email and password`, 400))
    //   } else {
          
    //   }
    // jwt.verify(`${req.body.token}`,process.env.JWT_SECRET)

    const user =  await User.findOne({email}).select('+password')
    //use Bcrypt to compare
    const correct = await user.correctPassword(password,user.password)

    if (!user || !correct) {
        return next(new AppError('Incorrect email or password',401))
    }
const token = signToken(user._id)
res.status(200).json({
    user,
    token
})

  });



  exports.protect = catchAsync(async(req,res,next) =>{
      let token;
//check for token
      if (req.headers.authorization && req.headers.authorization.startWith('Bearer')) {
          token = req.headers.authorization.split(' ')[1]
      }
      if (!token) {
          return next(new AppError('You are not logged in !, Please login to get access.',401))
      }
console.log(token)
      //verify that token is valid
    const decodedToken  = await promisify(jwt.verify)(token,process.env.JWT_SECRET)
    console.log(decodedToken)
    //Does this user still exists
    const thisUserStillExist = await User.findById(decodedToken._id)
    if (!thisUserStillExist) {
        return next(new AppError('The user with this token no longer exist ',401))
    }

    //check if user changed password after the token was isssued
if (thisUserStillExist.changedPasswordAfter(decodedToken.iat)) {
    return next(new AppError('User recently changed password! Please log in again.',401))
}
req.user = thisUserStillExist;//Assign this user so it can be used in the next middleware
console.log(req.user)
console.log(thisUserStillExist)
next()
  })

  //401 - unauthorised
  //500 - internal server error
  //400 - Bad request
  //201 - created 
  //
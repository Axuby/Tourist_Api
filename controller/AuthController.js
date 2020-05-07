const  jwt = require('jsonwebtoken');
const AppError = require('../utils/appError')
 const User = require("../model/userMode;l")
const catchAsync = require('../utils/catchAsync')


const signToken = id => {
    return wt.sign({
        id:newUser._id},
        process.env.JWT_SECRET,
        {
        expiresIn:process.env.JWT_SECRET_IN
    }
    )
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

  //401 - unauthorised
  //500 - internal server error
  //400 - Bad request
  //201 - created 
  //
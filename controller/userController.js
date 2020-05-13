const User = require("../model/userMode;l");
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError')
const factory = require('../controller/handleFactory')
const multer = require('multer')

//const multerStorag = multer.diskStorage()
const filterObj = (obj,...allowedFields)=>{
    const newObj = {}
    Object.keys(obj).forEach((el)=> {
    if(allowedFields.includes(el)) newObj[el] = obj[el]
     } )
     return newObj;
}

exports.updateMyself = catchAsync(async(req,res,next)=>{
if (req.body.password || req.body.confirmPassword) {
    return next(new AppError('This route is not for password update!',400))
}
//filtered out unwanted updates
const filteredBody = filterObj(req.body,'name','email')

const updatedUser = await User.findByIdAndUpdate(req.user.id,filteredBody, {
    new:true,
    runValidators:true
})
res.status(200).json({
    status:'success',
    data:{
        user:updatedUser
    },
    message: "Post saved successfully!"
});
next()
})


exports.deleteMyself = catchAsync(async (req,res,next)=>{
await User.findByIdAndUpdate(req.user.id,{active:false})
res.status(204).json({
    status:'success',
    data:null
})

    next()
})



exports.createUser = catchAsync(async(req, res, next) => {
    const user = new User(req.body);
    user.save()
        .then(() => {
            res.status(201).json({
                message: "Post saved successfully!"
            });
        })
        .catch(error => {
            res.status(400).json({
                error: error
            });
        });
        next()
})


exports.getAllUsers = catchAsync( async(req, res, next) => {
    User.find()
        .then(things => {
            res.status(200).json(user);
        })
        .catch(error => {
            res.status(400).json({
                error: error
            });
        });
        next()
});

exports.getAllUsers = factory.getAll(User)
exports.getOneUser = factory.getOne(User)
exports.updateUser =  factory.updateOne(User)//admins only
exports.deleteUser = factory.deleteOne(User)
const User = require("../model/userMode;l");
const Tour = require('../model/tourModel')
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError')
const multer = require('multer')

//const multerStorag = multer.diskStorage()
const filterObj = (obj,...allowedFields)=>{
    const newObj = {}
    Object.keys(obj).forEach((el)=> {
    if(allowedFields.includes(el)) newObj[el] = obj[el]
     } )
     return newObj;
}

exports.updateMe = catchAsync(async(req,res,next)=>{
if (req.body.password || req.body.confirmPassword) {
    return next(new AppError('This route is not for password update!',400))
}

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

exports.getOneUser = (req, res, next) => {
    User.findOne({
            _id: req.params.id
        })
        .then(user => {
            res.status(200).json(user);
        })
        .catch(error => {
            res.status(404).json({
                error: error
            });
        });
        next
};

exports.modifyUser = (req, res, next) => {
    const user = new User(req.body);
    User.updateOne({ _id: req.params.id }, user)
        .then(() => {
            res.status(201).json({
                message: "Thing updated successfully!"
            });
        })
        .catch(error => {
            res.status(400).json({
                error: error
            });
        });
        next()
};

exports.deleteUser = (req, res, next) => {
    User.deleteOne({ _id: req.params.id })
        .then(() => {
            res.status(200).json({
                message: "Deleted!"
            });
        })
        .catch(error => {
            res.status(400).json({
                error: error
            });
        });
        next()
};

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

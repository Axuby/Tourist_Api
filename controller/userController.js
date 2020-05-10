const User = require("../model/userMode;l");
const Tour = require('../model/tourModel')
const catchAsync = require('../utils/catchAsync');
const multer = require('multer')

//const multerStorag = multer.diskStorage()

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
};

exports.getAllUsers = (req, res, next) => {
    Thing.find()
        .then(things => {
            res.status(200).json(things);
        })
        .catch(error => {
            res.status(400).json({
                error: error
            });
        });
};

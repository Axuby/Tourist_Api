const AppError = require('../utils/appError')
const Tour = require("../model/tourModel");
const Review = require('../model/reviewModel')
const catchAsync = require('../utils/catchAsync')



exports.createReview = catchAsync(async(req,res,next)=>{
const newReview = await  Review.create(req.body)
res.status(201).json({
    status:'success',
    data:{
        review:newReview
    }
})
})
exports.getAllReviews = catchAsync(async(req,res,next)=>{
    const reviews = await  Review.find(req.body)
    res.status(200).json({
        status:'success',
        results:reviews.length,
        data:{
            review:reviews
        }
    })
})
exports.createReview = catchAsync(async(req,res,next)=>{

})
exports.createReview = catchAsync(async(req,res,next)=>{

})
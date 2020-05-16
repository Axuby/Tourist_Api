const catchAsync = require('../utils/catchAsync')
const Tour = require('../model/tourModel');


exports.getOverview = catchAsync(async(req,res,next)=>{
    const tours = await Tour.find()
res.status(200).render('overview',{
    title:'All Tours',
    tours
})
})


exports.getTours = catchAsync(async(req,res,next)=>{
    const tour 
})
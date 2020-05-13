
const AppError = require('../utils/appError')
const Tour = require("../model/tourModel");
const catchAsync = require('../utils/catchAsync')
const APIFeatures = require('../utils/apiFeatures')
const factory = require('../controller/handleFactory')

exports.aliasTopTours = (req,res,next) =>{
  req.query.limit = '5'
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next()
}
//const tours = JSON.parse(fs.readFileSync(`${__dirname}/./../devData/simple.json`))
 exports.getAllTours = catchAsync(async (req, res,next) => {
const features = new APIFeatures(Tour.find(),req.query).filter().sortBy().limitFields().paginate()
const tours = await features.query

   //const tours = await Tour.find(queryObj).where('duration').equals(5).where('difficulty').equals('easy');//get all tours document in the DB ,the
    if (!tours) {
      return next(new AppError('No tours with that ID was found',404))
    }
    res.status(200).json({
      message: "success",
      results: tours.length,
      data: {
        tours
      }
    });
});

exports.checkId = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);
  if (!req.params.id * 1 > tours.length) {
    return res.status(404).json({
      message: "Invalid ID",
      status: "Not found"
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
  }
};
exports.getTour = factory.getOne(Tour,{path:'reviews'})
exports.createTour = factory.createOne(Tour)
exports.updateTour = factory.updateOne(Tour)
exports.deleteTour = factory.deleteOne(Tour)

exports.getTourStats = async (req,res,next) =>{
  try {
    const tourStat = await Tour.aggregate([
      {
        $match:{ ratingsAverage:{ $gte:4.5}}
      },
      {
        $group: {
          _id:{ $toUpper : 'difficulty'},
          numTours:{$sum :1},
          avgRating:{$avg:'$ratingsAverage'},
          avgPrice: {$avg: '$price'},
          minPrice: {$min: '$price'},
          maxPrice:{$max:'$price'}
        }
      },{
      $sort: { avgPrice:1}
      },
      {
        $match:{_id:{$ne:'EASY'}}
      }
    ])//passes this stages in sequence

    
  res.status(200).json({
    status: "success",
    data: {
      tourStat
    }
  });

  } catch (error) {
    next(new AppError('Cant access this resource',400))
  }
}

exports.getMonthlyPlan = async(req,res ,next) =>{
  try {
    const year = req.params.year;

const plan = await Tour.aggregate([
  {
    $unwind: '$startDates'
  },
  {
    $match:{
      $startDates :{
        $gte:new Date(`${year}-01-01`),//e.g 2020
        $lte:new Date(`${year}-12-31`),
      }
    }
  },
  {
    $group:{
      _id:{$month:'$startDates'},//where to extract the date from
      numTourStat: {$sum:1},
      tours:{ $push: 'name' }
    }
  },
  {
    $addFields:{ month:'$_id' }
  },
  {
    $project:{
      _id:0
    }
  },
  {
    $sort:{
      numTourStarts : -1
    }
  },
  {
    $limit:6
  }
])

res.status(200).json({
  status: "success",
  data: {
    tourStat
  }
});
  } catch (error) {
    next(new AppError('Cant access this resource',400))
  }
}

const AppError = require('../utils/appError')
const Tour = require("../model/tourModel");
const catchAsync = require('../utils/catchAsync')
const APIFeatures = require('../utils/apiFeatures')
const factory = require('../controller/handleFactory')

exports.getAllTours =  () =>factory.getAll(Tour)
exports.getTour = factory.getOne(Tour,{path:'reviews'})
exports.createTour = factory.createOne(Tour)
exports.updateTour = factory.updateOne(Tour)
exports.deleteTour = factory.deleteOne(Tour)

exports.aliasTopTours = (req,res,next) =>{
  req.query.limit = '5'
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next()
}

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

exports.getToursWithin = catchAsync(async(req,res,next) => {
const {distance,latlng,unit} = req.params;
const [lat,lng] = latlng.split(',')

const radius = unit === 'mi?' distance / 3963.2 :distance/6378.1;

if (!lat || !lng) {
  next(new AppError('Please provide latitude and longitude in the format lat,lng', 400))
}
console.log(distance,lat,lng,unit)

const tours = await Tour.find({startLocation:{$geoWithin:{$centerSphere:[[lng,lat,radius]]}}})

res.status(200).json({
  status: "success",
  results:tours.length,
  data:{
    data:tours
  },
})
})

exports.getDistance =catchAsync( async (req,res,next) =>{
  const {latlng,unit} = req.params;
  const [lat,lng] = latlng.split(',')
  

  
  if (!lat || !lng) {
    next(new AppError('Please provide latitude and longitude in the format lat,lng', 400))
  }
  console.log(distance,lat,lng,unit)
  
  const distances = await Tour.aggregate([
    {
      $geoNear:{
        near:{
          type:'point',
          coordinates:[lng *1,lat*1]
        },
        distanceField:'distance'
      }
    }
  ])

  res.status(200).json({
    status: "success",
   
    data:{
      data:distances
    },
  })
})
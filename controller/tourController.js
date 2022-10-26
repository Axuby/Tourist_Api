
const AppError = require('../utils/appError')
const Tour = require("../model/tourModel");
const catchAsync = require('../utils/catchAsync')
const APIFeatures = require('../utils/apiFeatures')
const factory = require('../controller/handleFactory')

const checkKeyExists = (object,keyName) =>{
  let keyExists = Object.keys(object).includes(keyName)
  let keyExist = Object.keys(object).some(key => key === keyName)
  return keyExist
}

exports.getAllTours =  () => factory.getAllTours(Tour)
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


const getOneTour = async (req, res, next) =>{
  //req.params.name
  const tour = await Tour.findOne({ _id: req.params.id }).populate({
    path: 'guides',
    select:'-_v -passwordChangedAt'
  })
}
const updateTour = async (req, res, next) =>{
  //req.params.name
 try {
   const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
    new:true,
    runValidators:true
  })
 } catch (errors) {
  res.status(401).json({
    status: 'faile',
    message: errors.message
  })
 }
}

 const deleteTour = async (req, res, next) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id)
  res.status(200).json({
    status: "success",
    message:"SUccessfully Deleted",

 })

  } catch (errors) {
    res.status(400).json({
      status: "error",
      me
    })
  }
}

 const filteringGetAllTours = async (req, res, next) => {
  const queryObj = {...req.query}
  //make a copy delete other keys/searching parameters (?difficulty=easy&page=1&sort=1&limit=1)
  const excludedFields = ["page", "sort", "limit", "fields"]
  excludedFields.forEach(el => delete queryObj[el]);

  //advanced filtering
  let queryStr = JSON.stringify(queryObj)
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
  let query = query.find(JSON.parse(queryStr));
  // let query = Tour.find({
  //   duration:5,
  //   difficulty:'easy',
  // })


  //sorting  sorting by (sort='name,duration,price') so removing the , in the URL inbtw them
  if(req.query.sort){
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  }else{
    query = query.sort('-createdAt')
  }
  //field selection/limiting returned results  'fields=name,-duration'
  if(req.query.fields){
    const fields = req.query.fields.split(',').join(' ')
    query = query.select(fields)
  }else{
    //remove _v
    query = query.select('-__v');
  }



  //pagination 1000/10 = 100 pages
  //(page=2&limit=10)  10 results per page,pg 2
    const page = req.query.page * 1 || 1
    const limit = req.query.limit *1 || 100
    const skip = (page - 1) * limit

    query =  query.skip(skip).limit(limit)
  //when query is greater than available docs
  if(req.query.page){
    const numTours = await Tour.countDocuments()
    if (skip >= numTours){
      throw new AppError()
    }
  }




  const tour = await query


  // Tour.find().where('duration').equals('').where().equals()
 }
exports.checkId = (req, res, next, val) => {
  // console.log(`Tour id is: ${val}`);
  if (!req.params.id * 1 > tours.length) {
    return res.status(404).json({
      message: "Invalid ID",
      status: "Not found"
    });
  }
  next();
};

exports.checkBodyy = (req, res, next)=> {
    if (!'name' in req.body || !"price" in req.body ||!req.body.price) {
        return res.status(400).send({
            status:'failed',
            data:null
        })
    }
    else if(!req.bod.hasOwnProperty('name') || !req.bod.hasOwnProperty('price')) {
    // else if(!Object.keys(req.body).hasOwnProperty('name')) {
        return res.status(400).send({
            status:'failed',
            data:null
        })
    }
    next()
}

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
  }
};

exports.getTourStats = async (req,res,next) =>{
  try {
    const tourStat = await Tour.aggregate([
      {
        $match:{ ratingsAverage:{ $gte:4.5}}
        //match essentially selects a document
        //ie a query
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
      // {
      //   $match:{_id:{$ne:'EASY'}} //not equal
      // }
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
    const year = req.params.year*1;

const plan = await Tour.aggregate([
                    {
                      $unwind: '$startDates' //deconstructs  and gets gets
                      //a single document for each matchinging startdate
                    },
                    {
                      $match:{
                        $startDates :{
                          $gte:new Date(`${year}-01-01`),//btw 2021 Jan - Dec 31
                          $lte:new Date(`${year}-12-31`),
                        }
                      }
                    },
                    {
                      $group:{ // group by id
                        _id:{$month:'$startDates'},//where to extract the date from, with the operator $month
                        numTourStat: { $sum:1},
                        tours:{ $push: 'name' }
                      }
                    },
                    {
                      $addFields:{ month:'$_id' } //add a new field month  to the
                    },
                    {
                      $project:{
                        _id:0 //removes id from the return query
                      }
                    },
                    {
                      $sort:{
                        numTourStarts : -1
                      }
                    },
                    {
                      $limit:12
                    }
                  ])

          res.status(200).json({
            status: "success",
            data: {
              tourStat
            }
          });
  }
  catch (error) {
    next(new AppError('Cant access this resource',400))
  }
}

exports.getToursWithin = catchAsync(async(req,res,next) => {
const {distance,latlng,unit} = req.params;
const [lat,lng] = latlng.split(',')

const radius = unit === 'mi'? distance / 3963.2 : distance/6378.1;

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
    },
    {
     $project:{
       distance:1,
       name : 1
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
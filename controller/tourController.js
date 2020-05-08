
const AppError = require('../utils/appError')
const Tour = require("../model/tourModel");
const catchAsync = require('../utils/catchAsync')

// const tour = new Tour();

// const 
// );

//const tours = JSON.parse(fs.readFileSync(`${__dirname}/./../devData/simple.json`))
  exports.getAllTours = catchAsync(async (req, res,next) => {
    const tours = await Tour.find();//get all tours in the DB
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

exports.getTour = catchAsync(async (req, res,next) => {
  console.log(req.params);
  const id = req.params.id * 1;
  //const tour = tours.find(el => (el.id = id));
  //To check if tours exists and that id is less than lenght of the tours
  const tour = await Tour.findById(id); //or Tour.findOne({id:req.params.id})
  if (tour) {
    if (id < tours.length) {
      res.status(200).json({
        status: "success",
        data: {
          tour
        }
      });
    }
  }else{
    return next(new AppError('No tour was found with that ID',404))
  }
  // } else {
  //   res.status(404).json({
  //     status: "fail",
  //     message: "Invalid ID"
  //   });
  // }
})


exports.createTour = catchAsync(async (req, res,next) => {
  // const newTour = new Tour({})
  // newTour.save().find()
  const {name,difficulty,rating,MaxGroupSize,Duration,price} = req.body
  const newTour = await Tour.create({
    name,
    difficulty,
    rating,
    MaxGroupSize,
    Duration,
    price});
  // const newId = tours[tours.length - 1].id + 1;
  // const newTours = Object.assign({ id: newId }, req.body);
  // tours.push(newTours);
  // const h = fs.writeFile(
  //   `${__dirname}/devData/simple.json`,
  //   JSON.stringify(tours),
  //   err => {
    if (!newTour) {
      return next(new AppError('No tour with that ID was found',404))
    }
  res.status(201).json({
    status: "success",
    // results: tours.length,
    data: {
      tours: newTour
      //       }
      //     });
      //   }
      // );
    }
  });
  // try {
  // } catch (error) {
  //   res.status(400).json({
  //     message: error,
  //     status: "fail"
  //   });
  // }
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


exports.updateTour = catchAsync(async (req, res,next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });

  if (!tour) {
    return next(new AppError('No tour with that ID was found',404))
  }
  res.status(200).json({
    status: "success",
    data: {
      tour
    }
  });
});

exports.deleteTour = catchAsync(async (req, res,next) => {
  //try {
   const tour =  await Tour.findByIdAndDelete(req.params.id);

   if (!tour) {
    return next(new AppError('No tours with that ID was found',404))
  }

    res.status(204).json({
      status: "success",
      data: null
    });
  // } catch (error) {
  //   res.status(400).json({
  //     message: error,
  //     status: "fail"
  //   });
  // }
});
 
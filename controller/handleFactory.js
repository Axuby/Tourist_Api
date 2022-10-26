
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const APIFeatures = require('../utils/apiFeatures')
const Tour = require('./../model/tourModel')
exports.deleteOne = Model => catchAsync(async (req, res,next) => {

     const doc =  await Model.findByIdAndDelete(req.params.id);

     if (!doc) {
      return next(new AppError('No document with that ID was found',404))
    }

      res.status(204).json({
        status: "success",
        data: null
      });
  });

  exports.updateOne = Model => catchAsync(async (req, res,next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,runValidators:true
    });

    if (!doc) {
      return next(new AppError('No document with that ID was found',404))
    }
    res.status(200).json({
      status: "success",
      data: {
        doc
      }
    });
  });

  exports.createOne = Model =>  catchAsync(async (req, res,next) => {
    const newDoc = await Model.create(req.body);
    // const newId = tours[tours.length - 1].id + 1;
    // const newTours = Object.assign({ id: newId }, req.body);
    // tours.push(newTours);
    // const h = fs.writeFile(
    //   `${__dirname}/devData/simple.json`,
    //   JSON.stringify(tours),
    //   err => {
      if (!newDoc) {
        return next(new AppError('There was an error creating the document',404))
      }
    res.status(201).json({
      status: "success",
      data: {
        data: newDoc
      }
  })
})

exports.getOne = (Model,populateOptions) => catchAsync(async (req, res,next) => {
    // console.log(req.params);
    // const id = req.params.id * 1;
    //const tour = tours.find(el => (el.id = id));
    //To check if tours exists and that id is less than length of the tours
    let query = Model.findById(req.params.id)
    if(populateOptions) query.populate(populateOptions);
    const doc = await query;
    if (doc) {
        res.status(200).json({
          status: "success",
          data: {
            data:doc
          }
        });
    }else{
      return next(new AppError('No document was found with that ID',404))
    }
  })

  exports.getAllTours = catchAsync(async (req, res,next) => {
    // const features = new APIFeatures(Tour.find(),req.query).filter().sortBy().limitFields().paginate()
    // const tours = await features.query


    const tours = await Tour.find(req.query).where('duration').equals(5).where('difficulty').equals('easy');
       //get all tours document in the DB ,the
        if (!tours) {
          return next(new AppError('No tours with that ID was found',404))
        }
        return {
          message: "success",
          results: tours.length,
          data: {
            tours
          }
        };
    });
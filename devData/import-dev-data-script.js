const fs = require('fs');
const mongoose = require("mongoose");
const URL = "mongodb://127.0.0.1:27017/Tourist";
const Tour = require('../model/tourModel')
const User = require('../model/userMode;l')
const Review = require('../model/reviewModel')
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

mongoose
  .connect(URL, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connected to DB");
  })
  .catch(err => {
    console.log(err);
  });


  const tourData = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,'utf-8'))
  // const userData = JSON.parse(fs.readFileSync(`${__dirname}/user.json`,'utf-8'))
  // const reviewData = JSON.parse(fs.readFileSync(`${__dirname}/review.json`,'utf-8'))

  const importData = async () =>{
     try {

        await Tour.create(tourData,{validateBeforeSave: false})
        // await User.create(userData,{validateBeforeSave: false})
        // await Review.create(reviewData,{validateBeforeSave: false})
        console.log('Successfully Created',tourData)
     } catch (error) {
         console.log(error)
         process.exit()
     }
  }


  const deleteData = async () =>{
    try {

       await Tour.deleteMany()
       console.log('Successfully deleted',tourData)
    } catch (error) {
        console.log(error)
        process.exit()
    }
 }

//console.log(process.argv)

if (process.argv[2]=== '--import') {
    importData()
} else if(process.argv[2] === '--delete'){
    deleteData()
}


// const queryObj = {...req.query};
// const excludeFields = ['page','limit','sort','fields']//exclude this from the query
// excludeFields.forEach(element => {
//   return delete queryObj[element]
// });
// //filtering

// let queryString = JSON.stringify(queryObj)
// queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
// console.log(queryString)
//sorting
// if (req.query.sort) {
//   const sortBy = req.query.sort.split(',').join('')//to sort by 2 or more parameters
// query = query.sort(sortBy)
// }else{
//   query = query.sort('-createdAt') // if not specified sortby createdAt


// //limit the fields
// if (req.query.fields) {
//   const fields = req.query.fields.split(',').join(' ')//mProjecting = process of selecting fieldnames by mongoose requests for string with field names separated by spaces
// query = query.select(fields) //eg select('name duration price)

// } else {
//   query = query.select('-__v') //default incase  doesn't specify fields,exclude this field
// }



//pagination
// const page = req.query.page * 1|| 1;
// const limit = req.query.limit* 1 ||  100;
// const skip = (page - 1) * limit
// query =  query.skip(skip).limit(limit)

// if (req.query.page) {
//   const numOfTours = await Tour.countDocuments()

//   if (skip >= numOfTours) {
//     throw new Error('This page doesnt exist')
//   }
// }



// const query =  Tour.find(queryObj)
//const query =  Tour.find(JSON.parse(queryString))
// console.log(query)
// const tours = await query
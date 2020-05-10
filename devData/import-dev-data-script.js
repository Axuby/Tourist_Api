const fs = require('fs');
const mongoose = require("mongoose");
const URL = "mongodb://127.0.0.1:27017/natours-test";
const Tour = require('../model/tourModel')
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connected to DB");
  })
  .catch(err => {
    console.log(err);
  });


  const tourData = JSON.parse(fs.readFileSync(`${__dirname}/simple.json`,'utf-8'))

  const importData = async () =>{
     try {
    
        await Tour.create(tourData)
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
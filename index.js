const express = require("express");
const mongoose = require("mongoose");
const user = require("./model/userMode;l");
const URL = "mongodb://127.0.0.1:27017/natours-test";

//uncaught exceptions  errors in our code that we didnt care to write
// our node app is in a cleaning state
process.on('uncaughtException',err => {
  console.log('ERROR',err.name,err.message)
  console.log('UNCAUGHT EXCEPTION! shutting down ....')
  process.exit(1)
})

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require('./app')
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
  //console.log(process.env)

const port = process.env.PORT || 4100;

//Handling the GET requests

//console.log(req.body)
//res.send("Done");
// const newId = tours[tours.length - 1].id + 1;
// const newTours = Object.assign({ id: newId }, req.body);
// tours.push(newTours);
// const h = fs.writeFile(
//   `${__dirname}/devData/simple.json`,
//   JSON.stringify(tours),
//   err => {
//     res.status(201).json({
//       status: "success",
//      // results: tours.length,
//       data: {
//         tours: newTours
//       }
//     });
//   }
//);

//:id and ? denotes that this params is optional
//responding to URL parameters using req.params.id
//app.get("/api/v1/tours/:id",getTours);
// app.get("/api/v1/tours", readData);
// //Handling POST requests Create
// app.post("/api/v1/tours",createData);
// //Handling PATCH requests Update
// app.patch("/api/v1/tours/:id",updateData);

const server = app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

//Unhandled rejections
process.on('unhandledRejection',err =>{
  console.log('ERR',err.name,err.message)
  console.log('UNHANDLED REJECTION! shutting down ....')
server.close(()=>{
  process.exit(1 )
})
})



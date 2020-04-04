const express = require("express");
const app = express();
const mongoose = require("mongoose");
//const user = require("./model/userMode;l");
const URL = "mongodb://127.0.0.1:27017/natours-test";
//
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

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});





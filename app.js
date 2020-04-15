const express = require("express");
const app = express();
const cookieParser = require('cookie-parser')
const morgan = require("morgan");
const bodyParser = require('body-parser')
const route = require("./routes/userRoutes");
const router = require("./routes/tourRoutes");
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controller/errorController')

app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

if ((process.env.NODE_ENV = "development")) {
  app.use(morgan("dev"));
}

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,Content,Accept"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,PATCH,PUT");

  next();
});

app.use((req, res, next) => {
  console.log("Hello from the middleware");
  next();
});
app.use((req, res, next) => { 
  req.requestTime = new Date().toISOString();
  console.log(req.requestTime);
  next();
});
app.use(route)
app.use("/api/v1/users", route);
app.use("/api/v1/tours", router);

app.all("*", globalErrorHandler)

// app.use((err,req,res,next) =>{
//   const err.statusCode = err.statusCode||500
//   const err.status = err.status|| 'error'

//   res.status(err.statusCode).json({
//     status:err.status,
//     message:err.message
//   })
// })
module.exports = app;

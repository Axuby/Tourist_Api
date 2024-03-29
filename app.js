const express = require("express");
const path = require('path')
const app = express();
const  rateLimit = require('express-rate-limit')
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss')
const hpp  = require('hpp')//clears up the query string
const cookieParser = require('cookie-parser')
const morgan = require("morgan");
const bodyParser = require('body-parser')
const userRouter= require("./routes/userRoutes");
const tourRouter = require("./routes/tourRoutes");
const reviewRouter = require('./routes/reviewRoutes')
//const AppError = require('./utils/appError')
const globalErrorHandler = require('./controller/errorController')
app.use(helmet())// set security headers
app.set('view engine','pug')
app.set('views',path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname,'public')));



const limiter = rateLimit({
  max:100,//100 requests from 1 IP
  windowMs:60*60*1000,
  message:'Too many requests from this IP,please try again in  hour'
})
app.use('/api',limiter) // adds a limiter header(s)
app.use(express.json({limit:'10kb'}));
//app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

if ((process.env.NODE_ENV = "development")) {
  app.use(morgan("dev"));
}
//Data Sanitization for NoSQL query Injection
app.use(mongoSanitize())
//Data Sanitization for XSS(prevent malicious html code in javascript)
app.use(xss)
//removes duplicate fields, prevent HTTP Parameter Pollution
app.use(hpp({
  whitelist:['duration','difficulty','maxGroupSize','price','ratingsAverage','ratingQuantity']
}))


// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With,Content,Accept"
//   );
//   res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,PATCH,PUT");

//   next();
// });

// app.get('/', (req, res, next) => {
//   console.log(req.headers)
//   next()
// })
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tours", tourRouter);
app.use('/api/vi/reviews',reviewRouter)

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

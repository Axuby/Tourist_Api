const AppError = require("../utils/appError")

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`
  return new AppError(message,400)
}

const handleDuplicateFieldsDB =  (err) => {
      const value = err.ermsg.match(/(["'])(\\?.)*?\1/)[0]
      const message = `Duplicate field value: ${value}.Please use another value`;
      console.log(value)
      return new AppError(message , 400)
  }
  const handleValidationErrorDB = err => {

    const errors = Object.values(err.errors).map(el => el.message)
    const message = `Invalid input date.${errors.join('. ')}`
    return new AppError(message,400)
  }


  const sendErrorProd = (err,res) =>{
    //operational error
    if (err.isOperation) {
      res.status(err.statusCode).json({
        status:err.status,
        message:err.message 
      });
    }else{
      res.status(500).json({
        status:'Error',
        message:'Something went very wrong!'
      })
    }
  }

  const sendErrorDev = (err,res)=>{
    res.status(err.statusCode).json({
      status:err.status,
      message:err.message,
      stack:err.stack,
      error:err
    });
  }

  const handleJwtError = () => new AppError('Invalid token! Please login again',401 )

  const handleExpiredTokenError = () => new AppError('Token expired! Please login again',401)




  module.exports = (err,req, res, next) => {
        err.status = err.status || 'error';
        err.statusCode = err.statusCode || 500;

        if (process.env.NODE_ENV === "development") {

            sendErrorDev(err,res)

        }else if(process.env.NODE_ENV === 'production'){
         
          console.error('Error',err);

          //error handling for mongoose using the name key of err
                let error = {...err};
                if (error.name === 'CastError')   error = handleCastErrorDB(error)
                //from postman
                if (error.code === 11000)    error = handleDuplicateFieldsDB(error) 
                if (error.name === 'ValidationError')   error = handleValidationErrorDB(error)
                // Handle jwt error
                if (error.name === 'jsonWebTokenError') error = handleJwtError()
        if (error.name === 'TokenExpiredError') error = handleExpiredTokenError()
        sendErrorProd(err,res)
        }
        
  next(new AppError(`the ${req.originalUrl} could not be found on this server `,404));
} 

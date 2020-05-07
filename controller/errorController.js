
  const sendErrorProd = (err,res) =>{
    //operatinal error
    if (err.isOperation) {
      res.status(err.statusCode).json({
        status:err.status,
        message:err.message 
      });
    }else{
      //code or unknown error
      console.error('Error',err);
      
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





module.exports = (err,req, res, next) => {

  //const err = new Error(`the ${req.originalUrl} could not be found on this server `)
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;
  

 if (process.env.NODE_ENV === "development") {
sendErrorDev(err,res)

 }else if(process.env.NODE_ENV === 'production'){
 sendErrorProd(err,res)
 }
  next(
    new AppError(
      `the ${req.originalUrl} could not be found on this server `,
      404
    )
  );
} 

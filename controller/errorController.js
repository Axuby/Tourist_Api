module.exports = (req, res, next) => {
  res.status(404).json({
    message: `the ${req.originalUrl} could not be found on this server `
  });
  const err = new Error(`the ${req.originalUrl} could not be found on this server `)
  err.status = 'fail'
  err.statusCode = 400
  next(
    new AppError(
      `the ${req.originalUrl} could not be found on this server `,
      404
    )
  );
} 

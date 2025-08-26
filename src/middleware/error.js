'use strict';
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Server Error';
  const response = { success: false, error: message };
  if (err.details) {
    response.details = err.details;
  }
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    response.stack = err.stack;
  }
  console.error(err);
  res.status(statusCode).json(response);
}
module.exports = errorHandler;
const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', err.message);

  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : (err.statusCode || 500);
  let message = err.message || 'Internal Server Error';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map(val => val.message);
    message = errors.join(', ');
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'Field';
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists. Please use another value.`;
  }

  if (err.name === 'CastError') {
    statusCode = 404;
    message = `Resource not found with id: ${err.value}`;
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Authorization denied.';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired. Please log in again.';
  }

  res.status(statusCode).json({
    success: false,
    message: message
  });
};

module.exports = errorHandler;

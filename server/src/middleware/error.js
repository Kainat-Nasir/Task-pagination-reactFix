export function notFound(_req, _res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
}

export function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  const payload = {
    error: {
      message: err.message || 'Internal Server Error'
    }
  };
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    payload.error.stack = err.stack;
  }
  res.status(status).json(payload);
}
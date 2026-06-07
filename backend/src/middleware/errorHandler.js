const multer = require('multer');

const errorHandler = (err, req, res, next) => {
  // Handle Multer errors (file upload)
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Ukuran file terlalu besar. Maksimal 5MB.'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Field upload tidak valid.'
      });
    }
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`
    });
  }

  // Handle custom file filter errors
  if (err.message && err.message.includes('File harus berupa gambar')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  // Log full error server-side for debugging
  console.error('Error:', err.stack || err.message);

  const status = err.status || 500;
  const isProd = process.env.NODE_ENV === 'production';

  // Don't leak internal error details (stack traces, DB errors) to clients in production.
  // 4xx errors carry intentional, safe messages; 5xx are masked in production.
  let message;
  if (status < 500) {
    message = err.message || 'Request error';
  } else {
    message = isProd ? 'Internal Server Error' : (err.message || 'Internal Server Error');
  }

  res.status(status).json({
    success: false,
    message
  });
};

module.exports = errorHandler;
const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage(); // Store files in memory as buffers

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'application/msword', 
                       'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers PDF et Word sont autorisés'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = upload;
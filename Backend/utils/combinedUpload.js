// utils/combinedUpload.js
const multer = require('multer');
const uploadImage = require('./uploadImage');
const upload = require('./upload');

const combinedUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (['personalPhoto', 'housePhoto'].includes(file.fieldname)) {
      return uploadImage.fileFilter(req, file, cb);
    }
    if (file.fieldname === 'bulletin') {
      return upload.fileFilter(req, file, cb);
    }
    cb(new Error('Champ de fichier inattendu'));
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
}).fields([
  { name: 'personalPhoto', maxCount: 1 },
  { name: 'housePhoto', maxCount: 1 },
  { name: 'bulletin', maxCount: 1 }
]);

module.exports = combinedUpload;

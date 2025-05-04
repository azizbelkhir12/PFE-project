const imgurUpload = require('./imgurUpload');

const uploadImgurField = (fieldName, urlKey) => {
  return (req, res, next) => {
    if (req.files?.[fieldName]?.[0]) {
      req.file = req.files[fieldName][0];
      imgurUpload(req, res, (err) => {
        if (err) return next(err);
        req[urlKey] = req.imgurUrl;
        next();
      });
    } else {
      next();
    }
  };
};

module.exports = {
  uploadPersonalPhoto: uploadImgurField('personalPhoto', 'imgurUrlPersonalPhoto'),
  uploadHousePhoto: uploadImgurField('housePhoto', 'imgurUrlHousePhoto')
};

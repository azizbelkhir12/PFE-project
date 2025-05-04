const axios = require('axios');
const FormData = require('form-data');

const IMGUR_CLIENT_ID = '8613856d5e58443';
const IMGUR_API_URL = 'https://api.imgur.com/3/image';

module.exports = async (req, res, next) => {
  if (!req.file) return next();
  
  try {
    const formData = new FormData();
    // Convert buffer to base64 WITHOUT data URI prefix
    const base64Data = req.file.buffer.toString('base64');
    
    // Validate image format
    if (!req.file.mimetype.match(/image\/(jpeg|png|gif|bmp)/)) {
      throw new Error('Unsupported image format');
    }

    formData.append('image', base64Data);
    formData.append('type', 'base64');

    const response = await axios.post(IMGUR_API_URL, formData, {
      headers: {
        'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`,
        ...formData.getHeaders()
      }
    });
    
    req.imgurUrl = response.data.data.link;
    next();
  } catch (error) {
    console.error('Imgur upload error:', {
      error: error.message,
      file: {
        originalname: req.file?.originalname,
        mimetype: req.file?.mimetype,
        size: req.file?.size
      }
    });
    return res.status(500).json({ 
      error: 'Image upload failed',
      details: error.message
    });
  }
}

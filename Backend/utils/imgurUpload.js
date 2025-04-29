const axios = require('axios');
const FormData = require('form-data');

const IMGUR_CLIENT_ID = '8613856d5e58443';
const IMGUR_API_URL = 'https://api.imgur.com/3/image';

module.exports = async (req, res, next) => {
  if (!req.file) return next();
  
  try {
    const formData = new FormData();
    formData.append('image', req.file.buffer.toString('base64'));
    
    const response = await axios.post(IMGUR_API_URL, formData, {
      headers: {
        'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`,
        ...formData.getHeaders()
      }
    });
    
    req.imgurUrl = response.data.data.link;
    next();
  } catch (error) {
    console.error('Imgur upload error:', error);
    return res.status(500).json({ error: 'Image upload failed' });
  }
};
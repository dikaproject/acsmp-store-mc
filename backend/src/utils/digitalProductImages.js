const fs = require('fs/promises');
const path = require('path');

const imagePrefix = '/uploads/digital-products/';
const uploadDirectory = path.resolve(__dirname, '../../uploads/digital-products');

const removeDigitalProductImage = async (imageUrl) => {
  if (typeof imageUrl !== 'string' || !imageUrl.startsWith(imagePrefix)) return;

  const filename = imageUrl.slice(imagePrefix.length);
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(filename)) return;

  try {
    await fs.unlink(path.join(uploadDirectory, filename));
  } catch (error) {
    if (error.code !== 'ENOENT') console.error('Could not remove digital product image:', error.message);
  }
};

const uploadedImageUrl = (file) => file ? `${imagePrefix}${file.filename}` : null;

module.exports = { removeDigitalProductImage, uploadedImageUrl };

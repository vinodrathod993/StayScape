const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_Key,
    api_secret:process.env.CLOUD_API_Secret
})
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_project',
    allowerdFormats: ["png","jpg","jpeg"], // supports promises as well
    
  },
});
module.exports={
    cloudinary,storage
}
const cloudinary = require("cloudinary");
exports.cloudinaryConnect = () => {
  try {
    //Using the config method of cloudinary to estabilish connection
    //in config method we have to define three thing which are=== cloud name , Api key, Api secret key

    //To get these details we need to go to cloudinary.com and there go to settings and then api key

    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
  } catch (error) {
    console.error(error);
    console.log(error);
  }
};

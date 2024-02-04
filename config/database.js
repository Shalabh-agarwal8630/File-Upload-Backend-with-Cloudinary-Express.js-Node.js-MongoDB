const mongoose = require("mongoose");
require("dotenv").config();

exports.connectWithDb =  () => {
  mongoose.connect(process.env.DATABASE_URL)

    .then(() => {
      console.log("DB se connection made successfully");
    })
    .catch((error) => {
      console.log("Issue in Db connection");
      console.log(error.message);
      process.exit(1);
    });
};


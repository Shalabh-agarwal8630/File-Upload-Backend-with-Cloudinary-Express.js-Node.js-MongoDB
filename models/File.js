const mongoose = require("mongoose");
const nodemailer=require('nodemailer')
require("dotenv").config();

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  tags: {
    type: String,
  },
  email: {
    type: String,
  },
});


//idhar schema ke baad aur model ke beech me likhna hota h ye post and pre middleware
//Task is to send a mail on every successful entry in DB
//PRE and POST middleware
//If i want to do some task just before the db entry we will use the pre middleware 
//but if i want to do some task just after the db entry is done then we will use the post middleware

//post middleware

fileSchema.post("save", async function(doc)
{
  try{
    //here doc is the entry that is saved in the database
    console.log("Doc ",doc);

    //WE have to create a transporter
    let transporter=nodemailer.createTransport({
      host:process.env.MAIL_HOST,
      auth:{  
        user:process.env.MAIL_USER,
        pass:process.env.MAIL_PASS 
      }

    }
    )
    //send email
    //Shift this configuration to config folder
    let info=await transporter.sendMail({
      from:`VenomOP`,
      to:doc.email,
      subject:"New File uploaded on Cloudinary",
      html: `<h1>Hello vro </h1> <p> File uploaded</p> View here: <p><a href="${doc.imageUrl}">${doc.imageUrl} </a></p>`,

    })

    console.log("INFO is --" ,info )
  }
  catch(error)
  {
    console.error(error);
    
  }
})

const File=mongoose.model("File",fileSchema);
module.exports=File;


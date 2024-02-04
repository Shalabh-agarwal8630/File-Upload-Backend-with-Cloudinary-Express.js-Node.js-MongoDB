//App create
//--------------------------------------------------------------
const express=require('express');
const app=express();
const PORT=3000;

//adding middlewares

app.use(express.json());

// now if in express we want to interact with the image video files we need to have middleware
//express file upload or multer

const fileupload=require('express-fileupload');

app.use(fileupload({
 useTempFiles:true
}));
//iske andar flag passs kr skte h like temppath ka which we can set as true
//this method of file upload -- will upload files on server!!!
//wheread Cloudinary file upload--server pe upload krke media server pe upload krta h aur badme server 
//par se delete krdeta h us temporary location se so in short vo data ko media server ko upload krta h rather than server pe upload krke

const db=require("./config/database")
db.connectWithDb();

//cloud se connect krna h ab

const cloudinary =require("./config/cloudinary");
cloudinary.cloudinaryConnect();

//Routes 

// Routes
const Upload = require("./routes/FileUploadRoute");
app.use("/api/v1/upload", Upload);

//activate server

app.listen(PORT,()=>{
console.log(`Your app is running at PORT ${PORT}`)
})



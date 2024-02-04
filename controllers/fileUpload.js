const File=require('../models/File');
const cloudinary=require("cloudinary").v2;
//Now we have to create controller for uploading file
//this handler will take a file from the client's path and upload it on the server's path

//async because file uploading task

exports.localFileUpload=async (req,res)=>{
 try
  { 
   //Fetch file 
   //ye .file mtlb naam h iska postman me file
   //req.files is like a box containing all the uploaded files.
   const file=req.files.file;
   console.log("This is the file ",file);
   //req.files.file: Inside the box (req.files), there are separate compartments for each uploaded file. 
   //If someone uploaded a file using a form field named "file," req.files.file refers to the contents of that compartment.

   //Now at which path i want to store it on the server we will define that
   //dirname shows the current working directory

   //ye server ka path h
   //This is the path where file needs to be stored on server
   let path=__dirname + "/files/" + Date.now() +`.${file.name.split('.')[1]}`;
   console.log("PATH is ->", path)
   //ab isko move bhi krna padega merko server par so 

   file.mv(path,(err)=>{
    console.log(err);
   })

   res.json({
    sucess:true,
    message:"Local file uploaded successfully"
   })


 }
 catch(error)
 {
  console.log(error);
 }
}


//Image upload on cloudinary handler
//1.data fetch 2.validation -> if file type supported yes - then upload to cloudinary,save in database,and successful response
//if no then return response 

function typeSupportedornot(supportedTypes,fileType)
{
  
  return supportedTypes.includes(fileType);
}

async function uploadfiletocloudinary(file,folder,quality)
{
  const foldertoPush={folder};
  console.log("temp file path",file.tempFilePath);  
  if(quality)
  {
    foldertoPush.quality=quality;
  }

return await cloudinary.uploader.upload(file.tempFilePath,foldertoPush);

}
//image upload to cloud vala handler
exports.imageUpload=async (req,res)=>{
  try
  {
    //data fetch

    const{name,tags,email}=req.body;
    console.log(name,tags,email);

    const file=req.files.Cloudfile;
    console.log(file);
    //image size validation

    // const maxSize = 5 * 1024 * 1024; // 5 MB in bytes
    // if (file.size > maxSize) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "File size exceeds the limit (5 MB)",
    //   });
    // }
    //Now doing validationn

    const supportedTypes=["jpg","jpeg","png"];
    const fileType=file.name.split('.')[1].toLowerCase();
    if(!typeSupportedornot(supportedTypes,fileType))
    {
      return res.status(400).json(
        {
            success:false,
            message:"This file type is not supported"
        }
      )
    }

    //File format supported 

    const response=await uploadfiletocloudinary(file,"Venom");
    //in this response there will be an object
    console.log("response is ",response);

    //now db me entry

    const fileData=await File.create({
      name,
      tags,
      email,
      imageUrl:response.secure_url
    })

    res.json({
      success:true,
      message:"Image Successfully Uploaded",
      imageUrl:response.secure_url
    })

    }

  catch(error)
  {
    console.error(error);
    res.status(400).json({
      success:false,
      message:"Something went wrong"
    })

  }
}

//NOW video upload
//steps are--
//1.Data fetch
//2.validation, size validation bhi laga skte h ki itne size ki file honi chaie
//3.upload to cloudinary 
//4.save in db
//5.send response
async function uploadVideoToCloudinary(file, folder) {
  const folderToPush = { folder };
  folderToPush.resource_type="auto";
  return await cloudinary.uploader.upload(file.tempFilePath, folderToPush);
}


exports.videoUpload=async (req,res)=>{
  try{
    const{name,email,tags}=req.body;
    console.log(name,email,tags);
    //fetching the file from req
    const file=req.files.videoFile;
    //Now doing validationn

    const maxSize = 5 * 1024 * 1024; // 5 MB in bytes
    if (file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: "File size exceeds the limit (5 MB)",
      });
    }
    
    const supportedTypes=["mp4","mov"];
    const fileType=file.name.split('.')[1].toLowerCase();
    //adding a upper limit of 5mb 
    if(!typeSupportedornot(supportedTypes,fileType))
    {
      return res.status(400).json(
        {
            success:false,
            message:"This file type is not supported"
        }
      )
    }


    //File format supported 

    const response=await uploadVideoToCloudinary(file,"Venom");
    console.log("yaha tak")

    //in this response there will be an object
    console.log("response is ",response);

    //now db me entry

    const fileData=await File.create({
      name,
      tags,
      email,
      imageUrl:response.secure_url
    })

    res.json({
      success:true,
      message:"video Successfully Uploaded",
      imageUrl:response.secure_url
    })



  }

  catch(error)
  {
    res.status(400).json({
      success:false,
      message:"SOMETHING went WRONG"
    })
  }
}


exports.imageSizeReducer= async (req,res)=>{

  try
  {
    const{name,email,tags}=req.body;
    console.log(name,email,tags);
    //fetching the file from req

    const file=req.files.imagereduced;

    // Now doing size validationn

    const maxSize = 5 * 1024 * 1024; // 5 MB in bytes
    if (file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: "File size exceeds the limit (5 MB)",
      });
    }
    
    const supportedTypes=["jpg","jpeg","png"];
    const fileType=file.name.split('.')[1].toLowerCase();
    //adding a upper limit of 5mb 
    if(!typeSupportedornot(supportedTypes,fileType))
    {
      return res.status(400).json(
        {
            success:false,
            message:"This file type is not supported"
        }
      )
    }


    //File format supported 

    const response=await uploadfiletocloudinary(file,"Venom",30);
    console.log("yaha tak")

    //in this response there will be an object
    console.log("response is ",response);

    //now db me entry

    const fileData=await File.create({
      name,
      tags,
      email,
      imageUrl:response.secure_url
    })

    res.json({
      success:true,
      message:"video Successfully Uploaded",
      imageUrl:response.secure_url
    })
  }

  catch(error)
  {
    res.status(400).json({
      success:false,
      message:"SOMETHING went WRONG"
    })
  } 
}



import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (LocalFilePath) =>{
    try {
        if(!LocalFilePath) return null;
        // Upload on claudinary...
        const responce = await cloudinary.uploader.upload(LocalFilePath,{
            resource_type:"auto",
        })
        console.log("File Uploaded Successfully : "+responce.url);
        return responce;
    } catch (error) {
        fs.unlinkSync(LocalFilePath); //remove the local saved file 
        return null;
    }
}

export default uploadOnCloudinary;
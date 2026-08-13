import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name :process.env.CLOUD_NAME ,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath)=>{
    try {
        if (!localFilePath) return null 

        // uploading file on cloudinary  

        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        // after uploading removing file from temp
        fs.unlinkSync(localFilePath);
        return response.url
    } catch (error) {
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
};

export default uploadOnCloudinary;
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({
    path: "../.env",
  });

// configure cloudinary

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        })
        console.log("file uploaded on cloudinary. File src: " + response.url);
        // once the file is uploaded, delete the local file
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null
    }
};

const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return null
        const result = await cloudinary.uploader.destroy(publicId)
        console.log("file deleted from cloudinary. Public Id ", publicId);
        return result
    } catch (error) {
        console.log("Error deleting file from cloudinary", error);
        return null
        
    }
};

export { uploadOnCloudinary }
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({ 
  cloud_name: "drh", 
  api_key: "4995", 
  api_secret: "fill all 3"
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
      
        if (!localFilePath) {
            console.error("File path is not provided.");
            return null;
        }        
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        
   
        
        // Delete the locally saved temporary file after successful upload
        fs.unlinkSync(localFilePath);

        return response;
    } catch (error) {
        console.error("Error uploading file to Cloudinary:", error.message);
        
        // Remove locally saved temporary file as upload failed  
        fs.unlinkSync(localFilePath);

        return null;
    }
};

export { uploadOnCloudinary };

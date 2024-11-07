import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });
    //   CLOUDINARY_URL=cloudinary://428382174514259:zBtyVST0UBSVl_gtYSXjQssJFHY@dkz05eqfu

    const uploadOnCloudinary = async (localFilePath)=>{
        try {
            if (!localFilePath) return null; 
            // If you're working in C/C++, NULL is standard.
            // If you're working in languages like JavaScript, Java, or Python, null is what you would use.
           // if u write like this if (!localFilePath) return NULL;
           // It will throw an error like:
           // It will throw an error 
           // Uncaught ReferenceError: NULL is not defined


           //File Upload to cloudinary
             const response = await cloudinary.uploader.upload(localFilePath,{
                resource_type:'auto'
            })

            //After file upload success
            console.log("File is uploaded on cloudinary ",response.url) ;
            return response;
        } catch (error) {
            fs.unlinkSync(localFilePath);  //unlinkSync is a delete operation that removes the file from the filesystem.
            return null;

 
        }
    }

    export{uploadOnCloudinary}
    
    
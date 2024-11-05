import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";



const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);  //The DB_NAME is used to specify the name of the database that you're connecting to in MongoDB.
        console.log(`\n MongoDB connected !! DB HOST:${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("Error in index.js file index.js in db file:",error);
        process.exit(1);          //process.exit(): This method is part of Node.js's process object. It is used to terminate the currently running
                                  // process (in this case, your Node.js application).
    }
}

export default connectDB;
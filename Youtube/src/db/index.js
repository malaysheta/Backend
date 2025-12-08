import mongoose  from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
    try{
        let responce = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("Data base conneted : ",responce.connection.host);   
    }
    catch (e){ 
        console.error("Error in DB Connection" , e);
    }
}



export default connectDB;
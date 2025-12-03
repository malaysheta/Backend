import dotenv from "dotenv"
import connectDB from './src/db/index.js';

dotenv.config();
connectDB();

// First way which is not much readble when code is builky
// async function databaseConnection() {
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         console.log("Data base conneted");
//         app.listen(process.env.PORT,()=>{
//             console.log("App is running on port : " , process.env.PORT)
//         })
//     }
//     catch (e){ 
//         console.error("Error" , e);
//     }
// }

// databaseConnection();
import dotenv from "dotenv"
import connectDB from './src/db/index.js';
import app from "./src/app.js";


dotenv.config();


connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Server running at port:", process.env.PORT);
    });
  })
  .catch((e) => {
    console.log("Port is not connected", e);
  });

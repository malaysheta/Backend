import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";


const app = express();

app.use(cors())
app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended:true}))
app.use(express.static("public")) //
app.use(cookieParser())


// import Routes

import UserRoute from "./routes/user.route.js"

// routes declaration

app.use("/api/v1/users",UserRoute);
 
app.post("/test", (req, res) => {
    res.json({ message: "Working fine" });
});

export default  app 
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
import TweetRoute from './routes/tweet.route.js'
import VideoRoute from "./routes/video.route.js"
import CommentRoute from "./routes/comment.route.js"
import PlaylistRoute from './routes/playlist.route.js'
import SubscriptionRoute from './routes/subscription.route.js'
// routes declaration

//user route
app.use("/api/v1/users",UserRoute);
//tweet route
app.use('/api/v1/tweet',TweetRoute);
//vidoe route
app.use('/api/v1/video',VideoRoute);
//comment route
app.use('/api/v1/comment',CommentRoute);
//playlist route
app.use('/api/v1/playlist',PlaylistRoute);
//subscription route
app.use('/api/v1/subscription',SubscriptionRoute);

export default  app 
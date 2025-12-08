import { Tweet } from "../models/tweet.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



const createTweet = asyncHandler(async(req,res)=>{
    // take tweet from frontend
    // validate the tweet
    //create obeject tweet and create enty in db
    //cheack for the tweet 
    // res

    
    const tweetContent  = req.body.content;

    if (!tweetContent) {
        throw new ApiError(400,"Tweet is required.")
    }

    const user = req.user._id;
    
    const tweet = await Tweet.create({
        owner : user,
        content : tweetContent,
    })

    const createdTweet = await Tweet.findById(tweet._id);

    if(!createdTweet){
        throw new ApiError(500,"Internal Server error , Enable to store new tweet");
    }
    res.status(200).json(new ApiResponse(200,createdTweet,"Tweet created successfully."))

});

export {createTweet}
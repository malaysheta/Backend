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

const getUserTweet = asyncHandler(async(req,res)=>{
    const user = req.user;
    if (!user) {
        throw new ApiError("user not found");
    }
    const tweetList = await Tweet.find({
        owner : user._id
    }).select(" -owner -_id -createdAt -updatedAt");

    if(!tweetList){
        throw new ApiError(400,"Users tweet not found");
    }

    res.status(200).json(new ApiResponse(200,tweetList,"Users twits are fetched successfully"));
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {oldTweet , newTweet} = req.body;

    if (!oldTweet && !newTweet) {
        throw new ApiError(400,"Old and new tweet are required")
    }

    const user = req.user;
    if (!user) {
        throw new ApiError(400,"Please logged in before updating the tweet");
    }
    const tweet = await Tweet.findOne({content : oldTweet});

    if(!tweet){
        throw new ApiError("oldtweet not found")
    }
    
    tweet.content = newTweet;

    const result = await tweet.save({ValidityState : false})

    if (!result) {
        throw new ApiError(500,"Internal server error , enable to update in database")
    }

    res.status(200).json(new ApiResponse(200,result,"tweet updated successfully."))
})

export {createTweet , getUserTweet , updateTweet}
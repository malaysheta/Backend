import mongoose from "mongoose"
import {Like} from "../models/like.model.js"
import ApiError from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    const user = req.user;
    
    if(!videoId){
        throw new ApiError(400,"Video id is required")
    }
    if(!user){
        throw new ApiError(401,"User should be logged in")
    }

    const isAlreadyLiked = await Like.findOne({video : videoId , likedBy : user._id});

    if(isAlreadyLiked){
        await Like.findOneAndDelete({video : videoId , likedBy : user._id});
        res.status(200).json(new ApiResponse(200,"Video like has been removed successfully"));
    }
    else{
        const like = await Like.create({
            video : videoId,
            likedBy : user._id,
        })
    
        res.status(200).json(new ApiResponse(200,like,"Video has been liked succesfully"))
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
     const user = req.user;
    
    if(!commentId){
        throw new ApiError(400,"comment id is required")
    }
    if(!user){
        throw new ApiError(401,"User should be logged in")
    }

    const isAlreadyLiked = await Like.findOne({comment : commentId , likedBy : user._id});

    if(isAlreadyLiked){
        await Like.findOneAndDelete({comment : commentId , likedBy : user._id});
        res.status(200).json(new ApiResponse(200,"comment like has been removed successfully"));
    }
    else{
        const like = await Like.create({
            comment : commentId,
            likedBy : user._id,
        })
    
        res.status(200).json(new ApiResponse(200,like,"comments has been liked succesfully"))
    }
           
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet

     const user = req.user;
    
    if(!tweetId){
        throw new ApiError(400,"tweet id is required")
    }
    if(!user){
        throw new ApiError(401,"User should be logged in")
    }

    const isAlreadyLiked = await Like.findOne({tweet : tweetId , likedBy : user._id});

    if(isAlreadyLiked){
        await Like.findOneAndDelete({tweet : tweetId , likedBy : user._id});
        res.status(200).json(new ApiResponse(200,"tweet like has been removed successfully"));
    }
    else{
        const like = await Like.create({
            tweet : tweetId,
            likedBy : user._id,
        })
        res.status(200).json(new ApiResponse(200,like,"tweet has been liked succesfully"))
    }
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const user = req.user
    if(!user){
        throw new ApiError(401,"Login required")
    }
    const likedVideos = await Like.find({
        likedBy: req.user._id,
        video: { $ne: null }   // only video likes
    }).populate("video");

    res.status(200).json(new ApiResponse(200,likedVideos,"All liked video fetched successfully"))
})

export { toggleVideoLike , toggleCommentLike , toggleTweetLike , getLikedVideos}
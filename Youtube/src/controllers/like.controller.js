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

export { toggleVideoLike }
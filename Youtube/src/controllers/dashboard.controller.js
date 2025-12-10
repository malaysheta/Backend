import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import ApiError from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const user = req.user;
    if(!user){
        throw new ApiError(401,"Login is required")
    }
    const allvideo = await Video.find({owner : user._id});
    res.status(200).json(new ApiResponse(200,allvideo,"All videos of channel is fetched successfully"))
})

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const user = req.user;
    //total subscriber ;
    const totalsub = (await Subscription.find({ channel : user._id })).length;
    const videos = await Video.find({owner : user._id});

    return res.status(200).json(new ApiResponse(200,{totalsub , videos},"Dashboard details feched successfully"));
})



export {
    getChannelStats, 
    getChannelVideos
    }   
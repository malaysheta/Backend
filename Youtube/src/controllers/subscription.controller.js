import { Subscription } from "../models/subscription.model.js"
import ApiError from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const user = req.user;

    if (!user) {
        throw new ApiError(401, "Login first");
    }

    if (!channelId) {
        throw new ApiError(400, "Channel is required");
    }

    if (user._id.equals(channelId)) {
        throw new ApiError(400, "You cannot subscribe to your own channel");
    }

    const existingSubscription = await Subscription.findOne({
        subscriber: user._id,
        channel: channelId,
    });

    // UNSUBSCRIBE
    if (existingSubscription) {
        await Subscription.findByIdAndDelete(existingSubscription._id);

        return res.status(200).json(
            new ApiResponse(
                200,
                null,
                "Successfully unsubscribed the channel."
            )
        );
    }

    const newSub = await Subscription.create({
        subscriber: user._id,
        channel: channelId,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            newSub,
            "Successfully subscribed to the channel."
        )
    );
});



// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const user = req.user

    if(!user){
        throw new ApiError(401,"Logged in first")
    }
    if(!channelId){
        throw  new ApiError(400,"channel is required")
    }

    if(!user._id.equals(channelId)){
        throw new ApiError(403,"Anothorized access , you dont have access of other subeciber list")
    }
    const subList = await Subscription.find({channel : channelId}).populate("subscriber", "username");;
    
    res.status(200).json(new ApiResponse(200,subList,"Subscripber list fetched successfully"))

})

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    const user = req.user

    if (!subscriberId) {
        throw new ApiError(400,"Subsciber id is required")
    }
    if (!user) {
        throw new ApiError(401,"Login First")
    }
    if(!user._id.equals(subscriberId)){
        throw new ApiError(403,"Anothorized access , you dont have access of other subeciber list")
    }

    const mySub = await Subscription.find({
        subscriber: req.user._id
        }).populate("channel", "username avatar");

    res.status(200).json(new ApiResponse(200,mySub,"My subsciber list fetched successfully"))

})

export { getUserChannelSubscribers , toggleSubscription , getSubscribedChannels }
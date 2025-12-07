import {asyncHandler} from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshToken = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.genrateAccessToken()
        const refreshToken = user.genrateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave : false})

        return {accessToken , refreshToken};

    } catch (error) {
        throw new ApiError(500,"Something went wrong while genrating refresh and access token.")
    }
}


const registerUser = asyncHandler(async (req,res)=>{

    // get user details from frontend or postMan
    // validate the details
    // check if user is already exist : username / email
    // check for images
    // check for avatar
    // upload them to claudinary , avatar
    //crate object user - create entry in db 
    // remove password and refresh token from the feild
    // check for user creation
    //return res

    const { username , email , password , fullName , } = req.body;
    console.log(email);
    console.log(password);
    

    // normal validataion
    // if (username === "") {
    //     throw new ApiError(400 , "UserName is Required");
    // }

    if ([username, email, password, fullName].some(field => !field || field.trim() === ""
    )) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or : [{ username } , { email }]
    })

    if(existedUser){
        throw new ApiError(409 , "User already exist")
    }

    // const avatarLocalPath = req.files?.avatar[0]?.path;
    const avatarLocalPath = req.files && req.files.avatar && req.files.avatar[0] ? req.files.avatar[0].path : null;
    const coverImageLocalPath = req.files && req.files.coverImage && req.files.coverImage[0] ? req.files.coverImage[0].path : null;

    if (avatarLocalPath == null) {
        throw new ApiError(409, "Avatar to joishe j baka")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(505, "Claudinary error ")
    }

    const user = await User.create({
        username : username,
        avatar : avatar.url,
        coverImage : coverImage? coverImage.url : "",
        email : email,
        password,
        fullName,

    })

    const CreatedUser = await User.findById(user._id).select( " -password -refreshToken");

    if(!CreatedUser){
        throw new ApiError(500, "Server is not working something went wrong while user registration!")
    }
    res.status(201).json(new ApiResponse(200,CreatedUser,"User registed successfully"))
})


const loginUser = asyncHandler(async (req,res)=>{
    // req body -> data
    // username or email 
    // find user 
    // password check 
    // access and refresh token
    //send cookie
    //api responce
    
    const {email , username ,password} = req.body;

    if(!email && !username){
        throw new ApiError(400,"User or email is required");
    }

    const user = await User.findOne({
        $or : [{username}, {email}]
    })

    if(!user){
        throw new ApiError(404, "User not exist")
    }

    const checkPass = await user.isPassCorrect(password);

    if(!checkPass) {
        throw new ApiError(400, "Password is incorrect.");
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select( " -password -refreshToken");

    const option = {
        httpOnly : true,
        secure : true,
    }

    res.status(200).cookie("accessToken",accessToken,option).cookie("refreshToken",refreshToken,option).json(new ApiResponse(200,{
        user:loggedInUser, accessToken ,refreshToken
    },"User loggin successfully"))
})


const logOutUser = asyncHandler(async(req,res)=>{
    const id =req.user._id;
    await User.findByIdAndUpdate(id,{
        $set:{
            refreshToken:undefined
        }
    },{
            new: true
    })

    const option = {
        httpOnly : true,
        secure : true,
    }

    res.status(200).clearCookie("accessToken",option)
    .clearCookie("refreshToken",option).json(new ApiResponse(200,{},"User Logged out "))

})


const refreshAccessToken = asyncHandler (async(req,res)=>{
    const currentrefreshToken =  await req.cookies.refreshToken;
    if(!currentrefreshToken){
        throw new ApiError(400,"Unothrized request")
    }

    try {
        const decodedToken =  jwt.verify(currentrefreshToken,process.env.REFRESH_TOKEN_SECRET);
    
        const user =await User.findById(decodedToken?._id)
        
        if(!user){
            throw new ApiError(400, "Unothrized refresh token")
        }
    
        if(currentrefreshToken !== user.refreshToken){
            throw new ApiError(401, "Refresg token is exprired")
        }
    
        const option = {
            httpOnly : true,
            secure : true,
        }
    
        const {accessToken , refreshToken}=await generateAccessAndRefreshToken(user._id);
    
        res.status(200).cookie("accessToken",accessToken,option).cookie("refreshToken",refreshToken,option).json(new ApiResponse(200,{
            user:accessToken ,refreshToken
        },"Access token refreshed"))
    } catch (error) {
        throw new ApiError(400,error)
    }
})


const changeUserPassword = asyncHandler(async (req,res)=>{
    
    const {oldPassword , newPassword} = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(400,"User not availble")
    }

    const  isPasscorr =await user.isPassCorrect(oldPassword);
    if(!isPasscorr){
        throw new ApiError(400,"Incorrect Password")
    }

    user.password = newPassword;
    await user.save({validateBeforeSave : false})

    res.status(200).json(new ApiResponse(200,"Password change successfully."))
})


const getCurrentUser = asyncHandler(async(req,res)=>{
    const currUser  = req.user;
    if (!currUser) {
        throw new ApiError(400,"Please log in")
    }
    res.status(200).json(new ApiResponse(200,currUser,"current User fetch succesfully"));
})


const updateAvatar = asyncHandler(async(req,res)=>{
    const AvatarLocalPath = req.file?.path;
    if (!AvatarLocalPath) {
        throw new ApiError(400,"Avatar file is missing")
    }

    const cloudinary = await uploadOnCloudinary(AvatarLocalPath)
    if (!cloudinary) {
        throw new ApiError(500,"Enable to Avatar store in server")
    }

    const user = await User.findByIdAndUpdate(req.user._id,{
        $set:{
            avatar:cloudinary.url
        }
    },{new:true}).select( " -password");

    res.status(200).json(new ApiResponse(200,user,"Avatar img is change successfully"))

})


const getUserChannelProfile = asyncHandler(async(req,res)=>{
    const username = req.params.username?.trim();
    console.log("Username param =>", username);
    
    if (!username?.trim()) {
        throw new ApiError(400,"Username required")
    }

    const channel = await User.aggregate([
        {
            $match :{
                username : username
            }
        },
        {
            $lookup :{
                from : "subscriptions",
                localField : "_id",
                foreignField : "channel",
                as : "subscribers"
            }
        },
        {
             $lookup :{
                from : "subscriptions",
                localField : "_id",
                foreignField : "subscriber",
                as : "subscriberedTo"
            }
        },
        {
            $addFields : {
                subscriberCount : {
                    $size : "$subscribers",
                },
                ChannelSubscribeToCount : {
                    $size : "$subscriberedTo",
                },
                isSubscribed : {
                    $cond : {
                        if : {$in : [req.user._id , "$subscribers.subscriber"]},
                        then : true,
                        else : false
                    }
                }
            }
        },
        {
            $project : {
                fullName : 1,
                username : 1,
                subscriberCount : 1,
                ChannelSubscribeToCount : 1,
                isSubscribed : 1,
                avatar : 1,
                coverImage : 1,
                email : 1,
            }
        }
    ])

    if (!channel?.length) {
        throw new ApiError(404 , "Channel does not exists")
    }

    return res.status(200).json(new ApiResponse(200,channel[0],"User channel fetched successfully"))
})


export {registerUser , loginUser , logOutUser , refreshAccessToken, changeUserPassword , getCurrentUser , updateAvatar , getUserChannelProfile}
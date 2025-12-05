import {asyncHandler} from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

    const existedUser = User.find({
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
    const coverImage = await uploadOnCloudinary(avatarLocalPath);

    if(!avatar){
        throw new ApiError(409, "Avatar to joishe j baka")
    }

    const user = await User.create({
        username : username,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
        email : email,
        password,
        fullName,

    })

    const CreatedUser = await User.findById(user._id).select( " -password -refreshToken");

    if(!CreatedUser){
        throw new ApiError(500, "Server is not working something went wrong while user registration!")
    }
    res.status(201).json(ApiResponse(200,CreatedUser,"User registed successfully"))
})

export default registerUser
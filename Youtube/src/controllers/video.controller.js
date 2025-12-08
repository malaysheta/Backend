
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video} from "../models/video.model.js"

const publishAVideo = asyncHandler(async (req, res) => {
    //take title ans desciption of video
    //validate them
    //check user login
    //store video and thumbnail in local using multer
    //check the local path
    //store in cloudinary
    //check cloudinary path
    //create object of video and store the details
    //check the database entry
    //responce


    const { title, description} = req.body
    if (!title || !description) {
        throw new ApiError(402,"Title and description are required.")
    }

    const user = req.user;
    if(!user){
        throw new ApiError(402,"Anothorized user.")
    }

    const videoFileLocalPath = req.files && req.files.videoFile && req.files.videoFile[0] ? req.files.videoFile[0].path : null;
    const thumbnailLocalPath = req.files && req.files.thumbnail && req.files.thumbnail[0] ? req.files.thumbnail[0].path : null;

    if(!videoFileLocalPath){
        throw new ApiError(401,"video is required");
    }
    if(!thumbnailLocalPath){
        throw new ApiError(401,"Thumbnail is required");
    }

    const videoFile = await uploadOnCloudinary(videoFileLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if(!videoFile || !thumbnail){
        throw new ApiError(500,'Internal server error. Unable to store in cloudinary')
    }

    const videoObject = await Video.create({
        videoFile : videoFile.url ,
        thumbnail : thumbnail.url,
        title,
        description,
        time : videoFile.duration,
        views : 0,
        isPublished : true,
        owner : user._id,
    })

    if (!videoObject) {
        throw new ApiError(500,"Internal server error. Unable to upload video details in db")
    }
    res.status(200).json(new ApiResponse(200,videoObject,"Video stored successfully"))

    // TODO: get video, upload to cloudinary, create video

})

const getAllVideos = asyncHandler(async (req, res) => {
    //TODO: get all videos based on query, sort, pagination
    const {
        page = 1,
        limit = 2,
        query,
        sortBy = "createdAt",
        sortType = -1,
    } = req.query;
    
    const pageNum = Math.max(1 , Number(page));
    const limitNum = Math.max(1,Number(limit));
    const skip = (pageNum -1) * limitNum; 

    // creating sort object for sortby and sorttype combination  
    //sortType -1 = descending order and 1 for assending order

    const sortObj = {};
    sortObj[sortBy] = Number(sortType);
    
    const videoList = await Video.find({
        $or : [
            {
                title : query,
            },
            {
                description : query,
            },
        ]
    }).skip(skip).limit(limitNum).sort(sortObj).select(" -updatedAt -isPublished -__v ");

    if(!videoList){
        throw new ApiError(401,"Query releted video not found")
    }
    
    res.status(200).json(new ApiResponse(200,videoList,`pageNumber : ${page} , limit : ${limitNum}`));
})


export { publishAVideo , getAllVideos}
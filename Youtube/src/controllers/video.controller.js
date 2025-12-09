
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video} from "../models/video.model.js"
import { extractPublicIdFromUrl } from "../utils/extractPublicIdFromUrl.js"
import cloudinary from "cloudinary"

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
    }).skip(skip).limit(limitNum).sort(sortObj).populate("owner", "username").select(" -updatedAt -__v ");

    if(!videoList){
        throw new ApiError(401,"Query releted video not found")
    }
    
    res.status(200).json(new ApiResponse(200,videoList,`pageNumber : ${page} , limit : ${limitNum}`));
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId , title , description } = req.query
    //TODO: update video details like title, description, thumbnail
    if(!videoId) {
        throw new ApiError(400,"Video id not found");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(401,"Video not found in db")
    }

    if(title){
        video.title = title;
    }

    if(description){
        video.description = description
    }

    const videoObj = await video.save({ValidityState : false});

    if(!videoObj){
        throw new ApiError(500,"Unable to update the details")
    }

    res.status(200).json(new ApiResponse(200,videoObj,"Details are updated successfully"))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.query
    //TODO: delete video
    if(!videoId){
        throw new ApiError(400,"Video id not found")
    }
    const video =  await Video.findById(videoId);

    if(!video){
        throw new ApiError(400,"Video is not in db")
    }
    
    const cluodinary_public_id = extractPublicIdFromUrl(video.videoFile);

    if(!cluodinary_public_id){
        throw new ApiError(400,"Mongo Url not found")
    }
    await cloudinary.uploader.destroy(cluodinary_public_id);
    await Video.findByIdAndDelete(videoId);

    res.status(200).json(new ApiResponse(200,"Video deleted successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.query
    if(!videoId) {
        throw new ApiError(400,"Video id not found");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(401,"Video not found in db")
    }

    video.isPublished = !video.isPublished

    const videoObj = await video.save({ValidityState : false});

    if(!videoObj){
        throw new ApiError(500,"Unable to update the details")
    }

    res.status(200).json(new ApiResponse(200,videoObj,"Details are updated successfully"))
})


export { publishAVideo , getAllVideos , updateVideo , deleteVideo , togglePublishStatus}
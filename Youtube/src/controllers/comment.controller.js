import ApiError from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Comment } from "../models/comment.model.js"

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId , content } = req.query
    if(!videoId){
        throw new ApiError(401,"Videoid is required")
    }
    if(!content){
        throw new ApiError(401,"comments content should not be empty")
    }

    const user = req.user

    if(!user._id){
        throw new ApiError(403,'User id not found')
    }

    const commentObj = await Comment.create({
        content,
        video : videoId,
        owner : user._id,
    })

    if(!commentObj){
        throw new ApiError(500,"Internal server error , enable to store your comment")
    }
    res.status(200).json(new ApiResponse(200,commentObj,"Comment uploaded sunccessfully"))

})

export { addComment }
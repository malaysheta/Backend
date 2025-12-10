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

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if(!videoId){
        throw new ApiError(401,"Videoid is required")
    }

    let pageNum = Math.max(1,Number(page));
    let limitNum = Math.max(1,Number(limit));

    const skip = (pageNum - 1)* limitNum;

    const getallcomments = await Comment.find({video : videoId}).sort({createdAt : -1}).skip(skip).limit(limitNum).populate("owner", "username").select(" -createdAt -updatedAt -video");

    if(!getallcomments){
        throw  new ApiError(401,"No comments found in this video")
    }
    res.status(200).json(new ApiResponse(200,getallcomments,`Comments fetched successfully page : ${pageNum} limit : ${limitNum}`))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params;
    const { newComment } = req.query;
    
    if (!commentId) {
        throw new ApiError(401,"Comment id is required")
    }
    if (!newComment) {
        throw new ApiError(401,"new commenst should not be empty")
    }

    const user = req.user
    const comment = await Comment.findById(commentId);
    if(!comment){
        throw new ApiError(401,'No comment found')
    }

    if (comment.owner.toString() !== user._id.toString()) {
        throw new ApiError(403,"You are not authorized to update this comment")
    }
    comment.content = newComment;
    await comment.save({ValidityState : false});

    res.status(200).json(new ApiResponse(200,comment,"Comment updated successfully"))
})


const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params;
    if (!commentId) {
        throw new ApiError(401,"Comment id is required")
    }

    const user = req.user
    const comment = await Comment.findById(commentId);
    if(!comment){
        throw new ApiError(401,'No comment found')
    }

    if (comment.owner.toString() !== user._id.toString()) {
        throw new ApiError(403,"You are not authorized to update this comment")
    }

    await Comment.findByIdAndDelete(commentId);

    res.status(200).json(new ApiResponse(200,"Comment deleted successfully"))

})

export { addComment , getVideoComments , updateComment , deleteComment }
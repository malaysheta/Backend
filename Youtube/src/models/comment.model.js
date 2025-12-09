import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content : {
        type : String,
        required : true,
    },
    video : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Video"
    },
    owner : {
        type : mongoose.Schema.types.ObjectId,
        ref : "User"
    }
},{timestamps : true});

export const Comment = new mongoose.model("Comment",commentSchema);
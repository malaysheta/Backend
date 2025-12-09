import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const VideoSchema = new mongoose.Schema({
    videoFile : {
        type : String, //claudinary
        required : true,
    },
    thumbnail : {
        type : String,
        required : true,
    },
    title : {
        type : String,
        required : true,
        trim : true,
    },
    description : {
        type : String,
        required : true,
        trim : true,
    },
    time : {
        type : Number,
        required : true,
    },
    views:{
        type : Number,
        default : 0,
    },
    isPublished : {
        type : Boolean,
        default : true,
    },
    owner : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

},{
    timestamps : true,
});

VideoSchema.plugin(mongooseAggregatePaginate)


export  const Video = mongoose.model("Video" , VideoSchema);
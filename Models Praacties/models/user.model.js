import mongoose from "mongoose";

const UserModel = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : [true, "Email must be in lowercase"],
    },
    password:{
        type : String,
        required: true,
    }
},{timestamps : true})

export const User = mongoose.model("User",UserModel);

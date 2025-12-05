import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const UserSchema = new mongoose.Schema({
    username : {
        type : String,
        unique : true,
        required : true,
        lowercase : true,
        trim : true,
        index : true,
    },
    email : {
        type : String,
        unique : true,
        required : true,
        lowercase : true,
        trim : true,
    },
    fullName : {
        type : String,
        required : true,
        lowercase : true,
        trim : true,
        index : true,
    },
    avatar : {
        type : String, // cloudinary
        required : true,
    },
    coverImage : {
        type : String,
    },
    watchHistory:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Video",
        }
    ],
    password : {
        type : String,
        required : [true, "Password is required"],

    },
    refreshToken:{
        type : String,
    },
},{timestamps : true});

UserSchema.pre("save",  async function (next){
    if(!this.isModified("password")) return next();
    this.password =  await bcrypt.hash(this.password , 10)
    next()
})

UserSchema.methods.isPassCorrect = async function (password) {
    return  await bcrypt.compare(password,this.password);
}

UserSchema.methods.genrateAccessToken = function(){
    jwt.sign(
        {
            _id : this._id,
            username : this.username,
            email:this.email,
            fullName:this.fullName, 
        },process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES
        }
    )
}

UserSchema.methods.genrateRefreshToken = function(){
    jwt.sign(
        {
            _id : this._id,
        },process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES
        }
    )
}


export const User = mongoose.model("User",UserSchema);


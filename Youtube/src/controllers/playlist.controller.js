import { asyncHandler } from '../utils/asyncHandler.js'
import  ApiError  from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { Playlist } from '../models/playlist.model.js'

const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description=""} = req.body

    if(!name){
        throw new ApiError(401,"Playlist name is required")
    }
    
    const user = req.user
    if (!user) {
        throw new ApiError(403,"UnAthorized access , User is not logged in")
    }    
    const playlist = await Playlist.create({
        name,
        description : description,
        videos : [],
        owner : user._id
    })
    if(!playlist){
        throw new ApiError(500,"Internal server error , unable to create new playlist")
    }

    res.status(200).json(new ApiResponse(200,playlist,"Playlist created successfully"));
    //TODO: create playlist
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new ApiError(403,"Anothorized access , please login first")
    }
    
    const playlists = await Playlist.find({owner : user._id});

    if(!playlists){
        throw new ApiError(401,"No playlist found")
    }

    return res.status(200).json(new ApiResponse(200,playlists,"User playlist fetched successfully"))

    //TODO: get user playlists
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params

    if(!playlistId){
        throw new ApiError(401,"PlaylistId is required")
    }
    //TODO: get playlist by id
    const playlists = await Playlist.findById(playlistId);

    if(!playlists){
        throw new ApiError(401,"No playlist found wit given playlist Id")
    }

    return res.status(200).json(new ApiResponse(200,playlists,"playlist fetched successfully"))
})



export { createPlaylist , getUserPlaylists , getPlaylistById}
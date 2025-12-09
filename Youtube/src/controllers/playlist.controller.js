import { asyncHandler } from '../utils/asyncHandler.js'
import  ApiError  from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { Playlist } from '../models/playlist.model.js'
import { Video } from '../models/video.model.js'

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

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.query
     
    if(!playlistId || !videoId){
        throw new ApiError(401,"playlist id  and video id are required")
    }
    const user = req.user
    if (!user) {
        throw new ApiError(403,"unathorized access login first")
    }

    const playlist = await Playlist.findById(playlistId);

    if(!playlist){
        throw new ApiError(401,"Playlist not found")
    }

    if(playlist.owner.toString() != user._id.toString()){
        throw new ApiError(403, "Anathorized access , you can not edits others playlist")
    }

    const video =await Video.findById(videoId);
    
    if(!video){
        throw new ApiError(401,"Video not found")
    }

    if (playlist.videos.includes(videoId)) {
        throw new ApiError(409, "Video already exists in playlist");
    }

    playlist.videos.push(videoId);
    await playlist.save();

    res.status(200).json(
        new ApiResponse(200, playlist, "Video added to playlist successfully")
    );
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.query
    // TODO: remove video from playlist
    if(!playlistId || !videoId){
        throw new ApiError(401,"playlist id  and video id are required")
    }
    const user = req.user
    if (!user) {
        throw new ApiError(403,"unathorized access login first")
    }

    const playlist = await Playlist.findById(playlistId);

    if(!playlist){
        throw new ApiError(401,"Playlist not found")
    }

    if(playlist.owner.toString() != user._id.toString()){
        throw new ApiError(403, "Anathorized access , you can not edits others playlist")
    }

    const video =await Video.findById(videoId);
    
    if(!video){
        throw new ApiError(401,"Video not found")
    }
    if (!playlist.videos.includes(videoId)) {
        throw new ApiError(409, "Video not exists in playlist");
    }
    
    playlist.videos.remove(videoId);
    await playlist.save();

    res.status(200).json(
        new ApiResponse(200, playlist, "Video deleted to playlist successfully")
    );

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(!playlistId){
        throw new ApiError(400,"playlist id is required")
    }
    const user = req.user
    if (!user) {
        throw new ApiError(401,"unathorized access login first")
    }

    const playlist = await Playlist.findById(playlistId);

    if(!playlist){
        throw new ApiError(404,"Playlist not found")
    }

    if(playlist.owner.toString() != user._id.toString()){
        throw new ApiError(403, "Anathorized access , you can not delete others playlist")
    }
    
    await playlist.deleteOne();

    res.status(200).json(new ApiResponse(200,"Playlist deleted successfully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body

    if(!playlistId){
        throw new  ApiError(400,"Playlist id is required")
    }
    if(!name && !description){
        throw new ApiError(400,"name or description is required")
    }

    const playlist = await Playlist.findById(playlistId);
    if(!playlist){
        throw new ApiError(400,"playlist not found")
    }
    const user = req.user;


    if(playlist.owner.toString() !== user._id.toString()){
        throw new ApiError(403,"You are not Aothorized user , tou can not edit otheres playlist")
    }

    if(name) playlist.name = name
    if(description) playlist.description = description

    const updatedPlaylist = await playlist.save();
    if(!updatedPlaylist){
        throw new ApiError(500, "internal server error , Enable to update the details")
    }

    res.status(200).json(new ApiResponse(200,updatedPlaylist,"details updated sunccessfull"));
    //TODO: update playlist
})

export { createPlaylist , getUserPlaylists , getPlaylistById , addVideoToPlaylist , removeVideoFromPlaylist , deletePlaylist , updatePlaylist}
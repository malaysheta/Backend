import { Router } from "express";
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { createPlaylist , getUserPlaylists , getPlaylistById} from "../controllers/playlist.controller.js";

const router = Router()

router.route('/create-playlist').post(verifyJWT , createPlaylist)
router.route('/get-playlist').get(verifyJWT , getUserPlaylists)
router.route('/get-playlistbyid/:playlistId').get(getPlaylistById)


export default router;
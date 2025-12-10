import { Router } from "express";
import { verifyJWT} from '../middlewares/auth.middleware.js'
import { toggleVideoLike } from "../controllers/like.controller.js";
const router = Router()

router.route('/toggel-video-like/:videoId').post(verifyJWT , toggleVideoLike )

export default router;
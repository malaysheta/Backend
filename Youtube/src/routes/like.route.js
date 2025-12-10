import { Router } from "express";
import { verifyJWT} from '../middlewares/auth.middleware.js'
import { toggleCommentLike, toggleVideoLike } from "../controllers/like.controller.js";
const router = Router()

router.route('/toggel-video-like/:videoId').post(verifyJWT , toggleVideoLike )
router.route('/toggel-comment-like/:commentId').post(verifyJWT, toggleCommentLike)

export default router;
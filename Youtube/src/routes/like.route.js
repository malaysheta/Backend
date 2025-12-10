import { Router } from "express";
import { verifyJWT} from '../middlewares/auth.middleware.js'
import { toggleCommentLike, toggleVideoLike , toggleTweetLike , getLikedVideos} from "../controllers/like.controller.js";
const router = Router()

router.route('/toggel-video-like/:videoId').post(verifyJWT , toggleVideoLike )
router.route('/toggel-comment-like/:commentId').post(verifyJWT, toggleCommentLike)
router.route('/toggel-tweet-like/:tweetId').post(verifyJWT, toggleTweetLike)
router.route('/get-liked-video').get(verifyJWT,getLikedVideos)

export default router;
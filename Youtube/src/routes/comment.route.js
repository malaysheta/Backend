import { Router } from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { addComment , getVideoComments } from '../controllers/comment.controller.js'

const router = Router();

router.route('/add-comment').post(verifyJWT,addComment);
router.route('/get-video-comment/:videoId').get(getVideoComments)
export default router;
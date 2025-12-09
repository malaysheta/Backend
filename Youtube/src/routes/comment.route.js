import { Router } from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { addComment , deleteComment, getVideoComments, updateComment } from '../controllers/comment.controller.js'

const router = Router();

router.route('/add-comment').post(verifyJWT,addComment);
router.route('/get-video-comment/:videoId').get(getVideoComments)
router.route('/update-comment/:commentId').post(verifyJWT, updateComment)
router.route('/delete-comment/:commentId').post(verifyJWT, deleteComment)

export default router;
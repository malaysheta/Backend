import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { publishAVideo , getAllVideos , updateVideo , deleteVideo , togglePublishStatus} from "../controllers/video.controller.js"

const router = Router();

router.route('/publish-video').post(verifyJWT , upload.fields([
    {
        name : "videoFile",
        maxCount : 1,
    },
    {
        name : "thumbnail",
        maxCount : 1
    }
]),publishAVideo)

router.route('/getall-video').get(getAllVideos);
router.route('/update-video').post(verifyJWT,updateVideo);
router.route('/video-delete').post(verifyJWT,deleteVideo)
router.route('/toggle-visibility').post(verifyJWT,togglePublishStatus)

export default router;
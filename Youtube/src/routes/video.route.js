import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { publishAVideo , getAllVideos , updateVideo } from "../controllers/video.controller.js"

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

export default router;
import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { publishAVideo , getAllVideos } from "../controllers/video.controller.js"

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

export default router;
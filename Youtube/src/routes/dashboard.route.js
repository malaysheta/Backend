import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getChannelVideos , getChannelStats} from "../controllers/dashboard.controller.js";

const router = Router();

router.route('/myvideo').get(verifyJWT , getChannelVideos)
router.route('/channel-stats').get(verifyJWT,getChannelStats);
export default router;
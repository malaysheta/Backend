import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTweet , getUserTweet , updateTweet , deleteTweet} from "../controllers/tweet.controller.js";

const router = Router();

router.route('/create-tweet').post(verifyJWT,createTweet);
router.route('/get-tweet').get(verifyJWT,getUserTweet);
router.route('/update-tweet').post(verifyJWT,updateTweet);
router.route('/delete-tweet').post(verifyJWT,deleteTweet);

export default router;
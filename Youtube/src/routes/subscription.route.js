import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleSubscription , getUserChannelSubscribers , getSubscribedChannels} from "../controllers/subscription.controller.js";

const router = Router()

router.route('/toggel/:channelId').post(verifyJWT,toggleSubscription)
router.route('/getsubsciberlist/:channelId').get(verifyJWT,getUserChannelSubscribers)
router.route('/getsubscibedchannel/:subscriberId').get(verifyJWT,getSubscribedChannels)

export default router;
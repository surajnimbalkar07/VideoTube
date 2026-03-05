import { Router } from 'express';
import {
    getChannelStats,
    getChannelVideos,
    getChannelAnalytics
} from "../controllers/dashboard.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/stats").get(getChannelStats);
router.route("/videos").get(getChannelVideos);
router.route("/analytics").get(getChannelAnalytics);
export default router
import { Router } from "express";
import { 
  createContent,
  getContentInsights,
  generateMindMap,
  getContentRecommendations
} from "../controllers/content.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create").post(verifyJWT, createContent);
router.route("/insights/:contentId").get(verifyJWT, getContentInsights);
router.route("/mindmap/:userId").get(verifyJWT, generateMindMap);
router.route("/recommendations").get(verifyJWT, getContentRecommendations);

export default router;
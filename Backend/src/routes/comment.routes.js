import { Router } from "express";
import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
  toggleCommentLike,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/:videoId", verifyJWT, getVideoComments);
router.post("/:videoId", verifyJWT, addComment);
router.delete("/c/:commentId", verifyJWT, deleteComment);
router.patch("/c/:commentId", verifyJWT, updateComment);
router.post("/likes/:commentId", verifyJWT, toggleCommentLike);

export default router;
import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get comments for a video with sorting and likes info
const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10, sort = "newest" } = req.query;
  const userId = req.user?._id;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  // Determine sort stage
  let sortStage = { createdAt: -1 }; // newest default
  if (sort === "oldest") sortStage = { createdAt: 1 };

  // Aggregate pipeline
  const aggregate = Comment.aggregate([
    { $match: { video: new mongoose.Types.ObjectId(videoId) } },

    // Lookup likes
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "comment",
        as: "likes"
      }
    },

    // Add likesCount and check if current user liked
    {
      $addFields: {
        likesCount: { $size: "$likes" },
        isLiked: userId
          ? { $in: [new mongoose.Types.ObjectId(userId), "$likes.likedBy"] }
          : false
      }
    },

    // Lookup owner info
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [{ $project: { fullname: 1, username: 1, avatar: 1 } }]
      }
    },
    { $addFields: { owner: { $first: "$owner" } } },

    // Sort dynamically
    { $sort: sort === "mostLiked" ? { likesCount: -1 } : sortStage }
  ]);

  const options = {
    page: parseInt(page),
    limit: parseInt(limit)
  };

  const comments = await Comment.aggregatePaginate(aggregate, options);

  return res.status(200).json(
    new ApiResponse(200, comments, "Comments fetched successfully")
  );
});

// Add a comment
const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;

  if (!content) throw new ApiError(400, "Content is required");

  const comment = await Comment.create({
    content,
    video: videoId,
    owner: req.user._id
  });

  return res.status(201).json(
    new ApiResponse(201, comment, "Comment added successfully")
  );
});

// Update a comment
const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  const comment = await Comment.findById(commentId);
  if (!comment) throw new ApiError(404, "Comment not found");
  if (comment.owner.toString() !== req.user._id.toString())
    throw new ApiError(403, "Unauthorized");

  comment.content = content;
  await comment.save();

  return res.status(200).json(new ApiResponse(200, comment, "Comment updated"));
});

// Delete a comment
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);
  if (!comment) throw new ApiError(404, "Comment not found");
  if (comment.owner.toString() !== req.user._id.toString())
    throw new ApiError(403, "Unauthorized");

  await comment.deleteOne();

  return res.status(200).json(new ApiResponse(200, {}, "Comment deleted"));
});

// Toggle like/unlike on a comment
const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(commentId))
    throw new ApiError(400, "Invalid comment ID");

  const existing = await Like.findOne({ comment: commentId, likedBy: userId });

  if (existing) {
    await existing.deleteOne();
    return res.status(200).json(new ApiResponse(200, {}, "Unliked"));
  }

  await Like.create({ comment: commentId, likedBy: userId });
  return res.status(200).json(new ApiResponse(200, {}, "Liked"));
});

export {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
  toggleCommentLike
};
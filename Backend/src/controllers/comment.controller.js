import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const aggregate = Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            fullname: 1,
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: { $first: "$owner" }
            }
        },
        { $sort: { createdAt: -1 } }
    ])

    const options = {
        page: parseInt(page),
        limit: parseInt(limit)
    }

    const comments = await Comment.aggregatePaginate(aggregate, options)

    return res.status(200).json(
        new ApiResponse(200, comments, "Comments fetched successfully")
    )
})

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { content } = req.body

    if (!content) throw new ApiError(400, "Content is required")

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    })

    return res.status(201).json(
        new ApiResponse(201, comment, "Comment added successfully")
    )
})

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const { content } = req.body

    const comment = await Comment.findById(commentId)

    if (!comment) throw new ApiError(404, "Comment not found")
    if (comment.owner.toString() !== req.user._id.toString())
        throw new ApiError(403, "Unauthorized")

    comment.content = content
    await comment.save()

    return res.status(200).json(
        new ApiResponse(200, comment, "Comment updated")
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    const comment = await Comment.findById(commentId)

    if (!comment) throw new ApiError(404, "Comment not found")
    if (comment.owner.toString() !== req.user._id.toString())
        throw new ApiError(403, "Unauthorized")

    await comment.deleteOne()

    return res.status(200).json(
        new ApiResponse(200, {}, "Comment deleted")
    )
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
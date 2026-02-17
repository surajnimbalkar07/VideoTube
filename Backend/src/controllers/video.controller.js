import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


// ===============================
// GET ALL VIDEOS
// ===============================
const getAllVideos = asyncHandler(async (req, res) => {

    const { page = 1, limit = 10, search = "" } = req.query

    const matchStage = { isPublish: true }

    if (search) {
        matchStage.title = { $regex: search, $options: "i" }
    }

    const aggregate = Video.aggregate([
        { $match: matchStage },

        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        { $unwind: "$owner" },

        {
            $project: {
                title: 1,
                description: 1,
                thumbnail: 1,
                views: 1,
                createdAt: 1,
                "owner.username": 1,
                "owner.avatar": 1
            }
        },

        { $sort: { createdAt: -1 } }
    ])

    const options = {
        page: parseInt(page),
        limit: parseInt(limit)
    }

    const videos = await Video.aggregatePaginate(aggregate, options)

    return res.status(200).json(
        new ApiResponse(200, videos, "Videos fetched successfully")
    )
})


// ===============================
// PUBLISH VIDEO
// ===============================
const publishVideo = asyncHandler(async (req, res) => {

    const { title, description } = req.body

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required")
    }

    const videoFile = req.files?.videoFile?.[0]
    const thumbnailFile = req.files?.thumbnail?.[0]

    if (!videoFile || !thumbnailFile) {
        throw new ApiError(400, "Video file and thumbnail are required")
    }

    // Upload to Cloudinary
    const uploadedVideo = await uploadOnCloudinary(videoFile.path)
    const uploadedThumbnail = await uploadOnCloudinary(thumbnailFile.path)

    if (!uploadedVideo?.url || !uploadedThumbnail?.url) {
        throw new ApiError(500, "Failed to upload media files")
    }

    const video = await Video.create({
        title,
        description,
        videoFile: uploadedVideo.url,
        thumbnail: uploadedThumbnail.url,
        duration: 0,
        owner: req.user._id,
        isPublish: false
    })

    return res.status(201).json(
        new ApiResponse(201, video, "Video published successfully")
    )
})


// ===============================
// GET VIDEO BY ID
// ===============================
const getVideoById = asyncHandler(async (req, res) => {

    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    const userId = req.user?._id

    // If user is logged in
    if (userId) {

        const alreadyViewed = video.viewedBy.some(
            (id) => id.toString() === userId.toString()
        )

        if (!alreadyViewed) {
            video.views += 1
            video.viewedBy.push(userId)
            await video.save()
        }

    } else {
        // Guest user → count view normally
        video.views += 1
        await video.save()
    }

    await video.populate("owner", "username avatar")

    return res.status(200).json(
        new ApiResponse(200, video, "Video fetched successfully")
    )
})



// ===============================
// UPDATE VIDEO
// ===============================
const updateVideo = asyncHandler(async (req, res) => {

    const { videoId } = req.params
    const { title, description } = req.body

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized to update this video")
    }

    if (title) video.title = title
    if (description) video.description = description

    const thumbnailFile = req.file

    if (thumbnailFile) {
        const uploadedThumbnail = await uploadOnCloudinary(thumbnailFile.path)

        if (!uploadedThumbnail?.url) {
            throw new ApiError(500, "Failed to upload thumbnail")
        }

        video.thumbnail = uploadedThumbnail.url
    }

    await video.save()

    return res.status(200).json(
        new ApiResponse(200, video, "Video updated successfully")
    )
})


// ===============================
// DELETE VIDEO
// ===============================
const deleteVideo = asyncHandler(async (req, res) => {

    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized")
    }

    await video.deleteOne()

    return res.status(200).json(
        new ApiResponse(200, {}, "Video deleted successfully")
    )
})


// ===============================
// TOGGLE PUBLISH STATUS
// ===============================
const togglePublishStatus = asyncHandler(async (req, res) => {

    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized")
    }

    video.isPublish = !video.isPublish
    await video.save()

    return res.status(200).json(
        new ApiResponse(200, video, "Publish status updated")
    )
})


// ===============================
// EXPORTS (ONLY HERE — NO DUPLICATE EXPORTS ABOVE)
// ===============================
export {
    getAllVideos,
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}

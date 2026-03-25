import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { Like } from "../models/like.model.js"
import { Subscription } from "../models/subscription.model.js"

// 🔥 Elasticsearch
import { Client } from "@elastic/elasticsearch"

const esClient = new Client({
  node: "http://127.0.0.1:9200",
})

const INDEX = "videos"

// ===============================
// ✅ SAFE INDEX CREATION (RUN ONCE)
// ===============================
let isIndexReady = false

const ensureIndex = async () => {
  if (isIndexReady) return

  try {
    const exists = await esClient.indices.exists({ index: INDEX })

    if (!exists) {
      await esClient.indices.create({
        index: INDEX,
        mappings: {
          properties: {
            title: { type: "text" },
            description: { type: "text" },
            isPublish: { type: "boolean" },
            createdAt: { type: "date" },
          },
        },
      })
      console.log("✅ ES index created")
    }

    isIndexReady = true
  } catch (err) {
    console.log("⚠️ ES not ready")
  }
}

// ===============================
// GET ALL VIDEOS
// ===============================
const getAllVideos = asyncHandler(async (req, res) => {
  await ensureIndex()

  const { page = 1, limit = 8, search = "" } = req.query
  const matchStage = { isPublish: true }

  if (search && search.trim() !== "") {
    try {
      const result = await esClient.search({
        index: INDEX,
        query: {
          multi_match: {
            query: search,
            fields: ["title^2", "description"],
            fuzziness: "AUTO",
          },
        },
      })

      const ids = result.hits.hits.map((hit) => hit._id)

      if (ids.length === 0) {
        return res.status(200).json(
          new ApiResponse(200, { docs: [], totalDocs: 0 }, "No videos found")
        )
      }

      matchStage._id = {
        $in: ids.map((id) => new mongoose.Types.ObjectId(id)),
      }

    } catch (error) {
      console.log("⚠️ ES failed → fallback MongoDB")
      matchStage.title = { $regex: search, $options: "i" }
    }
  }

  const aggregate = Video.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
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
        "owner.avatar": 1,
      },
    },
    { $sort: { createdAt: -1 } },
  ])

  const videos = await Video.aggregatePaginate(aggregate, {
    page: parseInt(page),
    limit: parseInt(limit),
  })

  return res.status(200).json(
    new ApiResponse(200, videos, "Videos fetched successfully")
  )
})

// ===============================
// PUBLISH VIDEO
// ===============================
const publishVideo = asyncHandler(async (req, res) => {
  await ensureIndex()

  const { title, description } = req.body

  if (!title || !description) {
    throw new ApiError(400, "Title and description are required")
  }

  const videoFile = req.files?.videoFile?.[0]
  const thumbnailFile = req.files?.thumbnail?.[0]

  if (!videoFile || !thumbnailFile) {
    throw new ApiError(400, "Video + thumbnail required")
  }

  const uploadedVideo = await uploadOnCloudinary(videoFile.path)
  const uploadedThumbnail = await uploadOnCloudinary(thumbnailFile.path)

  const video = await Video.create({
    title,
    description,
    videoFile: uploadedVideo.url,
    thumbnail: uploadedThumbnail.url,
    duration: 0,
    owner: req.user._id,
    isPublish: false,
  })

  try {
    await esClient.index({
      index: INDEX,
      id: video._id.toString(),
      document: {
        title: video.title,
        description: video.description,
        isPublish: video.isPublish,
        createdAt: video.createdAt,
      },
    })

    await esClient.indices.refresh({ index: INDEX }) 

  } catch {
    console.log("⚠️ ES indexing failed")
  }

  return res.status(201).json(
    new ApiResponse(201, video, "Video published successfully")
  )
})

// ===============================
// GET VIDEO BY ID (UNCHANGED)
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

  return res.status(200).json(
    new ApiResponse(200, video, "Video fetched successfully")
  )
})

// ===============================
// UPDATE VIDEO
// ===============================
const updateVideo = asyncHandler(async (req, res) => {
  await ensureIndex()

  const { videoId } = req.params
  const { title, description } = req.body

  const video = await Video.findById(videoId)

  if (!video) throw new ApiError(404, "Video not found")

  if (title) video.title = title
  if (description) video.description = description

  await video.save()

  try {
    await esClient.update({
      index: INDEX,
      id: video._id.toString(),
      doc: {
        title: video.title,
        description: video.description,
        isPublish: video.isPublish,
      },
    })
  } catch {
    console.log("⚠️ ES update failed")
  }

  return res.status(200).json(
    new ApiResponse(200, video, "Video updated successfully")
  )
})

// ===============================
// DELETE VIDEO
// ===============================
const deleteVideo = asyncHandler(async (req, res) => {
  await ensureIndex()

  const { videoId } = req.params

  await Video.findByIdAndDelete(videoId)

  try {
    await esClient.delete({
      index: INDEX,
      id: videoId.toString(),
    })
  } catch {}

  return res.status(200).json(
    new ApiResponse(200, {}, "Video deleted successfully")
  )
})

// ===============================
// TOGGLE PUBLISH STATUS
// ===============================
const togglePublishStatus = asyncHandler(async (req, res) => {
  await ensureIndex()

  const { videoId } = req.params

  const video = await Video.findById(videoId)

  if (!video) throw new ApiError(404, "Video not found")

  video.isPublish = !video.isPublish
  await video.save()

  try {
    await esClient.update({
      index: INDEX,
      id: video._id.toString(),
      doc: { isPublish: video.isPublish },
    })
  } catch {}

  return res.status(200).json(
    new ApiResponse(200, video, "Publish status updated")
  )
})

// ===============================
// GET VIDEOS BY USER (UNCHANGED)
// ===============================
const getVideosByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params

  const videos = await Video.find({ owner: userId })

  return res.status(200).json(
    new ApiResponse(200, videos, "User videos fetched successfully")
  )
})

// ===============================
export {
  getAllVideos,
  publishVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  getVideosByUser,
}
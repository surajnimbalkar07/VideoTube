import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

 const getChannelStats = asyncHandler(async (req, res) => {

    const userId = req.user._id

    const totalVideos = await Video.countDocuments({ owner: userId })

    const totalSubscribers = await Subscription.countDocuments({
        channel: userId
    })

    const totalViews = await Video.aggregate([
        { $match: { owner: userId } },
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$views" }
            }
        }
    ])

    const totalLikes = await Like.countDocuments({
        likedBy: userId
    })

    return res.status(200).json(
        new ApiResponse(200, {
            totalVideos,
            totalSubscribers,
            totalViews: totalViews[0]?.totalViews || 0,
            totalLikes
        }, "Channel stats fetched successfully")
    )
})
const getChannelVideos = asyncHandler(async (req, res) => {

    const userId = req.user._id

    const videos = await Video.find({ owner: userId })
        .sort({ createdAt: -1 })
        .select("title views isPublish createdAt thumbnail")

    return res.status(200).json(
        new ApiResponse(200, videos, "Channel videos fetched successfully")
    )
})
const getChannelAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  // Video views per day
  const viewsTrend = await Video.aggregate([
    { $match: { owner: userId, createdAt: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%d %b", date: "$createdAt" } },
        totalViews: { $sum: "$views" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // New subscribers per day
  const subsTrend = await Subscription.aggregate([
    { $match: { channel: userId, createdAt: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%d %b", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return res.status(200).json(
    new ApiResponse(200, { viewsTrend, subsTrend }, "Channel analytics fetched")
  );
});

export {
    getChannelStats, 
    getChannelVideos,
    getChannelAnalytics
    }
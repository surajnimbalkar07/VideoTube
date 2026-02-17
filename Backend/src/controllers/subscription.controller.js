import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    if (channelId === req.user._id.toString())
        throw new ApiError(400, "You cannot subscribe yourself")

    const existing = await Subscription.findOne({
        subscriber: req.user._id,
        channel: channelId
    })

    if (existing) {
        await existing.deleteOne()
        return res.status(200).json(
            new ApiResponse(200, {}, "Unsubscribed")
        )
    }

    await Subscription.create({
        subscriber: req.user._id,
        channel: channelId
    })

    return res.status(200).json(
        new ApiResponse(200, {}, "Subscribed")
    )
})

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    const subscribers = await Subscription.find({ channel: channelId })
        .populate("subscriber", "fullname username avatar")

    return res.status(200).json(
        new ApiResponse(200, subscribers, "Subscribers fetched")
    )
})

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    const channels = await Subscription.find({ subscriber: subscriberId })
        .populate("channel", "fullname username avatar")

    return res.status(200).json(
        new ApiResponse(200, channels, "Subscribed channels fetched")
    )
})


export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
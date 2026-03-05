import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import api from "../api/axios"
import LikeButton from "../components/video/LikeButton"
import SubscribeButton from "../components/video/SubscribeButton"
import CommentSection from "../components/comment/CommentSection"

const VideoDetail = () => {
  const { id } = useParams()
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await api.get(`/videos/${id}`)
        setVideo(res.data.data)
      } catch (error) {
        console.error("Error fetching video:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchVideo()
  }, [id])

  if (loading)
    return (
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="animate-pulse space-y-6">
          <div className="w-full h-[400px] bg-gray-800 rounded-2xl"></div>
          <div className="h-8 bg-gray-800 rounded w-2/3"></div>
          <div className="h-6 bg-gray-800 rounded w-1/3"></div>
        </div>
      </div>
    )

  if (!video) return <div className="p-6">Video not found</div>

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* Video Player */}
      <div className="relative w-full pt-[56.25%] rounded-2xl overflow-hidden bg-black shadow-sm">
        <video
          controls
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src={video.videoFile} type="video/mp4" />
        </video>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-semibold mt-6 tracking-tight leading-snug">
        {video.title}
      </h1>

      {/* Meta Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mt-6">

        {/* Creator Info */}
        <div className="flex items-center gap-4">
          {video.owner?.avatar && (
            <Link to={`/channel/${video.owner.username}`}>
              <img
                src={video.owner.avatar}
                alt={video.owner.username}
                className="w-12 h-12 rounded-full object-cover hover:opacity-90 transition"
              />
            </Link>
          )}

          <div>
            <Link
              to={`/channel/${video.owner.username}`}
              className="font-medium text-lg hover:text-indigo-400 transition"
            >
              {video.owner?.username}
            </Link>
            <p className="text-sm text-gray-400">
              {video.views || 0} views
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <LikeButton
            videoId={video._id}
            initialLiked={video.isLiked}
            initialCount={video.likesCount}
          />

          <SubscribeButton
            channelId={video.owner._id}
            initialSubscribed={video.owner?.isSubscribed}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800 my-10"></div>

      {/* Comments */}
      <div>
        <h2 className="text-xl font-semibold mb-6">
          Comments
        </h2>

        <CommentSection videoId={video._id} />
      </div>

    </div>
  )
}

export default VideoDetail
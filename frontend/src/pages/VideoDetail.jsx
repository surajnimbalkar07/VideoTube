import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../api/axios"
import LikeButton from "../components/video/LikeButton"
import SubscribeButton from "../components/video/SubscribeButton"
import CommentSection from "../components/comment/CommentSection"

const VideoDetail = () => {
  const { id } = useParams()
  const [video, setVideo] = useState(null)

  useEffect(() => {
    const fetchVideo = async () => {
      const res = await api.get(`/videos/${id}`)
      setVideo(res.data.data)
    }
    fetchVideo()
  }, [id])

  if (!video) return <div>Loading...</div>

  return (
    <div>
      <video controls className="w-full rounded-xl">
        <source src={video.videoFile} />
      </video>

      <h1 className="text-2xl font-bold mt-4">
        {video.title}
      </h1>

      <div className="flex items-center gap-4 mt-4">
        <LikeButton
          videoId={video._id}
          initialLiked={video.isLiked}
          initialCount={video.likesCount}
        />

        <SubscribeButton
          channelId={video.owner._id}
          initialSubscribed={video.isSubscribed}
        />
      </div>

      <CommentSection videoId={video._id} />
    </div>
  )
}

export default VideoDetail

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../api/axios"
import SubscribeButton from "../components/video/SubscribeButton"

const ChannelDetail = () => {
  const { username } = useParams()
  const navigate = useNavigate()

  const [channel, setChannel] = useState(null)
  const [videos, setVideos] = useState([])

  useEffect(() => {
    const fetchChannelAndVideos = async () => {
      try {
        // Fetch channel info
        const channelRes = await api.get(`/users/c/${username}`)
        const channelData = channelRes.data.data
        setChannel(channelData)

        // Fetch videos of that channel
        const videosRes = await api.get(`/videos/user/${channelData._id}`)
        setVideos(videosRes.data.data)

      } catch (error) {
        console.error(error)
      }
    }

    fetchChannelAndVideos()
  }, [username])

  if (!channel) return <div className="mt-4">Loading...</div>

  return (
    <div className="mt-4 px-4">
      {/* Channel Header */}
      <div className="flex items-center gap-4">
        <img
          src={channel.avatar}
          alt={channel.username}
          className="w-16 h-16 rounded-full object-cover"
        />

        <div>
          <h1 className="text-2xl font-bold">{channel.username}</h1>
          <p className="text-gray-400">
            {channel.subscribersCount || 0} subscribers
          </p>
        </div>

        <div className="ml-auto">
          <SubscribeButton
            channelId={channel._id}
            initialSubscribed={channel.isSubscribed}
          />
        </div>
      </div>

      {/* Videos Section */}
      <h2 className="text-xl font-semibold mt-6 mb-4">Videos</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {videos.map((video) => (
          <div
            key={video._id}
            className="cursor-pointer"
            onClick={() => navigate(`/video/${video._id}`)}
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-40 object-cover rounded"
            />
            <p className="mt-2 font-medium">{video.title}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChannelDetail
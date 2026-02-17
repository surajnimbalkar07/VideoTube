import { Link } from "react-router-dom"

const VideoCard = ({ video }) => {
  return (
    <Link to={`/video/${video._id}`}>
      <div className="glass rounded-xl overflow-hidden hover:scale-[1.02] transition duration-300 cursor-pointer">
        <img
          src={video.thumbnail}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">
            {video.title}
          </h3>
          <p className="text-sm text-gray-400">
            {video.owner?.username}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {video.views} views
          </p>
        </div>
      </div>
    </Link>
  )
}

export default VideoCard

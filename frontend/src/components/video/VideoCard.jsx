import { Link } from "react-router-dom"

const VideoCard = ({ video }) => {
  return (
    <Link to={`/video/${video._id}`}>
      <div className="bg-slate-900/70 backdrop-blur-md rounded-md overflow-hidden shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer">
        <div className="relative w-full h-48">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
          />
          {/* Optional overlay for hover effect */}
          <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-20 transition-opacity rounded-md"></div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1 text-white">
            {video.title}
          </h3>
          <p className="text-sm text-slate-400 line-clamp-1">
            {video.owner?.username || "Unknown"}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {video.views} views
          </p>
        </div>
      </div>
    </Link>
  )
}

export default VideoCard
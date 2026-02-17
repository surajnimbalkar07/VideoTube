import VideoCard from "./VideoCard"

const VideoGrid = ({ videos }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  )
}

export default VideoGrid

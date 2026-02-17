import PublishToggle from "./PublishToggle"
import api from "../../api/axios"

const VideoTable = ({ videos, refresh }) => {
console.log(videos.isPublish);
console.log({videos});


  const deleteVideo = async (id) => {
    await api.delete(`/videos/${id}`)
    refresh()
  }

  return (
    <div className="glass rounded-xl p-6 overflow-x-auto">
      <h3 className="text-xl font-semibold mb-4">
        Your Videos
      </h3>

      <table className="w-full text-left">
        <thead className="text-gray-400 border-b border-white/10">
          <tr>
            <th className="py-3">Title</th>
            <th>Views</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {videos.map((video) => (
            <tr
              key={video._id}
              className="border-b border-white/5"
            >
              <td className="py-3">{video.title}</td>
              <td>{video.views}</td>

              <td>
                <PublishToggle
                  videoId={video._id}
                  initialStatus={video.isPublish}
                  refresh={refresh}
                />
              </td>

              <td>
                <button
                  onClick={() => deleteVideo(video._id)}
                  className="text-red-500 text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default VideoTable

import PublishToggle from "./PublishToggle"
import api from "../../api/axios"

const VideoTable = ({ videos, refresh }) => {
  const deleteVideo = async (id) => {
    await api.delete(`/videos/${id}`)
    refresh()
  }

  return (
    <div >
      <h3 className="text-2xl font-semibold text-white mb-6">
        Your Videos
      </h3>

      <table className="w-full text-left table-auto">
        <thead className="text-gray-400 border-b border-slate-700">
          <tr>
            <th className="py-3 px-4">Title</th>
            <th className="py-3 px-4">Views</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {videos.map((video) => (
            <tr
              key={video._id}
              className="border-b border-slate-800 hover:bg-slate-900/50 transition"
            >
              <td className="py-3 px-4 text-white font-medium">{video.title}</td>
              <td className="py-3 px-4 text-gray-300">{video.views}</td>

              <td className="py-3 px-4">
                <PublishToggle
                  videoId={video._id}
                  initialStatus={video.isPublish}
                  refresh={refresh}
                />
              </td>

              <td className="py-3 px-4">
                <button
                  onClick={() => deleteVideo(video._id)}
                  className="text-red-500 hover:text-red-600 font-medium transition text-sm"
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
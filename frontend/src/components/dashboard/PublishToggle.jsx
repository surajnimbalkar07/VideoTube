import { useState, useEffect } from "react"
import api from "../../api/axios"

const PublishToggle = ({ videoId, initialStatus, refresh }) => {
  const [publish, setPublished] = useState(initialStatus)

  console.log({videoId, initialStatus})

  // 🔥 Sync state when prop changes
  useEffect(() => {
    setPublished(initialStatus)
  }, [initialStatus])

 const togglePublish = async () => {
  await api.patch(`/videos/toggle/publish/${videoId}`)
  setPublished(!publish)
  refresh()
}






  return (
    <button
      onClick={togglePublish}
      className={`px-3 py-1 rounded text-sm ${
        publish ? "bg-green-600" : "bg-gray-700"
      }`}
    >
      {publish ? "Published" : "Unpublished"}
    </button>
  )
}

export default PublishToggle

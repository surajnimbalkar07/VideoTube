import { useState } from "react"
import api from "../../api/axios"

const LikeButton = ({ videoId, initialLiked, initialCount }) => {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)

  const toggleLike = async () => {
    setLiked(!liked)
    setCount(liked ? count - 1 : count + 1)

    await api.post(`/likes/toggle/video/${videoId}`)
  }

  return (
    <button
      onClick={toggleLike}
      className={`px-4 py-2 rounded ${
        liked ? "bg-indigo-600" : "bg-gray-800"
      }`}
    >
      ❤️ {count}
    </button>
  )
}

export default LikeButton

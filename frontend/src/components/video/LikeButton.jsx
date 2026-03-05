import { useState, useEffect } from "react"
import api from "../../api/axios"

const LikeButton = ({ videoId, initialLiked, initialCount }) => {
  const [liked, setLiked] = useState(initialLiked ?? false)
  const [count, setCount] = useState(initialCount ?? 0)

  // ✅ Important when video changes
  useEffect(() => {
    setLiked(initialLiked ?? false)
    setCount(initialCount ?? 0)
  }, [initialLiked, initialCount])

  const toggleLike = async () => {
  try {
    const res = await api.post(`/likes/toggle/v/${videoId}`)

    const isLiked = res?.data?.data?.isLiked ?? false
    const likesCount = res?.data?.data?.likesCount ?? 0

    setLiked(isLiked)
    setCount(likesCount)

  } catch (err) {
    console.error("Like toggle failed", err)
  }
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



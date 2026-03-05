import { useEffect, useState } from "react"
import api from "../../api/axios"
import CommentItem from "./CommentItem"
import { FaArrowRight } from "react-icons/fa"

const CommentSection = ({ videoId }) => {
  const [comments, setComments] = useState([])
  const [content, setContent] = useState("")
  const [filter, setFilter] = useState("newest")

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/${videoId}?sort=${filter}`)
      setComments(res.data.data.docs)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [filter])

  const addComment = async () => {
    if (!content.trim()) return
    try {
      await api.post(`/comments/${videoId}`, { content })
      setContent("")
      fetchComments()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="mt-8 space-y-6">

      {/* <h3 className="text-xl font-semibold text-white">Comments</h3> */}

      {/* Filter buttons */}
      <div className="flex gap-3 mb-4 flex-wrap">
        {["newest", "oldest", "mostLiked"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filter === f
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-slate-800 text-gray-300 hover:bg-slate-700"
            }`}
          >
            {f === "newest" ? "Newest" : f === "oldest" ? "Oldest" : "Most Liked"}
          </button>
        ))}
      </div>

      {/* Add comment input */}
      <div className="flex gap-2">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 bg-slate-900/70 backdrop-blur-md px-4 py-3 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Add a comment..."
        />
        <button
          onClick={addComment}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full transition flex items-center justify-center"
        >
          <FaArrowRight />
        </button>
      </div>

      {/* Comments list */}
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {comments.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            No comments yet. Be the first to comment! 📝
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              refresh={fetchComments}
            />
          ))
        )}
      </div>

    </div>
  )
}

export default CommentSection
import { useEffect, useState } from "react"
import api from "../../api/axios"
import CommentItem from "./CommentItem"

const CommentSection = ({ videoId }) => {
  const [comments, setComments] = useState([])
  const [content, setContent] = useState("")

  const fetchComments = async () => {
    const res = await api.get(`/comments/video/${videoId}`)
    setComments(res.data.data.docs)
  }

  useEffect(() => {
    fetchComments()
  }, [])

  const addComment = async () => {
    await api.post(`/comments/${videoId}`, { content })
    setContent("")
    fetchComments()
  }

  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-lg font-semibold">Comments</h3>

      <div className="flex gap-2">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 bg-gray-800 px-4 py-2 rounded"
        />
        <button
          onClick={addComment}
          className="bg-indigo-600 px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {comments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          refresh={fetchComments}
        />
      ))}
    </div>
  )
}

export default CommentSection

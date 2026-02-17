import api from "../../api/axios"

const CommentItem = ({ comment, refresh }) => {
  const deleteComment = async () => {
    await api.delete(`/comments/${comment._id}`)
    refresh()
  }

  return (
    <div className="glass p-4 rounded">
      <p>{comment.content}</p>
      <p className="text-sm text-gray-400">
        {comment.owner?.username}
      </p>
      <button
        onClick={deleteComment}
        className="text-red-400 text-sm mt-2"
      >
        Delete
      </button>
    </div>
  )
}

export default CommentItem

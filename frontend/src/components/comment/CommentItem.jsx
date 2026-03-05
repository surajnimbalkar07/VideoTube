import { useState } from "react";
import api from "../../api/axios";

const CommentItem = ({ comment, refresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [liked, setLiked] = useState(comment.isLiked || false);
  const [likesCount, setLikesCount] = useState(comment.likesCount || 0);

  const deleteComment = async () => {
    await api.delete(`/comments/c/${comment._id}`);
    refresh();
  };

  const updateComment = async () => {
    await api.patch(`/comments/c/${comment._id}`, { content });
    setIsEditing(false);
    refresh();
  };

  const toggleLike = async () => {
    try {
      const res = await api.post(`/comments/likes/${comment._id}`);
      if (res.data.message === "Liked") {
        setLiked(true);
        setLikesCount((prev) => prev + 1);
        console.log(liked);
        
      } else {
        setLiked(false);
        setLikesCount((prev) => prev - 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="glass p-4 rounded space-y-2">
      {isEditing ? (
        <>
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-gray-800 px-3 py-2 rounded"
          />
          <div className="flex gap-2">
            <button
              onClick={updateComment}
              className="bg-indigo-600 px-3 py-1 rounded text-sm"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-700 px-3 py-1 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <p>{comment.content}</p>
          <p className="text-sm text-gray-400">By {comment.owner?.username}</p>

          <div className="flex gap-4 mt-2">
            <button
              onClick={toggleLike}
              className={`text-sm ${liked ? "text-red-500" : "text-gray-400"}`}
            >
              ❤️ {likesCount}
            </button>

            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-400 text-sm"
            >
              Update
            </button>

            <button onClick={deleteComment} className="text-red-400 text-sm">
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CommentItem;
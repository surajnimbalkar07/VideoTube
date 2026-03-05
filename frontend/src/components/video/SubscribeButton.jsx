import { useState } from "react"
import api from "../../api/axios"
import toast from "react-hot-toast"

const SubscribeButton = ({ channelId, initialSubscribed }) => {
  const [subscribed, setSubscribed] = useState(initialSubscribed)
  const [loading, setLoading] = useState(false)

  const toggleSubscribe = async (e) => {
    e.preventDefault()
    if (loading) return

    try {
      setLoading(true)

      const res = await api.post(`/subscriptions/c/${channelId}`)

      if (res.data.message === "Subscribed") {
        setSubscribed(true)
        toast.success("Subscribed successfully")
      }

      if (res.data.message === "Unsubscribed") {
        setSubscribed(false)
        toast.success("Unsubscribed successfully")
      }

    }catch (error) {
  toast.error(
    error.response?.data?.message || "Something went wrong",
    { duration: 3000 }
  )
}finally {
      setLoading(false)
    }
  }

  return (
    <button
    type="button"
      onClick={toggleSubscribe}
      disabled={loading}
      className={`px-4 py-2 rounded transition ${
        subscribed ? "bg-gray-700" : "bg-indigo-600"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {loading ? "Processing..." : subscribed ? "Subscribed" : "Subscribe"}
    </button>
  )
}

export default SubscribeButton
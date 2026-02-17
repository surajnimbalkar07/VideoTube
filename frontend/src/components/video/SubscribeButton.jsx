import { useState } from "react"
import api from "../../api/axios"

const SubscribeButton = ({ channelId, initialSubscribed }) => {
  const [subscribed, setSubscribed] = useState(initialSubscribed)

  const toggleSubscribe = async () => {
    setSubscribed(!subscribed)
    await api.post(`/subscriptions/toggle/${channelId}`)
  }

  return (
    <button
      onClick={toggleSubscribe}
      className={`px-4 py-2 rounded ${
        subscribed ? "bg-gray-700" : "bg-indigo-600"
      }`}
    >
      {subscribed ? "Subscribed" : "Subscribe"}
    </button>
  )
}

export default SubscribeButton

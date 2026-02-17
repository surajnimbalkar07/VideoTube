import { useEffect, useState } from "react"
import api from "../api/axios"
import StatCard from "../components/dashboard/StatCard"
import VideoTable from "../components/dashboard/VideoTable"

const Dashboard = () => {

  const [stats, setStats] = useState(null)
  const [videos, setVideos] = useState([])

  const fetchStats = async () => {
    const res = await api.get("/dashboard/stats")
    setStats(res.data.data)
  }

  const fetchVideos = async () => {
    const res = await api.get("/dashboard/videos")
    setVideos(res.data.data)
  }

  const refresh = () => {
    fetchStats()
    fetchVideos()
  }

  useEffect(() => {
    refresh()
  }, [])

  if (!stats) return <div>Loading dashboard...</div>

  return (
    <div className="space-y-8">

      {/* Stats Section */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard
          title="Total Videos"
          value={stats.totalVideos}
        />
        <StatCard
          title="Total Views"
          value={stats.totalViews}
        />
        <StatCard
          title="Subscribers"
          value={stats.totalSubscribers}
        />
        <StatCard
          title="Total Likes"
          value={stats.totalLikes}
        />
      </div>

      {/* Video Table */}
      <VideoTable videos={videos} refresh={refresh} />

    </div>
  )
}

export default Dashboard

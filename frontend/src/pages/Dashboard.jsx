import { useEffect, useState } from "react"
import api from "../api/axios"
import StatCard from "../components/dashboard/StatCard"
import VideoTable from "../components/dashboard/VideoTable"
import loader from "../assets/loading.json"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { FaVideo, FaEye, FaUsers, FaThumbsUp } from "react-icons/fa"
import Lottie from "lottie-react"
const COLORS = ["#4f46e5", "#6366f1", "#a78bfa", "#c7d2fe", "#e0e7ff", "#818cf8"]

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [videos, setVideos] = useState([])
  const [viewsPieData, setViewsPieData] = useState([])
  const [likesPieData, setLikesPieData] = useState([])
  const [subsTrend, setSubsTrend] = useState([])
  const [loading,setLoading]=useState(false)

  const fetchStats = async () => {
    setLoading(true)
    try {
      const res = await api.get("/dashboard/stats")
      setStats(res.data.data)
    } catch (err) {
      console.error(err)
    }finally{
      setTimeout(() => setLoading(false), 2000)
    }
  }

  const fetchVideos = async () => {
    try {
      const res = await api.get("/dashboard/videos")
      setVideos(res.data.data)

      // Pie chart for views & likes per video
      const viewsData = res.data.data.map(v => ({ name: v.title, value: v.views }))
      const likesData = res.data.data.map(v => ({ name: v.title, value: v.likesCount || 0 }))

      setViewsPieData(viewsData)
      setLikesPieData(likesData)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const res = await api.get("/dashboard/analytics")
      // backend should return: { viewsTrend: [{ _id: "01 Mar", totalViews: 20 }], subsTrend: [{ _id: "01 Mar", count: 3 }] }
      const analytics = res.data.data
      setSubsTrend(analytics.subsTrend.map(d => ({ date: d._id, subscribers: d.count })))
      // You could also update viewsTrend if you want line chart for views
    } catch (err) {
      console.error(err)
    }
  }

  const refresh = () => {
    fetchStats()
    fetchVideos()
    fetchAnalytics()
  }

  useEffect(() => {
    refresh()
  }, [])

  if (loading || !stats) {
  const quotes = [
    "Analyzing your content…",
    "Great insights take a moment…",
    "Crunching the numbers for you…",
    "Dashboard magic is loading…"
  ]
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-950 px-4 text-center">
  <div className="w-32 h-32">
    <Lottie animationData={loader} loop />
  </div>
  <p className="mt-4 text-white text-sm italic">
    "{randomQuote}"
  </p>
</div>
  )
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-10 space-y-10">

      {/* Stats Cards */}
  <div className="grid md:grid-cols-4 gap-6">
  <StatCard title="Total Videos" value={stats.totalVideos} icon={FaVideo} color="bg-indigo-500" />
  <StatCard title="Total Views" value={stats.totalViews} icon={FaEye} color="bg-green-500" />
  <StatCard title="Subscribers" value={stats.totalSubscribers} icon={FaUsers} color="bg-blue-500" />
  <StatCard title="Total Likes" value={stats.totalLikes} icon={FaThumbsUp} color="bg-pink-500" />
</div>

      {/* Analytics Charts */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Views Pie */}
        <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Views Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={viewsPieData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {viewsPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderRadius: 6, border: "none" }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Likes Pie */}
        <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Likes Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={likesPieData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {likesPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderRadius: 6, border: "none" }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Subscribers Line */}
        <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-4">New Subscribers (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={subsTrend}>
              <CartesianGrid stroke="#444" strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderRadius: 6, border: "none" }} />
              <Line type="monotone" dataKey="subscribers" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Video Table */}
      <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-lg">
        <VideoTable videos={videos} refresh={refresh} />
      </div>
    </div>
  )
}

export default Dashboard
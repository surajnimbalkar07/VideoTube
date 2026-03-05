import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import api from "../api/axios"
import VideoGrid from "../components/video/VideoGrid"
import loader from "../assets/loading.json"
import Lottie from "lottie-react"

const Home = () => {
  const [videos, setVideos] = useState([])
  const [trending, setTrending] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const search = searchParams.get("search") || ""

  const fetchVideos = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/videos?page=${page}&search=${search}`)
      setVideos(res.data.data.docs)
      setTotalPages(res.data.data.totalPages)
    } catch (err) {
      console.error(err)
    } finally {
      // keep loader visible for 3 seconds
      setTimeout(() => setLoading(false), 2000)
    }
  }

  const fetchTrending = async () => {
    try {
      const res = await api.get(`/videos?page=1`)
      setTrending(res.data.data.docs.slice(0, 6))
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchVideos()
    if (search) fetchTrending()
  }, [page, search])

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12 flex justify-center items-center">
      <div className="max-w-7xl w-full">
        {/* Loader */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-32 h-32">
              <Lottie animationData={loader} loop />
            </div>
            <p className="text-white text-l  italic">
      "The more you watch, the more you discover."
    </p>
          </div>
        ) : videos.length === 0 && search ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 rounded-full 
                            bg-slate-900 border border-slate-800
                            flex items-center justify-center
                            text-4xl mb-8 shadow-sm">
              🥺
            </div>
            <h2 className="text-3xl font-semibold text-white tracking-tight">
              Sorry, no results found
            </h2>
            <p className="text-slate-400 mt-4 max-w-md">
              We couldn’t find anything matching
              <span className="text-white font-medium"> "{search}"</span>.
              Try searching with different keywords.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-8 px-6 py-2 rounded-full 
                         bg-indigo-600 hover:bg-indigo-700 
                         text-white text-sm font-medium 
                         transition"
            >
              Explore Trending
            </button>
            <div className="border-t border-slate-800 w-full my-16"></div>
            <h3 className="text-2xl font-semibold text-white mb-8">
              Trending Now
            </h3>
            <VideoGrid videos={trending} />
          </div>
        ) : (
          <>
            <VideoGrid videos={videos} />
            {/* Pagination */}
            <div className="flex justify-center items-center gap-8 mt-16">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                  page === 1
                    ? "text-slate-600 cursor-not-allowed"
                    : "text-white border border-slate-700 hover:border-indigo-500"
                }`}
              >
                ← Previous
              </button>
              <span className="text-slate-400 text-sm">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                  page === totalPages
                    ? "text-slate-600 cursor-not-allowed"
                    : "text-white border border-slate-700 hover:border-indigo-500"
                }`}
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Home
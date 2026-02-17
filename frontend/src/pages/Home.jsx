import { useEffect, useState } from "react"
import api from "../api/axios"
import VideoGrid from "../components/video/VideoGrid"

const Home = () => {
  const [videos, setVideos] = useState([])
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [totalPages, setTotalPages] = useState(1)

  const fetchVideos = async () => {
    const res = await api.get(
      `/videos?page=${page}&search=${search}`
    )
    setVideos(res.data.data.docs)
    setTotalPages(res.data.data.totalPages)
  }

  useEffect(() => {
    fetchVideos()
  }, [page, search])

  return (
    <div>
      <div className="mb-6 flex justify-between">
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-800 px-4 py-2 rounded w-1/3"
        />
      </div>

      <VideoGrid videos={videos} />

      <div className="flex justify-center gap-4 mt-8">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-800 rounded"
        >
          Prev
        </button>

        <span>{page}</span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-800 rounded"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Home

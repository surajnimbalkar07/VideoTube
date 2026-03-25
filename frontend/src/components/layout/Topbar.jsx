import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const Topbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [query, setQuery] = useState("")

 useEffect(() => {
  const timer = setTimeout(() => {
    if (!query.trim()) {
      navigate("/")
    } else {
      navigate(`/?search=${query}&page=1`)
    }
  }, 500)

  return () => clearTimeout(timer)
}, [query])

    return (
      <header className="flex justify-between items-center px-6 py-4 bg-slate-950 border-b border-slate-800">

        {/* Search */}
        <input
          placeholder="Search videos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-1/3 px-4 py-2 rounded-full 
                   bg-slate-900 border border-slate-800
                   text-white placeholder-slate-500
                   focus:outline-none focus:border-indigo-500"
        />

        {/* User */}
        <div className="flex items-center gap-3">
          {user?.avatar && (
            <img
              src={user.avatar}
              alt={user.username}
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          <span className="text-sm text-white">
            {user?.username}
          </span>

          <button
            onClick={logout}
            className="px-4 py-1 rounded-full border border-slate-700 hover:border-red-500 text-sm transition"
          >
            Logout
          </button>
        </div>
      </header>
    )
  }

export default Topbar
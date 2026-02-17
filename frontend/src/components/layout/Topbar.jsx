import { useAuth } from "../../context/AuthContext"

const Topbar = () => {
  const { user, logout } = useAuth()

  return (
    <header className="glass p-4 flex justify-between items-center">
      <input
        placeholder="Search videos..."
        className="bg-gray-800 px-4 py-2 rounded w-1/3"
      />

      <div className="flex items-center gap-4">
        <span>{user?.username}</span>
        <button
          onClick={logout}
          className="bg-red-600 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </header>
  )
}

export default Topbar

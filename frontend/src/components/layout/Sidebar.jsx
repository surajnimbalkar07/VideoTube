import { NavLink } from "react-router-dom"

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen glass p-6 hidden md:block">
      <h1 className="text-2xl font-bold mb-10 text-indigo-400">
        Stream SaaS
      </h1>

      <nav className="space-y-4">
        <NavLink to="/" className="block hover:text-indigo-400">
          Home
        </NavLink>
        <NavLink to="/dashboard" className="block hover:text-indigo-400">
          Dashboard
        </NavLink>
        <NavLink to="/upload" className="block hover:text-indigo-400">
          Upload
        </NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar

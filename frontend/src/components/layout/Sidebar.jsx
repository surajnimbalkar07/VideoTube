import { NavLink } from "react-router-dom"

const Sidebar = () => {
  const linkStyle =
    "block px-4 py-3 rounded-xl transition-all duration-200"

  return (
    <aside className="w-64 min-h-screen bg-slate-900/70 backdrop-blur-xl border-r border-slate-800 p-8 hidden md:flex flex-col">

      {/* Logo / Brand */}
      <h1 className="text-3xl font-bold mb-12 text-indigo-400 tracking-wide">
        Stream SaaS
      </h1>

      {/* Navigation */}
      <nav className="flex flex-col gap-3 text-gray-300 font-medium">
        
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${linkStyle} ${
              isActive
                ? "bg-indigo-600 text-white shadow-lg"
                : "hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          🏠 Home
        </NavLink>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${linkStyle} ${
              isActive
                ? "bg-indigo-600 text-white shadow-lg"
                : "hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          📊 Dashboard
        </NavLink>

        <NavLink
          to="/upload"
          className={({ isActive }) =>
            `${linkStyle} ${
              isActive
                ? "bg-indigo-600 text-white shadow-lg"
                : "hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          ⬆ Upload
        </NavLink>

      </nav>

      {/* Optional Bottom Section */}
      <div className="mt-auto text-xs text-gray-500">
        © 2026 Stream SaaS
      </div>
    </aside>
  )
}

export default Sidebar
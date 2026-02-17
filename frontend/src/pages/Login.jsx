import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" })
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(form)
    navigate("/")
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded w-96">
        <h2 className="text-xl mb-4">Login</h2>
        <input
          className="w-full p-2 mb-3 bg-gray-700"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          className="w-full p-2 mb-3 bg-gray-700"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="w-full bg-red-600 p-2 rounded">
          Login
        </button>
      </form>
    </div>
  )
}

export default Login

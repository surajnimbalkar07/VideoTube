import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
    avatar: ""
  })

  const [submitting, setSubmitting] = useState(false) // new state

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true) // start submitting

    const formData = new FormData()
    formData.append("fullname", form.fullname)
    formData.append("email", form.email)
    formData.append("username", form.username)
    formData.append("password", form.password)
    formData.append("avatar", form.avatar)

    try {
      await register(formData)
      navigate("/")
    } catch (error) {
      console.log(error)
    } finally {
      setSubmitting(false) // reset after completion
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <form
        onSubmit={handleSubmit}
        className="w-96 bg-slate-900/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-slate-800"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Create Account 🚀
        </h2>

        <input
          type="file"
          name="avatar"
          required
          onChange={(e) => setForm({ ...form, avatar: e.target.files[0] })}
          className="w-full p-3 mb-4 rounded-lg bg-slate-800 text-white"
        />

        <input
          name="fullname"
          placeholder="Full Name"
          required
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />

        <input
          name="username"
          placeholder="Username"
          required
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />

        <input
          name="email"
          placeholder="Email"
          type="email"
          required
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />

        <input
          name="password"
          placeholder="Password"
          type="password"
          required
          onChange={handleChange}
          className="w-full p-3 mb-6 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />

        <button
          type="submit"
          disabled={submitting} // disable while submitting
          className="w-full bg-indigo-600 hover:bg-indigo-700 transition p-3 rounded-lg text-white font-semibold disabled:opacity-50"
        >
          {submitting ? "On the way… almost there 🚀" : "Register"}
        </button>

        <p className="text-sm text-gray-400 text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Register
import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import Lottie from "lottie-react"
import loaderAnimation from "../assets/loginLoader.json"
import errorAnimation from "../assets/error.json"
import toast, { Toaster } from "react-hot-toast"

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" })
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [lottieAnim, setLottieAnim] = useState(loaderAnimation)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setLottieAnim(loaderAnimation) // default animation

    try {
      await login(form)

      // show success message in toast
      toast.success("Login successful! Welcome aboard 🎉")

      // keep loader visible for 3s before navigating
      setTimeout(() => navigate("/"), 3000)
    } catch (error) {
      // Check error type (adjust based on your backend)
      if (
        error?.response?.status === 401 ||
        error?.response?.data?.message === "Invalid credentials"
      ) {
        toast.error("Invalid email or password ❌")
        setLottieAnim(errorAnimation) // show error animation
      } else {
        toast.error("Something went wrong! Please try again.")
        setLottieAnim(errorAnimation)
      }

      // still show animation briefly
      setTimeout(() => setLoading(false), 3000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <Toaster position="top-center" />
      {!loading ? (
        <form
          onSubmit={handleSubmit}
          className="w-96 bg-slate-900/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-slate-800"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            Welcome Back 👋
          </h2>

          <input
            type="email"
            placeholder="Email"
            required
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-3 mb-4 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />

          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full p-3 mb-6 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />

          <button className="w-full bg-indigo-600 hover:bg-indigo-700 transition p-3 rounded-lg text-white font-semibold">
            Login
          </button>

          <p className="text-sm text-gray-400 text-center mt-6">
            Don’t have an account?{" "}
            <Link to="/register" className="text-indigo-400 hover:underline">
              Register
            </Link>
          </p>
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="w-40 h-40 sm:w-48 sm:h-48">
            <Lottie animationData={lottieAnim} loop />
          </div>
          <p className="text-white text-base sm:text-lg italic mt-4">
            {lottieAnim === loaderAnimation
              ? "Great! You’re now one of our members. Hold tight while we set things up…"
              : "Oops! Something went wrong. Please check your credentials."}
          </p>
        </div>
      )}
    </div>
  )
}

export default Login
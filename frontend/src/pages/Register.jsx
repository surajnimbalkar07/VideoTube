import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

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


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
  e.preventDefault()

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
  }
}


  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-8 rounded-2xl w-96 space-y-4 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-white text-center">
          Create Account
        </h2>
<input
  type="file"
  name="avatar"
  onChange={(e) =>
    setForm({ ...form, avatar: e.target.files[0] })
  }
  className="w-full p-3 rounded bg-slate-800 text-white"
/>

        <input
  name="fullname"
  placeholder="Full Name"
  onChange={handleChange}
/>


        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full p-3 rounded bg-slate-800 text-white"
        />

        <input
          name="email"
          placeholder="Email"
          type="email"
          onChange={handleChange}
          className="w-full p-3 rounded bg-slate-800 text-white"
        />

        <input
          name="password"
          placeholder="Password"
          type="password"
          onChange={handleChange}
          className="w-full p-3 rounded bg-slate-800 text-white"
        />


        <button className="w-full bg-indigo-600 hover:bg-indigo-700 p-3 rounded text-white font-semibold">
          Register
        </button>
      </form>
    </div>
  )
}

export default Register

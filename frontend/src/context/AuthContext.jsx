import { createContext, useContext, useEffect, useState } from "react"
import api from "../api/axios"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // 🔁 Restore login on refresh
  useEffect(() => {
    const token = localStorage.getItem("accessToken")

    if (!token) {
      setLoading(false)
      return
    }

    api
      .get("/users/current-user")
      .then((res) => {
        setUser(res.data.data)
      })
      .catch(() => {
        logout()
      })
      .finally(() => setLoading(false))
  }, [])

  // ✅ LOGIN
  const login = async (credentials) => {
    const res = await api.post("/users/login", credentials)

    const { accessToken, user } = res.data.data

    localStorage.setItem("accessToken", accessToken)
    setUser(user)
  }

  // ✅ REGISTER + AUTO LOGIN
  const register = async (formData) => {
  const res = await api.post("/users/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })

  const { accessToken, user } = res.data.data || {}

  if (accessToken) {
    localStorage.setItem("accessToken", accessToken)
    setUser(user)
  }
}

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("accessToken")
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

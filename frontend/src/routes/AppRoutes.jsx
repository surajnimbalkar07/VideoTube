import { Routes, Route } from "react-router-dom"
import Login from "../pages/Login"
import Register from "../pages/Register"
import Dashboard from "../pages/Dashboard"
import Home from "../pages/Home"
import ProtectedRoute from "./ProtectedRoute"
import Layout from "../components/layout/Layout"

import VideoDetail from "../pages/VideoDetail"
import UploadVideo from "../pages/UploadVideo"
import ChannelDetail from "../pages/ChannelDetails" // 🔥 import new page

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Layout>
            <Home />
          </Layout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/video/:id"
      element={
        <ProtectedRoute>
          <Layout>
            <VideoDetail />
          </Layout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/upload"
      element={
        <ProtectedRoute>
          <Layout>
            <UploadVideo />
          </Layout>
        </ProtectedRoute>
      }
    />

    {/* 🔥 New Route for Channel Detail */}
    <Route
      path="/channel/:username"
      element={
        <ProtectedRoute>
          <Layout>
            <ChannelDetail />
          </Layout>
        </ProtectedRoute>
      }
    />
  </Routes>
)

export default AppRoutes
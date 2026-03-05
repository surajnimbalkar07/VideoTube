import { useState, useRef } from "react"
import api from "../api/axios"
import { FaUpload } from "react-icons/fa"
import Lottie from "lottie-react"
import uploadAnimation from "../assets/upload.json"
import successAnimation from "../assets/success.json"
import errorAnimation from "../assets/error.json"
import { Link, Navigate, useNavigate } from "react-router-dom"
const UploadVideo = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    videoFile: null,
    thumbnail: null,
  })

  const [phase, setPhase] = useState("idle") // idle | uploading | success | error
  const [progress, setProgress] = useState(0)
    const navigate = useNavigate()
  const videoInputRef = useRef(null)
  const thumbnailInputRef = useRef(null)

const handleSubmit = async (e) => {
  e.preventDefault()
  if (!form.videoFile || !form.thumbnail) {
    alert("⚠️ Please select both a video and a thumbnail before uploading!")
    return
  }

  const formData = new FormData()
  Object.keys(form).forEach((key) => formData.append(key, form[key]))

  try {
    setPhase("uploading")
    setProgress(0)
    // setErrorMessage("")

    let fakeProgress = 0
    const interval = setInterval(() => {
      // gradually increase fake progress up to 95%
      fakeProgress = Math.min(fakeProgress + Math.random() * 3, 95)
      setProgress(Math.floor(fakeProgress))
    }, 100)

    await api.post("/videos", formData, {
      onUploadProgress: (progressEvent) => {
        // optional: update with real progress if slower than fake progress
        const realPercent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        if (realPercent > fakeProgress) {
          fakeProgress = realPercent
        }
      },
    })

    clearInterval(interval) // stop fake progress
    setProgress(100) // jump to 100% when done
    setPhase("success")
    setTimeout(() => navigate("/"), 5000)
    setForm({ title: "", description: "", videoFile: null, thumbnail: null })
  } catch (err) {
    console.error(err)
    // setErrorMessage(
    //   "😞 Oops! Something went wrong while uploading. Please try again or check your internet connection."
    // )
    setPhase("error")
  }
}

  const renderAnimation = () => {
    if (phase === "uploading") return <Lottie animationData={uploadAnimation} loop />
    if (phase === "success") return <Lottie animationData={successAnimation} loop={false} />
    if (phase === "error") return <Lottie animationData={errorAnimation}  />
    return null
  }

  if (phase !== "idle")
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white px-4">
        <div className="w-64 h-64">{renderAnimation()}</div>
        {phase === "uploading" && (
          <>
            <h2 className="text-2xl font-semibold mt-6">Uploading Video...</h2>
            <p className="text-gray-400 mt-2">Almost there! {progress}% completed</p>
            <div className="w-full max-w-md bg-slate-800 rounded-full h-4 mt-4 overflow-hidden">
              <div
                className="h-4 bg-indigo-600 transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </>
        )}
        {phase === "success" && <>
          <h2 className="text-2xl font-semibold mt-6">Upload Successful!</h2>

        </>
        }
        {phase === "error" && (
  <div className="mt-6 w-full max-w-md p-4  bg-opacity-90 text-white  shadow-lg flex flex-col items-center justify-center animate-fadeIn">
    <h2 className="text-2xl font-semibold flex items-center gap-2">
      ⚠️ Upload Failed!
    </h2>
    <p className="mt-2 text-center text-white-100">
     "😞 Oops! Something went wrong while uploading. Please try again or check your internet connection."
    </p>
    <button
      onClick={() => setPhase("idle")}
      className="mt-4 bg-white text-red-700 font-semibold px-4 py-2  hover:bg-red-100 transition"
    >
      Try Again
    </button>
  </div>
)}
      </div>
    )

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center py-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-slate-900 text-white rounded-lg p-8 space-y-6"
      >
        <h2 className="text-2xl font-semibold mb-4">Upload Video</h2>

        {/* Video Title */}
        <input
          type="text"
          placeholder="Video Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-3 rounded-md bg-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          required
        />

        {/* Video Description */}
        <textarea
          placeholder="Video Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-3 rounded-md bg-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition h-32 resize-none"
          required
        />

        {/* Video & Thumbnail */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Video File */}
          <div
            className="flex-1 border border-slate-700 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition"
            onClick={() => videoInputRef.current.click()}
          >
            <span className="text-gray-400 mb-2">Select Video File</span>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={(e) => setForm({ ...form, videoFile: e.target.files[0] })}
              className="hidden"
            />
            {form.videoFile && (
              <span className="text-sm text-white mt-2 truncate w-full text-center">
                {form.videoFile.name}
              </span>
            )}
          </div>

          {/* Thumbnail File */}
          <div
            className="flex-1 border border-slate-700 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition"
            onClick={() => thumbnailInputRef.current.click()}
          >
            <span className="text-gray-400 mb-2">Select Thumbnail</span>
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => setForm({ ...form, thumbnail: e.target.files[0] })}
              className="hidden"
            />
            {form.thumbnail && (
              <span className="text-sm text-white mt-2 truncate w-full text-center">
                {form.thumbnail.name}
              </span>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-md transition"
        >
          <FaUpload /> Upload Video
        </button>
      </form>
    </div>
  )
}

export default UploadVideo
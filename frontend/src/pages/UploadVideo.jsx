import { useState } from "react"
import api from "../api/axios"

const UploadVideo = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    videoFile: null,
    thumbnail: null,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key])
    })

    await api.post("/videos", formData)
    alert("Uploaded")
  }

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Title"
          className="w-full p-2 bg-gray-800"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          placeholder="Description"
          className="w-full p-2 bg-gray-800"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="file"
          onChange={(e) =>
            setForm({ ...form, videoFile: e.target.files[0] })
          }
        />
        <input
          type="file"
          onChange={(e) =>
            setForm({ ...form, thumbnail: e.target.files[0] })
          }
        />
        <button className="bg-red-600 px-4 py-2 rounded">
          Upload
        </button>
      </form>
    </div>
  )
}

export default UploadVideo

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { logout } from "../api/auth"

const API_BASE = "http://localhost:5000/api"

const Dashboard = () => {
  const [canvases, setCanvases] = useState([])
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  useEffect(() => {
    fetch(`${API_BASE}/canvas`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          logout()
          navigate("/login")
        }
        return res.json()
      })
      .then((data) => {
        setCanvases(data)
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to load canvases")
        setLoading(false)
      })
  }, [navigate, token])

  const handleCreate = async (e) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError("Canvas name is required")
      return
    }

    const res = await fetch(`${API_BASE}/canvas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.message || "Failed to create canvas")
      return
    }

    setCanvases((prev) => [data, ...prev])
    setName("")
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  if (loading) return <p className="p-6">Loading...</p>

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Canvases</h1>
        <button
          onClick={handleLogout}
          className="bg-black text-white px-4 py-2"
        >
          Logout
        </button>
      </div>

      <form onSubmit={handleCreate} className="flex gap-2">
        <input
          className="border p-2 flex-1"
          placeholder="New canvas name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="bg-black text-white px-4">Create</button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      {canvases.length === 0 ? (
        <p className="text-gray-500">No canvases yet. Create one above.</p>
      ) : (
        <ul className="space-y-2">
          {canvases.map((canvas) => (
            <li
              key={canvas._id}
              className="border p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => navigate(`/canvas/${canvas._id}`)}
            >
              <p className="font-medium">{canvas.name}</p>
              <p className="text-sm text-gray-500">
                Created {new Date(canvas.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Dashboard

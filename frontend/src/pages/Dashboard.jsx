import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { logout } from "../api/auth"

const API_BASE = "http://localhost:5000/api"

const Dashboard = () => {
  const [canvases, setCanvases] = useState([])
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [shareCanvasId, setShareCanvasId] = useState(null)
  const [shareEmail, setShareEmail] = useState("")
  const [shareError, setShareError] = useState(null)
  const [shareSuccess, setShareSuccess] = useState(null)

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

  const handleShare = async (canvasId) => {
    setShareError(null)
    setShareSuccess(null)

    if (!shareEmail.trim()) {
      setShareError("Email is required")
      return
    }

    try {
      const res = await fetch(`${API_BASE}/canvas/${canvasId}/share`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: shareEmail }),
      })

      const data = await res.json()

      if (!res.ok) {
        setShareError(data.message || "Failed to share canvas")
        return
      }

      setShareSuccess("Canvas shared successfully")
      setShareEmail("")
      setShareCanvasId(null)
    } catch (err) {
      setShareError("Something went wrong")
    }
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
            <li key={canvas._id} className="border p-4 hover:bg-gray-50">
              <div className="flex justify-between items-center gap-4">
                <div
                  className="cursor-pointer flex-1"
                  onClick={() => navigate(`/canvas/${canvas._id}`)}
                >
                  <p className="font-medium">{canvas.name}</p>
                  <p className="text-sm text-gray-500">
                    Created {new Date(canvas.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <button
                  onClick={() =>
                    setShareCanvasId(
                      shareCanvasId === canvas._id ? null : canvas._id
                    )
                  }
                  className="text-sm border px-3 py-1"
                >
                  Share
                </button>
              </div>
              {shareCanvasId === canvas._id && (
                <div className="mt-3 space-y-2">
                  <input
                    type="email"
                    placeholder="User email"
                    className="border p-2 w-full"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleShare(canvas._id)}
                      className="bg-black text-white px-3 py-1"
                    >
                      Share
                    </button>

                    <button
                      onClick={() => {
                        setShareCanvasId(null)
                        setShareEmail("")
                        setShareError(null)
                        setShareSuccess(null)
                      }}
                      className="border px-3 py-1"
                    >
                      Cancel
                    </button>
                  </div>

                  {shareError && (
                    <p className="text-red-500 text-sm">{shareError}</p>
                  )}
                  {shareSuccess && (
                    <p className="text-green-600 text-sm">{shareSuccess}</p>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Dashboard

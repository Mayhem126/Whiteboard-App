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
  const [deleteCanvasId, setDeleteCanvasId] = useState(null)
  const [deleteError, setDeleteError] = useState(null)

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

  const handleDelete = async (canvasId) => {
    setDeleteError(null)

    try {
      const res = await fetch(`${API_BASE}/canvas/${canvasId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()

      if (!res.ok) {
        setDeleteError(data.message || "Failed to delete canvas")
        return
      }

      // remove from UI immediately
      setCanvases((prev) => prev.filter((canvas) => canvas._id !== canvasId))

      setDeleteCanvasId(null)
    } catch (err) {
      setDeleteError("Something went wrong")
    }
  }

  if (loading) return <p className="p-6">Loading...</p>

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-gray-900">
            My Canvases
          </h1>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
  
        <form
          onSubmit={handleCreate}
          className="flex gap-2 rounded-xl bg-white p-4 shadow-sm"
        >
          <input
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="New canvas name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-800">
            Create
          </button>
        </form>
  
        {error && <p className="text-sm text-red-500">{error}</p>}
  
        {canvases.length === 0 ? (
          <p className="text-gray-500">No canvases yet. Create one above.</p>
        ) : (
          <ul className="space-y-3">
            {canvases.map((canvas) => (
              <li
                key={canvas._id}
                className="rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-4">
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => navigate(`/canvas/${canvas._id}`)}
                  >
                    <p className="font-medium text-gray-900">{canvas.name}</p>
                    <p className="text-sm text-gray-500">
                      Created{" "}
                      {new Date(canvas.createdAt).toLocaleDateString()}
                    </p>
                  </div>
  
                  <button
                    onClick={() => {
                      setShareCanvasId(
                        shareCanvasId === canvas._id ? null : canvas._id
                      )
                      setShareEmail("")
                      setShareError(null)
                      setShareSuccess(null)
                      setDeleteError(null)
                      setDeleteCanvasId(null)
                    }}
                    className="rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Share
                  </button>
  
                  <button
                    onClick={() => {
                      setDeleteCanvasId(
                        deleteCanvasId === canvas._id ? null : canvas._id
                      )
                      setDeleteError(null)
                      setShareError(null)
                      setShareSuccess(null)
                      setShareEmail("")
                      setShareCanvasId(null)
                    }}
                    className="rounded-lg border border-red-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
  
                {shareCanvasId === canvas._id && (
                  <div className="mt-4 space-y-2">
                    <input
                      type="email"
                      placeholder="User email"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                      value={shareEmail}
                      onChange={(e) => setShareEmail(e.target.value)}
                    />
  
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleShare(canvas._id)}
                        className="rounded-lg bg-black px-3 py-1 text-sm text-white hover:bg-gray-800"
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
                        className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                    </div>
  
                    {shareError && (
                      <p className="text-sm text-red-500">{shareError}</p>
                    )}
                    {shareSuccess && (
                      <p className="text-sm text-green-600">{shareSuccess}</p>
                    )}
                  </div>
                )}
  
                {deleteCanvasId === canvas._id && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-red-600">
                      Are you sure you want to delete this canvas?
                    </p>
  
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(canvas._id)}
                        className="rounded-lg bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
  
                      <button
                        onClick={() => {
                          setDeleteCanvasId(null)
                          setDeleteError(null)
                        }}
                        className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                    </div>
  
                    {deleteError && (
                      <p className="text-sm text-red-500">{deleteError}</p>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )  
}

export default Dashboard

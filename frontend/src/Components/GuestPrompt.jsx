import { useState } from "react"
import { useNavigate } from "react-router-dom"

const GuestPrompt = () => {
  const [open, setOpen] = useState(true)
  const navigate = useNavigate()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-gray-900">
          Save your work
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          You’re currently using the canvas as a guest.
          <br />
          Sign up or log in to save, share, and collaborate.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => navigate("/login")}
            className="flex-1 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Sign up
          </button>
        </div>

        <button
          onClick={() => setOpen(false)}
          className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700"
        >
          Continue as guest
        </button>
      </div>
    </div>
  )
}

export default GuestPrompt

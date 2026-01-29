import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login } from "../api/auth"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      await login(email, password)
      navigate("/dashboard")
    } catch (err) {
      setError(err.message || "Login failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow">
        <h2 className="text-xl font-semibold text-gray-900">Welcome back</h2>
        <p className="mt-1 text-sm text-gray-600">
          Log in to access your canvases.
        </p>

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="cursor-pointer text-black hover:underline"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login

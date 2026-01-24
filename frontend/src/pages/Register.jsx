import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { register } from "../api/auth"

const Register = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      await register(email, password)
      navigate("/login")
    } catch (err) {
      setError(err.errors?.join(", ") || err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-96 space-y-4">
        <h1 className="text-2xl font-bold">Register</h1>

        {error && <p className="text-red-500">{error}</p>}

        <input
          className="w-full border p-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full border p-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-black text-white p-2">Register</button>
      </form>
    </div>
  )
}

export default Register

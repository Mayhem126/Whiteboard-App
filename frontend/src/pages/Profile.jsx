import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getProfile, logout } from "../api/auth"

const Profile = () => {
  const [message, setMessage] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    getProfile()
      .then((data) => setMessage(data.message))
      .catch(() => navigate("/login"))
  }, [navigate])

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <h1 className="text-2xl font-bold">Profile</h1>
      <p>{message}</p>
      <button onClick={handleLogout} className="bg-black text-white px-4 py-2">
        Logout
      </button>
    </div>
  )
}

export default Profile

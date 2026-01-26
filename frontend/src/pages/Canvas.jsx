import Board from "../Components/Board"
import Toolbar from "../Components/Toolbar"
import Toolbox from "../Components/Toolbox"
import BoardProvider from "../store/BoardProvider"
import ToolboxProvider from "../store/ToolboxProvider"
import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

const Canvas = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const loadCanvas = async () => {
      try {
        const token = localStorage.getItem("token")

        const res = await fetch(`http://localhost:5000/api/canvas/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          throw new Error("Failed to load canvas")
        }

        const data = await res.json()
        console.log("LOADED CANVAS:", data)
      } catch (err) {
        navigate("/dashboard")
      }
    }

    loadCanvas()
  }, [id, navigate])

  return (
    <>
      <BoardProvider>
        <ToolboxProvider>
          <Toolbar />
          <Board />
          <Toolbox />
        </ToolboxProvider>
      </BoardProvider>
    </>
  )
}

export default Canvas

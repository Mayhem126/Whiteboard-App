import Board from "../Components/Board"
import Toolbar from "../Components/Toolbar"
import Toolbox from "../Components/Toolbox"
import BoardProvider from "../store/BoardProvider"
import ToolboxProvider from "../store/ToolboxProvider"
import { useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import boardContext from "../store/board-context"
import { rehydrateElements } from "../utils/rehydrateElements"

const CanvasContent = ({ id, navigate }) => {
  const { loadElements } = useContext(boardContext)
  useEffect(() => {
    const loadFromDb = async () => {
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

        if (Array.isArray(data.elements)) {
          const hydrated = rehydrateElements(data.elements)
          loadElements(hydrated)
        }
      } catch (err) {
        console.error("Failed to load canvas elements", err)
      }
    }

    loadFromDb()
  }, [id])
  return (
    <>
      <Toolbar />
      <Board />
      <Toolbox />
    </>
  )
}

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
    <BoardProvider>
      <ToolboxProvider>
        <CanvasContent id={id} navigate={navigate} />
      </ToolboxProvider>
    </BoardProvider>
  )
}

export default Canvas

import Board from "../Components/Board"
import Toolbar from "../Components/Toolbar"
import Toolbox from "../Components/Toolbox"
import BoardProvider from "../store/BoardProvider"
import ToolboxProvider from "../store/ToolboxProvider"
import { useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import boardContext from "../store/board-context"
import { rehydrateElements } from "../utils/rehydrateElements"
import { initSocket, getSocket } from "../utils/socket"

const CanvasContent = ({ id, navigate }) => {
  const { loadElements } = useContext(boardContext)

  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const handleRemoteUpdate = ({ elements }) => {
      loadElements(elements)
    }

    socket.on("canvas:update", handleRemoteUpdate)

    return () => {
      socket.off("canvas:update", handleRemoteUpdate)
    }
  }, [loadElements])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const loadFromDb = async () => {
      try {
        const token = localStorage.getItem("token")

        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/canvas/${id}`, {
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

        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/canvas/${id}`, {
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

  useEffect(() => {
    const socket = initSocket()

    socket.connect()

    socket.emit("join-canvas", { canvasId: id })

    return () => {
      socket.disconnect()
    }
  }, [id])

  return (
    <BoardProvider>
      <ToolboxProvider>
        <CanvasContent id={id} navigate={navigate} />
      </ToolboxProvider>
    </BoardProvider>
  )
}

export default Canvas

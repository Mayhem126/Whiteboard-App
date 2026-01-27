import React, {
  useContext,
  useEffect,
  useRef,
  useLayoutEffect,
  useState,
  useCallback,
} from "react"
import rough from "roughjs"
import { TOOL_ACTION_TYPES, TOOL_ITEMS } from "../../constants"
import boardContext from "../../store/board-context"
import toolboxContext from "../../store/toolbox-context"
import classes from "./index.module.css"
import { updateCanvas } from "../../utils/api"
import getStroke from "perfect-freehand"
import { getSvgPathFromStroke } from "../utils/element"

const Board = () => {
  const canvasRef = useRef()
  const textAreaRef = useRef()
  const {
    elements,
    toolActionType,
    boardMouseDownHandler,
    boardMouseMoveHandler,
    boardMouseUpHandler,
    textAreaBlurHandler,
    undo,
    redo,
  } = useContext(boardContext)

  const { toolboxState } = useContext(toolboxContext)

  const [canvasSize, setCanvasSize] = useState({
    canvasWidth: window.innerWidth,
    canvasHeight: window.innerHeight,
  })

  const handleCanvasResize = useCallback(() => {
    setCanvasSize({
      canvasWidth: window.innerWidth,
      canvasHeight: window.innerHeight,
    })
  }, [])

  useEffect(() => {
    window.addEventListener("resize", handleCanvasResize)
    return () => {
      window.removeEventListener("resize", handleCanvasResize)
    }
  }, [handleCanvasResize])

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    canvas.width = canvasSize.canvasWidth
    canvas.height = canvasSize.canvasHeight
  }, [canvasSize])

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.ctrlKey && event.key === "z") {
        undo()
      } else if (event.ctrlKey && event.key === "y") {
        redo()
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [undo, redo])

  useLayoutEffect(() => {
    if (!canvasRef.current || !Array.isArray(elements)) return

    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    context.save()

    const roughCanvas = rough.canvas(canvas)

    elements.forEach((element) => {
      switch (element.type) {
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.RECTANGLE:
        case TOOL_ITEMS.CIRCLE:
        case TOOL_ITEMS.ARROW:
          roughCanvas.draw(element.roughEle)
          break
        case TOOL_ITEMS.BRUSH: {
          let path = element.path
          if (!(path instanceof Path2D)) {
            path = new Path2D(getSvgPathFromStroke(getStroke(element.points)))
          }

          context.fillStyle = element.stroke
          context.fill(path)
          break
        }
        case TOOL_ITEMS.TEXT:
          context.textBaseline = "top"
          context.font = `${element.size}px Nanum Pen Script`
          context.fillStyle = element.stroke
          context.fillText(element.text, element.x1, element.y1)
          context.restore()
          break
        default:
          throw new Error("Type not recognised")
      }
    })

    return () => {
      context.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [elements, canvasSize])

  useEffect(() => {
    const textarea = textAreaRef.current
    if (toolActionType === TOOL_ACTION_TYPES.WRITING) {
      setTimeout(() => {
        textarea.focus()
      }, 0)
    }
  }, [toolActionType])

  const handleMouseDown = (event) => {
    boardMouseDownHandler(event, toolboxState)
  }

  const handleMouseMove = (event) => {
    boardMouseMoveHandler(event)
  }

  const handleMouseUp = () => {
    boardMouseUpHandler()
    const canvasId = window.location.pathname.split("/").pop()
    updateCanvas(canvasId, elements)
  }

  return (
    <div>
      {toolActionType === TOOL_ACTION_TYPES.WRITING && (
        <textarea
          type="text"
          ref={textAreaRef}
          className={classes.textElementBox}
          style={{
            top: elements[elements.length - 1].y1,
            left: elements[elements.length - 1].x1,
            fontSize: `${elements[elements.length - 1]?.size}px`,
            color: elements[elements.length - 1]?.stroke,
          }}
          onBlur={(event) => textAreaBlurHandler(event.target.value)}
        />
      )}
      <canvas
        id="canvas"
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  )
}

export default Board

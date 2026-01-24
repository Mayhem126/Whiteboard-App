import Board from "../Components/Board"
import Toolbar from "../Components/Toolbar"
import Toolbox from "../Components/Toolbox"
import BoardProvider from "../store/BoardProvider"
import ToolboxProvider from "../store/ToolboxProvider"

const Canvas = () => {
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

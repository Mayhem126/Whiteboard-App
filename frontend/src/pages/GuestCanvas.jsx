import Board from "../Components/Board"
import Toolbar from "../Components/Toolbar"
import Toolbox from "../Components/Toolbox"
import BoardProvider from "../store/BoardProvider"
import ToolboxProvider from "../store/ToolboxProvider"
import GuestPrompt from "../Components/GuestPrompt"

const GuestCanvas = () => {
  return (
    <BoardProvider>
      <ToolboxProvider>
        <GuestPrompt />
        <Toolbar />
        <Board />
        <Toolbox />
      </ToolboxProvider>
    </BoardProvider>
  )
}

export default GuestCanvas
import { io } from "socket.io-client"

let socket = null

export const initSocket = () => {
  if (socket) return socket

  const token = localStorage.getItem("token")

  socket = io(process.env.REACT_APP_API_URL, {
    auth: {
      token,
    },
    autoConnect: false,
  })

  return socket
}

export const getSocket = () => socket

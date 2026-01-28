import { io } from "socket.io-client"

let socket = null

export const initSocket = () => {
  if (socket) return socket

  const token = localStorage.getItem("token")

  socket = io("http://localhost:5000", {
    auth: {
      token,
    },
    autoConnect: false,
  })

  return socket
}

export const getSocket = () => socket

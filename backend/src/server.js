const app = require("./app")
const PORT = process.env.PORT || 5000
const connectToDatabase = require("./config/db")

connectToDatabase()

const http = require("http")
const { Server } = require("socket.io")

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      process.env.FRONTEND_URL,
    ],
    methods: ["GET", "POST"],
  },
})

server.listen(PORT, () => {
  console.log(`Connected to server at PORT ${PORT}`)
})

const jwt = require("jsonwebtoken")
const Canvas = require("./models/canvasModel")
const { JWT_SECRET } = require("./config/env")

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token
    if (!token) return next(new Error("Unauthorized"))

    const decoded = jwt.verify(token, JWT_SECRET)
    socket.user = decoded
    next()
  } catch (err) {
    next(new Error("Unauthorized"))
  }
})

io.on("connection", (socket) => {
  socket.on("join-canvas", async ({ canvasId }) => {
    try {
      const canvas = await Canvas.findOne({
        _id: canvasId,
        $or: [{ owner: socket.user.userId }, { shared: socket.user.userId }],
      })

      if (!canvas) {
        socket.emit("error", "Access denied")
        return
      }

      socket.join(`canvas:${canvasId}`)
    } catch {
      socket.emit("error", "Failed to join canvas")
    }
  })

  socket.on("canvas:update", ({ canvasId, elements }) => {
    socket.to(`canvas:${canvasId}`).emit("canvas:update", {
      elements,
    })
  })
})

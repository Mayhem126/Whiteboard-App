const express = require("express")
const cors = require("cors")

const userRoutes = require("./routes/userRoute")
const canvasRoutes = require("./routes/canvasRoute")

const app = express()
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      process.env.FRONTEND_URL,
    ],
    credentials: true,
    exposedHeaders: ["Authorization"],
  })
)
app.use(express.json())
app.use("/api/users", userRoutes)
app.use("/api/canvas", canvasRoutes)

module.exports = app

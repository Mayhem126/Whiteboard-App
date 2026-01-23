const express = require('express')
const userRoutes = require('./routes/userRoute')
const canvasRoutes = require('./routes/canvasRoute')

const app = express()
app.use(express.json())
app.use('/api/users', userRoutes)
app.use('/api/canvas', canvasRoutes)

module.exports = app

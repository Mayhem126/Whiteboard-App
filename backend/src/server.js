const app = require("./app")
const { PORT } = require("./config/env")
const connectToDatabase = require("./config/db")

connectToDatabase()

app.listen(PORT, () => {
  console.log(`Connected to server at PORT ${PORT}`)
})

const express = require("express")
const router = express.Router()
const { getUserCanvases } = require("../controllers/canvasController")
const { protectRoute } = require("../middlewares/protectRoute")

router.get("/list", protectRoute, getUserCanvases)

module.exports = router

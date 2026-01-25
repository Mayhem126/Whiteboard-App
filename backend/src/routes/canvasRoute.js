const express = require("express")
const router = express.Router()
const {
  getUserCanvases,
  createCanvas,
} = require("../controllers/canvasController")
const { protectRoute } = require("../middlewares/protectRoute")

router.get("/", protectRoute, getUserCanvases)
router.post("/", protectRoute, createCanvas)

module.exports = router

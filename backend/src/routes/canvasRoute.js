const express = require("express")
const router = express.Router()
const {
  getUserCanvases,
  createCanvas,
  getCanvasById,
} = require("../controllers/canvasController")
const { protectRoute } = require("../middlewares/protectRoute")

router.get("/", protectRoute, getUserCanvases)
router.post("/", protectRoute, createCanvas)
router.get("/:id", protectRoute, getCanvasById)

module.exports = router

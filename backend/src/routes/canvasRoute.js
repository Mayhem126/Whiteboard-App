const express = require("express")
const router = express.Router()
const {
  getUserCanvases,
  createCanvas,
  getCanvasById,
  updateCanvasElements,
  shareCanvasWithUser,
  deleteCanvas,
} = require("../controllers/canvasController")
const { protectRoute } = require("../middlewares/protectRoute")

router.get("/", protectRoute, getUserCanvases)
router.post("/", protectRoute, createCanvas)
router.get("/:id", protectRoute, getCanvasById)
router.patch("/:id", protectRoute, updateCanvasElements)
router.patch("/:id/share", protectRoute, shareCanvasWithUser)
router.delete("/:id", protectRoute, deleteCanvas)

module.exports = router

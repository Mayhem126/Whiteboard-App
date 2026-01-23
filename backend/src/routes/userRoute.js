const express = require("express")
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/userController")
const router = express.Router()
const { protectRoute } = require("../middlewares/protectRoute")

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/profile", protectRoute, getUserProfile)

module.exports = router

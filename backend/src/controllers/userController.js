const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const { registerSchema } = require("../validators/authValidator")
const { ZodError } = require("zod")
const { JWT_SECRET } = require("../config/env")
const jwt = require("jsonwebtoken")

const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body
    registerSchema.parse({ email, password })

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ email, password: hashedPassword })
    await user.save()
    res.status(201).json({ message: "User registered successfully" })
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({
        errors: err.issues.map((issue) => issue.message),
      })
    } else {
      res.status(400).json({ message: err.message })
    }
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const foundUser = await User.findOne({ email })
    if (!foundUser) {
      res.status(401).json({ message: `Email or password is incorrect` })
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if (match) {
      const token = jwt.sign({ email, userId: foundUser._id }, JWT_SECRET)
      res.setHeader("Authorization", `Bearer ${token}`)
      res.status(201).json({ message: `Login Successful` })
    } else {
      res.status(401).json({ message: `Email or password is incorrect` })
    }
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const getUserProfile = async (req, res) => {
  res.json({ message: `Welcome, ${req.user.email}` })
}

module.exports = { registerUser, loginUser, getUserProfile }

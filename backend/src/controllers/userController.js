const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const { registerSchema } = require("../validators/authValidator")
const { ZodError } = require("zod")

const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body
    registerSchema.parse({ email, password })

    const existingUser = await User.findOne({email})
    if (existingUser) {
        return res.status(409).json({message: "Email already registered"})
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

module.exports = { registerUser }

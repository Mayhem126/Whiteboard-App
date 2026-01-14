const { z } = require("zod")
const validator = require("validator")

const registerSchema = z.object({
  email: z.string().refine((val) => validator.isEmail(val), {
    message: "Invalid email address",
  }),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .refine(
      (val) =>
        validator.isStrongPassword(val, {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 0,
        }),
      {
        message: "Password must contain uppercase, lowercase, and a number",
      }
    ),
})

module.exports = { registerSchema }

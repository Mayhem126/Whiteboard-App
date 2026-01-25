const mongoose = require("mongoose")

const canvasSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    shared: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    elements: [{ type: mongoose.Schema.Types.Mixed }],
  },
  { timestamps: true }
)

module.exports = mongoose.model("Canvas", canvasSchema)

const Canvas = require("../models/canvasModel")

const getUserCanvases = async (req, res) => {
  try {
    const userId = req.user.userId
    const canvases = await Canvas.find({
      $or: [{ owner: userId }, { shared: userId }],
    }).sort({ createdAt: -1 })

    res.json(canvases)
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch canvases", details: error.message })
  }
}

const createCanvas = async (req, res) => {
  try {
    const userId = req.user.userId
    const { name } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Canvas name is required" })
    }

    const newCanvas = new Canvas({
      owner: userId,
      name: name,
      shared: [],
      elements: [],
    })

    await newCanvas.save()
    res
      .status(201)
      .json(newCanvas)
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create canvas", details: error.message })
  }
}

module.exports = { getUserCanvases, createCanvas }

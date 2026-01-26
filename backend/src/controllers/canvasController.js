const Canvas = require("../models/canvasModel")

const getUserCanvases = async (req, res) => {
  try {
    const userId = req.user.userId
    const canvases = await Canvas.find(
      {
        $or: [{ owner: userId }, { shared: userId }],
      },
      "name createdAt"
    ).sort({ createdAt: -1 })

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
    res.status(201).json(newCanvas)
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create canvas", details: error.message })
  }
}

const getCanvasById = async (req, res) => {
  try {
    const userId = req.user.userId
    const { id } = req.params

    const canvas = await Canvas.findOne({
      _id: id,
      $or: [{ owner: userId }, { shared: userId }],
    })

    if (!canvas) {
      return res.status(404).json({ message: "Canvas not found" })
    }

    res.json(canvas)
  } catch (error) {
    res.status(500).json({
      error: "Failed to load canvas",
      details: error.message,
    })
  }
}

const updateCanvasElements = async (req, res) => {
  try {
    const userId = req.user.userId
    const { id } = req.params
    const { elements } = req.body

    if (!Array.isArray(elements)) {
      return res.status(400).json({ message: "Invalid elements data" })
    }

    const canvas = await Canvas.findOne({
      _id: id,
      owner: userId,
    })

    if (!canvas) {
      return res.status(404).json({ message: "Canvas not found" })
    }

    canvas.elements = elements
    await canvas.save()

    res.json({ message: "Canvas updated successfully" })
  } catch (error) {
    res.status(500).json({
      error: "Failed to update canvas",
      details: error.message,
    })
  }
}

module.exports = { getUserCanvases, createCanvas, getCanvasById, updateCanvasElements }

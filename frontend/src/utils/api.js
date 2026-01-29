const API_BASE = `${process.env.REACT_APP_API_URL}/api/canvas`

export const updateCanvas = async (id, elements) => {
  try {
    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error(`Unauthorized`)
    }

    const response = await fetch(`${API_BASE}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ elements }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `Failed to update canvas`)
    }

    return data
  } catch (error) {
    throw new Error(error.message || `Failed to update canvas`)
  }
}

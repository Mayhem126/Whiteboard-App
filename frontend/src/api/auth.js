const API_BASE = `${process.env.REACT_APP_API_URL}/api`

export const register = async (email, password) => {
  const res = await fetch(`${API_BASE}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  const data = await res.json()
  if (!res.ok) throw data
  return data
}

export const login = async (email, password) => {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  const data = await res.json()

  const token = res.headers.get("Authorization")?.split(" ")[1]
  if (!res.ok || !token) throw data

  localStorage.setItem("token", token)
  return data
}

export const getProfile = async () => {
  const token = localStorage.getItem("token")

  const res = await fetch(`${API_BASE}/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("token")
    throw new Error("Unauthorized")
  }

  return res.json()
}

export const logout = () => {
  localStorage.removeItem("token")
}

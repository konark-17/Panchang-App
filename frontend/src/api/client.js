// All API calls go through here.
// In dev: Vite proxies /api → http://localhost:8080
// In prod: set VITE_API_URL to your Render.com backend URL
const BASE = import.meta.env.VITE_API_URL || ''

async function get(path) {
  const res = await fetch(BASE + path)
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`)
  return res.json()
}

export const api = {
  /** Fetch all panchang days for a month */
  getMonth: (year, month) =>
    get(`/api/panchang/month?year=${year}&month=${month}`),

  /** Fetch a single day's panchang */
  getDay: (dateStr) =>
    get(`/api/panchang/day?date=${dateStr}`),
}

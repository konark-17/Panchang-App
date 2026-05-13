import { useState, useEffect } from 'react'
import { api } from '../api/client'

/**
 * Fetches panchang data for a given year/month from the Go backend.
 * Returns { days, loading, error }
 * days is an array of PanchangDay objects indexed by (date - 1).
 */
export function usePanchang(year, month) {
  const [days, setDays] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    api.getMonth(year, month)
      .then(data => { if (!cancelled) setDays(data) })
      .catch(err => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [year, month])

  return { days, loading, error }
}

import { useState, useEffect } from 'react'
import { getLocalISODate } from '../utils/tithi'

const STORAGE_KEY = 'panchang_reminders'

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') }
  catch { return [] }
}

/**
 * CRUD for reminders stored in localStorage.
 * Returns { reminders, addReminder, deleteReminder }
 */
export function useReminders() {
  const [reminders, setReminders] = useState(load)

  // Persist on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders))
  }, [reminders])

  function addReminder(form, selectedDate) {
    if (!form.reason.trim()) return
    const newR = {
      id: Date.now(),
      ...form,
      date: form.type === 'tithi' && form.recurring
        ? null
        : form.type === 'tithi' && !form.recurring
          ? getLocalISODate(selectedDate)
          : form.date,
    }
    setReminders(prev => [...prev, newR])
  }

  function deleteReminder(id) {
    setReminders(prev => prev.filter(r => r.id !== id))
  }

  return { reminders, addReminder, deleteReminder }
}

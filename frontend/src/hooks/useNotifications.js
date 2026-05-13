import { useEffect } from 'react'
import { matchesReminder, DAYS_EN } from '../utils/tithi'

const NOTIFIED_KEY = 'panchang_notified_date'

/**
 * Fires browser notifications for today's matching reminders.
 * Only notifies once per calendar day.
 * Requires Notification API (supported on Android Chrome PWA, desktop, iOS 16.4+ PWA).
 */
export function useNotifications(reminders, todayTithi) {
  useEffect(() => {
    if (!('Notification' in window)) return
    if (!todayTithi) return

    const today = new Date()
    const todayStr = today.toDateString()

    // Skip if already notified today
    if (localStorage.getItem(NOTIFIED_KEY) === todayStr) return

    const requestAndNotify = async () => {
      let permission = Notification.permission
      if (permission === 'default') {
        permission = await Notification.requestPermission()
      }
      if (permission !== 'granted') return

      const matching = reminders.filter(r =>
        matchesReminder(today, todayTithi, r)
      )

      matching.forEach(r => {
        const dayName = r.type === 'day' && r.recurring
          ? `Every ${DAYS_EN[r.dayOfWeek]}`
          : ''

        new Notification('पंचांग स्मरण 🔔', {
          body: r.type === 'tithi'
            ? `आज ${todayTithi.hindi} है\n${r.reason}`
            : `${dayName}\n${r.reason}`,
          icon: '/icons/icon-192.png',
          badge: '/icons/icon-192.png',
          tag: `panchang-reminder-${r.id}`,
          renotify: false,
        })
      })

      if (matching.length > 0) {
        localStorage.setItem(NOTIFIED_KEY, todayStr)
      }
    }

    requestAndNotify()
  }, [reminders, todayTithi])
}

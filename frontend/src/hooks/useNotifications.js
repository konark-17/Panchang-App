import { useEffect, useState, useRef } from 'react'
import { matchesReminder, DAYS_EN } from '../utils/tithi'

const NOTIFIED_KEY = 'panchang_notified_date'

let globalAudioCtx = null

export function playAlarmSound(type = 'beep') {
  try {
    if (!globalAudioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (!AudioContext) return
      globalAudioCtx = new AudioContext()
    }
    const ctx = globalAudioCtx
    if (ctx.state === 'suspended') ctx.resume()

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    const now = ctx.currentTime

    switch (type) {
      case 'chime':
        osc.type = 'sine'
        osc.frequency.setValueAtTime(1046.50, now) // C6
        gain.gain.setValueAtTime(0, now)
        gain.gain.linearRampToValueAtTime(0.8, now + 0.05)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8)
        osc.start(now)
        osc.stop(now + 0.8)
        break
      case 'pulse':
        osc.type = 'square'
        osc.frequency.setValueAtTime(440, now)
        gain.gain.setValueAtTime(0, now)
        gain.gain.linearRampToValueAtTime(0.3, now + 0.05)
        gain.gain.linearRampToValueAtTime(0, now + 0.1)
        gain.gain.linearRampToValueAtTime(0.3, now + 0.15)
        gain.gain.linearRampToValueAtTime(0, now + 0.2)
        osc.start(now)
        osc.stop(now + 0.2)
        break
      case 'gong':
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(200, now)
        osc.frequency.exponentialRampToValueAtTime(50, now + 1.5)
        gain.gain.setValueAtTime(0, now)
        gain.gain.linearRampToValueAtTime(1, now + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5)
        osc.start(now)
        osc.stop(now + 1.5)
        break
      case 'beep':
      default:
        osc.type = 'sine'
        osc.frequency.value = 880 // A5
        gain.gain.setValueAtTime(0, now)
        gain.gain.linearRampToValueAtTime(1, now + 0.05)
        gain.gain.linearRampToValueAtTime(0, now + 0.3)
        osc.start(now)
        osc.stop(now + 0.3)
        break
    }
  } catch (e) {
    console.error("Audio play failed", e)
  }
}

export function useNotifications(reminders, todayTithi, settings) {
  const [activeAlarm, setActiveAlarm] = useState(null)
  const alarmIntervalRef = useRef(null)

  useEffect(() => {
    if (!todayTithi) return

    const checkAlarms = async () => {
      const now = new Date()
      const currentH = now.getHours().toString().padStart(2, '0')
      const currentM = now.getMinutes().toString().padStart(2, '0')
      const currentTime = `${currentH}:${currentM}`
      const todayStr = now.toDateString()

      const matching = reminders.filter(r =>
        matchesReminder(now, todayTithi, r) && r.time === currentTime
      )

      for (const r of matching) {
        const alarmKey = `alarm_fired_${r.id}_${todayStr}`
        if (!localStorage.getItem(alarmKey)) {
          localStorage.setItem(alarmKey, 'true')
          triggerAlarm(r, todayTithi, settings.alarmRingtone)
          break // Trigger one alarm at a time
        }
      }
    }

    const interval = setInterval(checkAlarms, 10000)
    checkAlarms()

    return () => clearInterval(interval)
  }, [reminders, todayTithi, settings])

  const triggerAlarm = async (reminder, todayTithi, ringtoneType) => {
    setActiveAlarm(reminder)
    
    // Play Web Audio Beep
    const loopInterval = ringtoneType === 'gong' ? 2000 : 1000
    playAlarmSound(ringtoneType)
    alarmIntervalRef.current = setInterval(() => playAlarmSound(ringtoneType), loopInterval)

    // Trigger Browser Notification
    if ('Notification' in window) {
      let permission = Notification.permission
      if (permission === 'default') {
        permission = await Notification.requestPermission()
      }
      if (permission === 'granted') {
        const dayName = reminder.type === 'day' && reminder.recurring
          ? `Every ${DAYS_EN[reminder.dayOfWeek]}`
          : ''

        new Notification('पंचांग Alarm 🔔', {
          body: reminder.type === 'tithi'
            ? `आज ${todayTithi.hindi} है\n${reminder.reason}`
            : `${dayName}\n${reminder.reason}`,
          icon: '/icons/icon-192.png',
          badge: '/icons/icon-192.png',
          tag: `panchang-alarm-${reminder.id}`,
          renotify: true,
          requireInteraction: true
        })
      }
    }
  }

  const stopAlarm = () => {
    setActiveAlarm(null)
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current)
      alarmIntervalRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      if (alarmIntervalRef.current) clearInterval(alarmIntervalRef.current)
    }
  }, [])

  return { activeAlarm, stopAlarm }
}

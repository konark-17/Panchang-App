import { useEffect, useState, useRef } from 'react'
import { matchesReminder, DAYS_EN } from '../utils/tithi'

export function useNotifications(reminders, todayTithi) {
  const [activeAlarm, setActiveAlarm] = useState(null)
  const alarmIntervalRef = useRef(null)

  useEffect(() => {
    if (!todayTithi) return

    const checkAlarms = () => {
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
          triggerAlarm(r)
          break // Trigger one alarm at a time
        }
      }
    }

    const interval = setInterval(checkAlarms, 10000)
    checkAlarms()

    return () => clearInterval(interval)
  }, [reminders, todayTithi])

  const triggerAlarm = (reminder) => {
    setActiveAlarm(reminder)
    
    const playBeep = () => {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext
        if (!AudioContext) return
        const ctx = new AudioContext()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        
        osc.type = 'sine'
        osc.frequency.value = 880 // A5 frequency
        
        gain.gain.setValueAtTime(0, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.05)
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3)
        
        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.3)
      } catch (e) {
        console.error("Audio play failed", e)
      }
    }

    playBeep()
    alarmIntervalRef.current = setInterval(playBeep, 1000)
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

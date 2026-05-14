import { useState } from 'react'
import { TITHIS, getLocalISODate } from './utils/tithi'
import { usePanchang }       from './hooks/usePanchang'
import { useReminders }      from './hooks/useReminders'
import { useNotifications }  from './hooks/useNotifications'
import { useSettings }       from './hooks/useSettings'

import Header        from './components/Header/Header'
import TodayBar      from './components/TodayBar/TodayBar'
import Calendar      from './components/Calendar/Calendar'
import DayPanel      from './components/DayPanel/DayPanel'
import ReminderList  from './components/ReminderList/ReminderList'
import ReminderModal from './components/ReminderModal/ReminderModal'
import SettingsModal from './components/SettingsModal/SettingsModal'

export default function App() {
  const today = new Date()

  const [currentYear,  setCurrentYear]  = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1) // 1-indexed for API
  const [selectedDate, setSelectedDate] = useState(today)
  const [showReminders, setShowReminders] = useState(false)
  const [showModal,     setShowModal]     = useState(false)
  const [showSettings,  setShowSettings]  = useState(false)

  // Data hooks
  const { days, loading, error } = usePanchang(currentYear, currentMonth)
  const { reminders, addReminder, deleteReminder } = useReminders()
  const { settings, updateSetting } = useSettings()

  // Today's tithi (from API data or fall back to local TITHIS array index)
  const todayStr   = getLocalISODate(today)
  const todayDay   = days.find(d => d.date === todayStr)
  const todayTithi = todayDay?.tithi ?? null

  // Selected date's panchang
  const selectedStr  = selectedDate ? getLocalISODate(selectedDate) : null
  const selectedDay  = days.find(d => d.date === selectedStr) ?? null

  // Fire time-based alarms
  const { activeAlarm, stopAlarm } = useNotifications(reminders, todayTithi, settings)

  // Month navigation
  function prevMonth() {
    if (currentMonth === 1) { setCurrentMonth(12); setCurrentYear(y => y - 1) }
    else setCurrentMonth(m => m - 1)
  }
  function nextMonth() {
    if (currentMonth === 12) { setCurrentMonth(1); setCurrentYear(y => y + 1) }
    else setCurrentMonth(m => m + 1)
  }

  return (
    <>
      <h1 className="sr-only">पंचांग — Hindu Panchang Calendar with Tithi Reminders</h1>

      <Header
        reminders={reminders}
        currentMonth={currentMonth - 1}
        currentYear={currentYear}
        onPrev={prevMonth}
        onNext={nextMonth}
        onShowReminders={() => setShowReminders(v => !v)}
        onAddReminder={() => setShowModal(true)}
        onShowSettings={() => setShowSettings(true)}
      />

      <TodayBar
        today={today}
        todayTithi={todayTithi}
        reminders={reminders}
      />

      {showReminders && (
        <ReminderList
          reminders={reminders}
          onDelete={deleteReminder}
          onClose={() => setShowReminders(false)}
        />
      )}

      {error && (
        <div style={{
          background: 'var(--bg-danger)', border: '0.5px solid var(--border-danger)',
          color: 'var(--text-danger)', padding: '10px 14px', borderRadius: 'var(--radius-md)',
          fontSize: 13, marginBottom: '1rem'
        }}>
          ⚠️ Could not load panchang data. Make sure the backend is running. ({error})
        </div>
      )}

      <Calendar
        year={currentYear}
        month={currentMonth}
        days={days}
        reminders={reminders}
        selectedDate={selectedDate}
        today={today}
        onSelectDate={setSelectedDate}
        loading={loading}
      />

      <DayPanel
        selectedDate={selectedDate}
        panchangDay={selectedDay}
        reminders={reminders}
        onAddReminder={() => setShowModal(true)}
      />

      {showModal && (
        <ReminderModal
          selectedDate={selectedDate}
          onSave={(form, date) => { addReminder(form, date); setShowModal(false) }}
          onClose={() => setShowModal(false)}
        />
      )}

      {showSettings && (
        <SettingsModal
          settings={settings}
          updateSetting={updateSetting}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Alarm Overlay */}
      {activeAlarm && (
        <div className="alarm-backdrop" role="dialog" aria-modal="true">
          <div className="alarm-dialog">
            <div className="alarm-icon">🔔</div>
            <h2 className="alarm-title">समय हो गया! / Alarm</h2>
            <p className="alarm-reason">{activeAlarm.reason}</p>
            <p className="alarm-time">Set for {activeAlarm.time}</p>
            <button id="btn-stop-alarm" className="alarm-stop" onClick={stopAlarm}>
              <i className="ti ti-bell-off" aria-hidden="true" />
              Stop Alarm / बंद करें
            </button>
          </div>
        </div>
      )}
    </>
  )
}

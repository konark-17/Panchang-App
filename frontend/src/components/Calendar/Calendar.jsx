import { useMemo } from 'react'
import CalendarCell, { CalendarHeader } from './CalendarCell'
import './Calendar.css'

export default function Calendar({ year, month, days, reminders, selectedDate, today, onSelectDate, loading }) {
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay()
  const daysInMonth    = new Date(year, month, 0).getDate()

  const cells = useMemo(() => {
    const arr = []
    for (let i = 0; i < firstDayOfWeek; i++) arr.push(null)
    for (let d = 1; d <= daysInMonth; d++) {
      arr.push(new Date(year, month - 1, d))
    }
    return arr
  }, [year, month, firstDayOfWeek, daysInMonth])

  // Build a map: dateStr → panchangDay for O(1) lookup
  const dayMap = useMemo(() => {
    const m = {}
    days.forEach(pd => { m[pd.date] = pd })
    return m
  }, [days])

  return (
    <div className="calendar">
      <CalendarHeader />

      {loading && (
        <div className="calendar__loading">
          <div className="spinner" />
        </div>
      )}

      <div className="calendar__grid">
        {cells.map((date, idx) => {
          const dateStr = date ? date.toISOString().slice(0, 10) : null
          return (
            <CalendarCell
              key={date ? dateStr : `empty-${idx}`}
              date={date}
              panchangDay={dateStr ? dayMap[dateStr] : null}
              reminders={reminders}
              isToday={date ? date.toDateString() === today.toDateString() : false}
              isSelected={date ? date.toDateString() === selectedDate?.toDateString() : false}
              onClick={onSelectDate}
            />
          )
        })}
      </div>

      {/* Legend */}
      <div className="calendar__legend">
        <span>🌕 Purnima</span>
        <span>🌑 Amavasya</span>
        <span>☽ Ekadashi</span>
        <span className="calendar__legend-dot"><span className="reminder-dot" /> Reminder</span>
        <span className="calendar__legend-today">Today</span>
        <span className="calendar__legend-selected">Selected</span>
      </div>
    </div>
  )
}

import { matchesReminder, MONTHS_EN, HINDI_MONTHS } from '../../utils/tithi'
import './DayPanel.css'

export default function DayPanel({ selectedDate, panchangDay, reminders, onAddReminder }) {
  if (!selectedDate) return null

  const tithi = panchangDay?.tithi
  const dayReminders = panchangDay
    ? reminders.filter(r => matchesReminder(selectedDate, panchangDay.tithi, r))
    : []

  return (
    <div className="day-panel">
      {/* Date info */}
      <div className="day-panel__card">
        <div className="day-panel__section-label">चुनी हुई तिथि / Selected Date</div>

        <div className="day-panel__date-en">
          {selectedDate.getDate()} {MONTHS_EN[selectedDate.getMonth()]} {selectedDate.getFullYear()}
        </div>
        <div className="day-panel__date-hi">
          {selectedDate.getDate()} {HINDI_MONTHS[selectedDate.getMonth()]}
        </div>

        <div className="day-panel__divider" />

        <div className="day-panel__section-label">तिथि</div>
        {tithi ? (
          <>
            <div className="day-panel__tithi-hindi">{tithi.hindi}</div>
            <div className="day-panel__tithi-en">{tithi.paksha} {tithi.name}</div>
          </>
        ) : (
          <div className="day-panel__loading">Loading…</div>
        )}

        <button
          id="btn-add-reminder-day"
          className="day-panel__add-btn"
          onClick={onAddReminder}
        >
          <i className="ti ti-plus" aria-hidden="true" />
          Add Reminder for this day
        </button>
      </div>

      {/* Reminders for selected date */}
      <div className="day-panel__card">
        <div className="day-panel__section-label">
          स्मरण / Reminders ({dayReminders.length})
        </div>

        {dayReminders.length === 0 ? (
          <div className="day-panel__empty">No reminders for this day.</div>
        ) : (
          <div className="day-panel__reminders">
            {dayReminders.map(r => (
              <div key={r.id} className="day-panel__reminder-item">
                <div className="day-panel__reminder-icon">🔔</div>
                <div>
                  <div className="day-panel__reminder-reason">{r.reason}</div>
                  <div className="day-panel__reminder-meta">
                    {r.recurring ? 'Recurring' : 'One-time'} ·{' '}
                    {r.type === 'tithi'
                      ? `${r.paksha === 'Both' ? 'Shukla+Krishna' : r.paksha} ${r.tithiName}`
                      : r.dayOfWeek !== undefined ? ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][r.dayOfWeek] : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

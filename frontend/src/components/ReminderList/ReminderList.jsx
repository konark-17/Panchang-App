import { DAYS_EN } from '../../utils/tithi'
import './ReminderList.css'

export default function ReminderList({ reminders, onDelete, onClose }) {
  return (
    <div className="reminder-list" role="dialog" aria-label="All Reminders">
      <div className="reminder-list__header">
        <span className="reminder-list__title">सभी स्मरण / All Reminders</span>
        <button id="btn-close-reminders" className="reminder-list__close" onClick={onClose} aria-label="Close">×</button>
      </div>

      {reminders.length === 0 ? (
        <div className="reminder-list__empty">
          <span className="reminder-list__empty-icon">🔔</span>
          <p>No reminders set yet.</p>
          <p className="reminder-list__empty-hint">Add a reminder to get notified on Ekadashi, Purnima, or any day you choose.</p>
        </div>
      ) : (
        <ul className="reminder-list__items">
          {reminders.map(r => (
            <li key={r.id} className="reminder-list__item">
              <div className="reminder-list__item-info">
                <div className="reminder-list__item-reason">{r.reason}</div>
                <div className="reminder-list__item-meta">
                  {r.type === 'tithi' ? (
                    <>
                      {r.recurring ? 'Every ' : 'One-time · '}
                      {r.paksha === 'Both' ? 'Shukla+Krishna' : r.paksha} {r.tithiName}
                    </>
                  ) : (
                    <>
                      {r.recurring
                        ? `Every ${DAYS_EN[r.dayOfWeek]}`
                        : `One-time · ${new Date(r.date + 'T00:00:00').toLocaleDateString()}`}
                    </>
                  )}
                  {r.recurring && (
                    <span className="reminder-list__badge reminder-list__badge--recurring">Recurring</span>
                  )}
                </div>
              </div>
              <button
                id={`btn-delete-reminder-${r.id}`}
                className="reminder-list__delete"
                onClick={() => onDelete(r.id)}
                aria-label={`Delete reminder: ${r.reason}`}
              >
                <i className="ti ti-trash" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

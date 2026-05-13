import { MONTHS_EN, HINDI_MONTHS, matchesReminder } from '../../utils/tithi'
import './TodayBar.css'

export default function TodayBar({ today, todayTithi, reminders }) {
  const todayReminders = reminders.filter(r => matchesReminder(today, todayTithi, r))

  return (
    <div className="today-bar">
      {/* Date block */}
      <div className="today-bar__block">
        <div className="today-bar__label">आज / Today</div>
        <div className="today-bar__value">
          {today.getDate()} {MONTHS_EN[today.getMonth()]} {today.getFullYear()}
        </div>
        <div className="today-bar__sub">
          {today.getDate()} {HINDI_MONTHS[today.getMonth()]}
        </div>
      </div>

      {/* Divider */}
      <div className="today-bar__divider" />

      {/* Tithi block */}
      <div className="today-bar__block">
        <div className="today-bar__label">तिथि / Tithi</div>
        <div className="today-bar__value">{todayTithi?.hindi}</div>
        <div className="today-bar__sub">{todayTithi?.paksha} {todayTithi?.name}</div>
      </div>

      {/* Today's reminders */}
      {todayReminders.length > 0 && (
        <>
          <div className="today-bar__divider" />
          <div className="today-bar__block today-bar__block--reminders">
            <div className="today-bar__label">आज के स्मरण</div>
            {todayReminders.map(r => (
              <div key={r.id} className="today-bar__reminder">
                🔔 {r.reason}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Moon phase badge */}
      {todayTithi && (
        <div className="today-bar__moon">
          {todayTithi.name === 'Purnima'  && <span title="Purnima">🌕</span>}
          {todayTithi.name === 'Amavasya' && <span title="Amavasya">🌑</span>}
          {todayTithi.name === 'Ekadashi' && <span title="Ekadashi">☽</span>}
        </div>
      )}
    </div>
  )
}

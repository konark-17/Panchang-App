import { matchesReminder } from '../../utils/tithi'
import './Calendar.css'

const DAYS_EN   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const HINDI_DAYS = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि']

export default function CalendarCell({ date, panchangDay, reminders, isToday, isSelected, onClick }) {
  if (!date) return <div className="cal-cell cal-cell--empty" aria-hidden="true" />

  const tithi = panchangDay?.tithi
  const dayReminders = reminders.filter(r =>
    panchangDay ? matchesReminder(date, panchangDay.tithi, r) : false
  )
  const isSunSat  = date.getDay() === 0 || date.getDay() === 6
  const isPurnima = tithi?.name === 'Purnima'
  const isAmavasya= tithi?.name === 'Amavasya'
  const isEkadashi= tithi?.name === 'Ekadashi'

  return (
    <div
      className={[
        'cal-cell',
        isToday    ? 'cal-cell--today'    : '',
        isSelected ? 'cal-cell--selected' : '',
        isSunSat   ? 'cal-cell--weekend'  : '',
      ].filter(Boolean).join(' ')}
      onClick={() => onClick(date)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick(date)}
      aria-label={`${date.getDate()} ${tithi?.name ?? ''}`}
      aria-pressed={isSelected}
    >
      {/* Reminder dots */}
      {dayReminders.length > 0 && (
        <div className="cal-cell__dots">
          {dayReminders.slice(0, 3).map((_, i) => (
            <span key={i} className="reminder-dot" />
          ))}
        </div>
      )}

      {/* Date number */}
      <div className="cal-cell__date">{date.getDate()}</div>

      {/* Tithi */}
      {tithi && (
        <div className="cal-cell__tithi">{tithi.hindi}</div>
      )}

      {/* Special icon */}
      {(isPurnima || isAmavasya || isEkadashi) && (
        <div className="cal-cell__moon">
          {isPurnima ? '🌕' : isAmavasya ? '🌑' : '☽'}
        </div>
      )}
    </div>
  )
}

export function CalendarHeader() {
  return (
    <div className="cal-header">
      {DAYS_EN.map((d, i) => (
        <div key={d} className={`cal-header__cell ${i === 0 || i === 6 ? 'cal-header__cell--weekend' : ''}`}>
          {d}
          <span className="cal-header__hindi">{HINDI_DAYS[i]}</span>
        </div>
      ))}
    </div>
  )
}

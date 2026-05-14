import { MONTHS_EN, HINDI_MONTHS } from '../../utils/tithi'
import './Header.css'

export default function Header({ reminders, currentMonth, currentYear, onPrev, onNext, onShowReminders, onAddReminder, onShowSettings }) {
  return (
    <header className="header">
      <div className="header__brand">
        <div className="header__title gradient-text">पंचांग</div>
        <div className="header__subtitle">
          Panchang Calendar &mdash; {MONTHS_EN[currentMonth]} {currentYear}
        </div>
      </div>

      <nav className="header__nav" aria-label="Month navigation">
        <button id="btn-prev-month" onClick={onPrev} aria-label="Previous month" className="header__nav-btn">‹</button>
        <div className="header__month-label">
          <span>{MONTHS_EN[currentMonth]} {currentYear}</span>
          <span className="header__month-hindi">{HINDI_MONTHS[currentMonth]}</span>
        </div>
        <button id="btn-next-month" onClick={onNext} aria-label="Next month" className="header__nav-btn">›</button>
      </nav>

      <div className="header__actions">
        <button id="btn-show-reminders" onClick={onShowReminders} className="header__btn">
          <i className="ti ti-bell" aria-hidden="true" />
          <span>याद ({reminders.length})</span>
        </button>
        <button id="btn-show-settings" onClick={onShowSettings} className="header__btn" aria-label="Settings" title="Settings">
          <i className="ti ti-settings" aria-hidden="true" />
          <span>Settings</span>
        </button>
        <button id="btn-add-reminder" onClick={onAddReminder} className="header__btn header__btn--primary">
          <i className="ti ti-plus" aria-hidden="true" />
          <span>Add Reminder</span>
        </button>
      </div>
    </header>
  )
}

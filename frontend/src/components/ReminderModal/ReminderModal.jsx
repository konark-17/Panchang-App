import { useState } from 'react'
import { UNIQUE_TITHI_NAMES, DAYS_EN, HINDI_DAYS } from '../../utils/tithi'
import './ReminderModal.css'

const DEFAULT_FORM = {
  type: 'tithi',
  reason: '',
  tithiName: 'Ekadashi',
  paksha: 'Shukla',
  dayOfWeek: 0,
  recurring: true,
  date: new Date().toISOString().slice(0, 10),
}

export default function ReminderModal({ selectedDate, onSave, onClose }) {
  const [form, setForm] = useState({
    ...DEFAULT_FORM,
    date: selectedDate ? selectedDate.toISOString().slice(0, 10) : DEFAULT_FORM.date,
  })

  const set = patch => setForm(f => ({ ...f, ...patch }))

  function handleSave() {
    if (!form.reason.trim()) return
    onSave(form, selectedDate)
    setForm(DEFAULT_FORM)
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Add Reminder">
      <div className="modal-dialog">
        {/* Modal header */}
        <div className="modal__header">
          <div className="modal__title">नया स्मरण / New Reminder</div>
          <button id="btn-modal-close" className="modal__close" onClick={onClose} aria-label="Close">×</button>
        </div>

        {/* Reason */}
        <label className="modal__label">कारण / Reason *</label>
        <input
          id="input-reminder-reason"
          type="text"
          placeholder="e.g. Ekadashi fast, Puja, Birthday..."
          value={form.reason}
          onChange={e => set({ reason: e.target.value })}
          autoFocus
        />

        {/* Type selector */}
        <label className="modal__label" style={{ marginTop: '1rem' }}>किस पर? / Reminder type</label>
        <div className="modal__type-grid">
          {[['tithi', 'तिथि (Tithi)', '🌙'], ['day', 'दिन (Day/Date)', '📅']].map(([val, label, icon]) => (
            <button
              key={val}
              id={`btn-type-${val}`}
              className={`modal__type-btn ${form.type === val ? 'modal__type-btn--active' : ''}`}
              onClick={() => set({ type: val })}
            >
              <span className="modal__type-icon">{icon}</span>
              {label}
            </button>
          ))}
        </div>

        {/* ─── Tithi fields ─── */}
        {form.type === 'tithi' && (
          <>
            <div className="modal__row">
              <div className="modal__field">
                <label className="modal__label">तिथि</label>
                <select id="select-tithi" value={form.tithiName} onChange={e => set({ tithiName: e.target.value })}>
                  {UNIQUE_TITHI_NAMES.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="modal__field">
                <label className="modal__label">पक्ष / Paksha</label>
                <div className="modal__paksha-grid">
                  {[
                    { val: 'Shukla',  label: 'Shukla',  hindi: 'शुक्ल', icon: '🌕' },
                    { val: 'Krishna', label: 'Krishna', hindi: 'कृष्ण', icon: '🌑' },
                    { val: 'Both',    label: 'Both',    hindi: 'दोनों', icon: '☯' },
                  ].map(({ val, label, hindi, icon }) => (
                    <button
                      key={val}
                      id={`btn-paksha-${val.toLowerCase()}`}
                      className={`modal__paksha-btn ${form.paksha === val ? 'modal__paksha-btn--active' : ''}`}
                      onClick={() => set({ paksha: val })}
                    >
                      <span>{icon}</span>
                      <span>{label}</span>
                      <span className="modal__paksha-hindi">{hindi}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recurring */}
            <RecurringToggle
              recurring={form.recurring}
              onChange={v => set({ recurring: v })}
              labelYes={`Every ${form.tithiName}`}
              labelNo="Only this time"
            />
          </>
        )}

        {/* ─── Day fields ─── */}
        {form.type === 'day' && (
          <>
            <RecurringToggle
              recurring={form.recurring}
              onChange={v => set({ recurring: v })}
              labelYes="Every week (day)"
              labelNo="Specific date"
            />

            {form.recurring ? (
              <>
                <label className="modal__label" style={{ marginTop: '0.75rem' }}>वार / Day of week</label>
                <div className="modal__days-grid">
                  {DAYS_EN.map((d, i) => (
                    <button
                      key={d}
                      id={`btn-day-${d.toLowerCase()}`}
                      className={`modal__day-btn ${form.dayOfWeek === i ? 'modal__day-btn--active' : ''}`}
                      onClick={() => set({ dayOfWeek: i })}
                    >
                      {d}
                      <span className="modal__day-hindi">{HINDI_DAYS[i]}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <label className="modal__label" style={{ marginTop: '0.75rem' }}>तारीख / Date</label>
                <input
                  id="input-reminder-date"
                  type="date"
                  value={form.date}
                  onChange={e => set({ date: e.target.value })}
                />
              </>
            )}
          </>
        )}

        {/* Actions */}
        <div className="modal__actions">
          <button id="btn-modal-cancel" className="modal__cancel" onClick={onClose}>रद्द / Cancel</button>
          <button
            id="btn-modal-save"
            className="modal__save"
            onClick={handleSave}
            disabled={!form.reason.trim()}
          >
            <i className="ti ti-check" aria-hidden="true" />
            स्मरण जोड़ें / Save
          </button>
        </div>
      </div>
    </div>
  )
}

function RecurringToggle({ recurring, onChange, labelYes, labelNo }) {
  return (
    <div className="modal__recurring">
      <div className="modal__recurring-title">हर बार याद दिलाएं? / Recurring?</div>
      <div className="modal__recurring-btns">
        <button
          id="btn-recurring-yes"
          className={`modal__recurring-btn ${recurring ? 'modal__recurring-btn--yes' : ''}`}
          onClick={() => onChange(true)}
        >
          <i className="ti ti-repeat" aria-hidden="true" />
          {labelYes}
        </button>
        <button
          id="btn-recurring-no"
          className={`modal__recurring-btn ${!recurring ? 'modal__recurring-btn--no' : ''}`}
          onClick={() => onChange(false)}
        >
          <i className="ti ti-calendar-event" aria-hidden="true" />
          {labelNo}
        </button>
      </div>
    </div>
  )
}

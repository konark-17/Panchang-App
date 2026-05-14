import { playAlarmSound } from '../../hooks/useNotifications'
import './SettingsModal.css'

const RINGTONES = [
  { id: 'beep',  name: 'Beep',  desc: 'Standard digital alarm' },
  { id: 'chime', name: 'Chime', desc: 'Soft, bell-like repeating sound' },
  { id: 'pulse', name: 'Pulse', desc: 'Modern, rapid futuristic pulse' },
  { id: 'gong',  name: 'Gong',  desc: 'Deep, resonant single strike' },
]

export default function SettingsModal({ settings, updateSetting, onClose }) {
  const currentRingtone = settings.alarmRingtone || 'beep'

  const handlePreview = (id, e) => {
    e.stopPropagation()
    playAlarmSound(id)
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Settings">
      <div className="settings-modal-dialog">
        <div className="modal__header">
          <div className="modal__title">सेटिंग्स / Settings</div>
          <button id="btn-settings-close" className="modal__close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <label className="modal__label">Alarm Ringtone / अलार्म की आवाज़</label>
        <div className="settings__list">
          {RINGTONES.map(tone => (
            <div
              key={tone.id}
              className={`settings__option ${currentRingtone === tone.id ? 'settings__option--active' : ''}`}
              onClick={() => updateSetting('alarmRingtone', tone.id)}
            >
              <div className="settings__option-info">
                <span className="settings__option-name">{tone.name}</span>
                <span className="settings__option-desc">{tone.desc}</span>
              </div>
              <button
                className="settings__play-btn"
                onClick={(e) => handlePreview(tone.id, e)}
                onMouseEnter={(e) => handlePreview(tone.id, e)}
                aria-label={`Preview ${tone.name}`}
                title="Play Preview"
              >
                <i className="ti ti-player-play-filled" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>

        <div className="modal__actions" style={{ marginTop: 'auto' }}>
          <button id="btn-settings-save" className="modal__save" onClick={onClose} style={{ flex: 1 }}>
            <i className="ti ti-check" aria-hidden="true" />
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect, useCallback } from "react";
import "./panchang.css";

// ─── Tithi Calculation Engine ────────────────────────────────────────────────
// Approximation of Hindu lunar calendar tithi
function getSunLongitude(jd) {
  const n = jd - 2451545.0;
  const L = (280.46 + 0.9856474 * n) % 360;
  const g = ((357.528 + 0.9856003 * n) % 360) * (Math.PI / 180);
  return (L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g) + 360) % 360;
}

function getMoonLongitude(jd) {
  const n = jd - 2451545.0;
  const L = (218.316 + 13.176396 * n) % 360;
  const M = ((134.963 + 13.064993 * n) % 360) * (Math.PI / 180);
  const F = ((93.272 + 13.229350 * n) % 360) * (Math.PI / 180);
  return (L + 6.289 * Math.sin(M) - 1.274 * Math.sin(2 * F - M) + 0.658 * Math.sin(2 * F) - 0.214 * Math.sin(2 * M) + 360) % 360;
}

function dateToJD(date) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return 367 * y - Math.floor(7 * (y + Math.floor((m + 9) / 12)) / 4) + Math.floor(275 * m / 9) + d + 1721013.5;
}

function getTithiForDate(date) {
  const jd = dateToJD(date);
  const sun = getSunLongitude(jd);
  const moon = getMoonLongitude(jd);
  let diff = (moon - sun + 360) % 360;
  const tithiIndex = Math.floor(diff / 12); // 0-29
  return tithiIndex;
}

const TITHIS = [
  { name: "Pratipada", hindi: "प्रतिपदा", num: 1, paksha: "Shukla" },
  { name: "Dwitiya", hindi: "द्वितीया", num: 2, paksha: "Shukla" },
  { name: "Tritiya", hindi: "तृतीया", num: 3, paksha: "Shukla" },
  { name: "Chaturthi", hindi: "चतुर्थी", num: 4, paksha: "Shukla" },
  { name: "Panchami", hindi: "पंचमी", num: 5, paksha: "Shukla" },
  { name: "Shashthi", hindi: "षष्ठी", num: 6, paksha: "Shukla" },
  { name: "Saptami", hindi: "सप्तमी", num: 7, paksha: "Shukla" },
  { name: "Ashtami", hindi: "अष्टमी", num: 8, paksha: "Shukla" },
  { name: "Navami", hindi: "नवमी", num: 9, paksha: "Shukla" },
  { name: "Dashami", hindi: "दशमी", num: 10, paksha: "Shukla" },
  { name: "Ekadashi", hindi: "एकादशी", num: 11, paksha: "Shukla" },
  { name: "Dwadashi", hindi: "द्वादशी", num: 12, paksha: "Shukla" },
  { name: "Trayodashi", hindi: "त्रयोदशी", num: 13, paksha: "Shukla" },
  { name: "Chaturdashi", hindi: "चतुर्दशी", num: 14, paksha: "Shukla" },
  { name: "Purnima", hindi: "पूर्णिमा", num: 15, paksha: "Shukla" },
  { name: "Pratipada", hindi: "प्रतिपदा", num: 1, paksha: "Krishna" },
  { name: "Dwitiya", hindi: "द्वितीया", num: 2, paksha: "Krishna" },
  { name: "Tritiya", hindi: "तृतीया", num: 3, paksha: "Krishna" },
  { name: "Chaturthi", hindi: "चतुर्थी", num: 4, paksha: "Krishna" },
  { name: "Panchami", hindi: "पंचमी", num: 5, paksha: "Krishna" },
  { name: "Shashthi", hindi: "षष्ठी", num: 6, paksha: "Krishna" },
  { name: "Saptami", hindi: "सप्तमी", num: 7, paksha: "Krishna" },
  { name: "Ashtami", hindi: "अष्टमी", num: 8, paksha: "Krishna" },
  { name: "Navami", hindi: "नवमी", num: 9, paksha: "Krishna" },
  { name: "Dashami", hindi: "दशमी", num: 10, paksha: "Krishna" },
  { name: "Ekadashi", hindi: "एकादशी", num: 11, paksha: "Krishna" },
  { name: "Dwadashi", hindi: "द्वादशी", num: 12, paksha: "Krishna" },
  { name: "Trayodashi", hindi: "त्रयोदशी", num: 13, paksha: "Krishna" },
  { name: "Chaturdashi", hindi: "चतुर्दशी", num: 14, paksha: "Krishna" },
  { name: "Amavasya", hindi: "अमावस्या", num: 15, paksha: "Krishna" },
];

const HINDI_DAYS = ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"];
const HINDI_MONTHS = ["जनवरी","फरवरी","मार्च","अप्रैल","मई","जून","जुलाई","अगस्त","सितंबर","अक्टूबर","नवंबर","दिसंबर"];
const MONTHS_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS_EN = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// ─── Storage helpers ──────────────────────────────────────────────────────────
function loadReminders() {
  try {
    return JSON.parse(localStorage.getItem("panchang_reminders") || "[]");
  } catch { return []; }
}
function saveReminders(r) {
  localStorage.setItem("panchang_reminders", JSON.stringify(r));
}

// ─── Reminder matching ────────────────────────────────────────────────────────
function matchesReminder(date, tithi, reminder) {
  if (reminder.type === "tithi") {
    if (reminder.recurring) {
      const nameMatch = tithi.name === reminder.tithiName;
      const pakshaMatch = reminder.paksha === "Both" || tithi.paksha === reminder.paksha;
      return nameMatch && pakshaMatch;
    } else {
      const d = new Date(reminder.date);
      return d.toDateString() === date.toDateString();
    }
  } else {
    if (reminder.recurring) {
      return date.getDay() === reminder.dayOfWeek;
    } else {
      const d = new Date(reminder.date);
      return d.toDateString() === date.toDateString();
    }
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TithiCalendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [reminders, setReminders] = useState(loadReminders);
  const [selectedDate, setSelectedDate] = useState(today);
  const [showModal, setShowModal] = useState(false);
  const [showReminderList, setShowReminderList] = useState(false);
  const [activeTab, setActiveTab] = useState("calendar");

  // Reminder form state
  const [form, setForm] = useState({
    type: "tithi",
    reason: "",
    tithiName: "Ekadashi",
    paksha: "Shukla",
    dayOfWeek: 0,
    recurring: true,
    date: today.toISOString().slice(0, 10),
  });

  useEffect(() => { saveReminders(reminders); }, [reminders]);

  // Build calendar days
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const calCells = [];
  for (let i = 0; i < firstDay; i++) calCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calCells.push(new Date(currentYear, currentMonth, d));

  function getDayReminders(date) {
    if (!date) return [];
    const tithi = TITHIS[getTithiForDate(date)];
    return reminders.filter(r => matchesReminder(date, tithi, r));
  }

  function addReminder() {
    if (!form.reason.trim()) return;
    const newR = {
      id: Date.now(),
      ...form,
      date: form.type === "tithi" && form.recurring ? null : form.date,
    };
    if (form.type === "tithi" && !form.recurring) {
      newR.date = selectedDate.toISOString().slice(0, 10);
    }
    if (form.type === "day" && !form.recurring) {
      newR.date = form.date;
    }
    setReminders(prev => [...prev, newR]);
    setShowModal(false);
    setForm({ type: "tithi", reason: "", tithiName: "Ekadashi", paksha: "Shukla", dayOfWeek: 0, recurring: true, date: today.toISOString().slice(0, 10) });
  }

  function deleteReminder(id) {
    setReminders(prev => prev.filter(r => r.id !== id));
  }

  const selectedTithi = TITHIS[getTithiForDate(selectedDate)];
  const selectedReminders = getDayReminders(selectedDate);
  const todayTithi = TITHIS[getTithiForDate(today)];

  const uniqueTithiNames = [...new Set(TITHIS.map(t => t.name))];

  return (
    <div style={{ fontFamily: "'Segoe UI', 'Noto Sans Devanagari', sans-serif", maxWidth: 760, margin: "0 auto", padding: "1rem" }}>
      <h2 className="sr-only">Hindu Panchang Tithi Calendar with Reminders</h2>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)" }}>पंचांग कैलेंडर</div>
          <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Panchang Calendar</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setShowReminderList(!showReminderList)}
            style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6, padding: "6px 14px" }}>
            <i className="ti ti-bell" style={{ fontSize: 16 }} aria-hidden="true" />
            याद ({reminders.length})
          </button>
          <button onClick={() => setShowModal(true)}
            style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6, padding: "6px 14px",
              background: "var(--color-background-info)", borderColor: "var(--color-border-info)", color: "var(--color-text-info)" }}>
            <i className="ti ti-plus" style={{ fontSize: 16 }} aria-hidden="true" />
            Add Reminder
          </button>
        </div>
      </div>

      {/* Today's info bar */}
      <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)",
        padding: "12px 16px", marginBottom: "1rem", display: "flex", gap: 24, flexWrap: "wrap",
        border: "0.5px solid var(--color-border-tertiary)" }}>
        <div>
          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 2 }}>आज / Today</div>
          <div style={{ fontWeight: 500, fontSize: 15 }}>
            {today.getDate()} {MONTHS_EN[today.getMonth()]} {today.getFullYear()}
          </div>
          <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
            {today.getDate()} {HINDI_MONTHS[today.getMonth()]}
          </div>
        </div>
        <div style={{ borderLeft: "0.5px solid var(--color-border-tertiary)", paddingLeft: 24 }}>
          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 2 }}>तिथि / Tithi</div>
          <div style={{ fontWeight: 500, fontSize: 15 }}>{todayTithi.hindi}</div>
          <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{todayTithi.paksha} {todayTithi.name}</div>
        </div>
        {getDayReminders(today).length > 0 && (
          <div style={{ borderLeft: "0.5px solid var(--color-border-tertiary)", paddingLeft: 24 }}>
            <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 2 }}>आज के स्मरण</div>
            {getDayReminders(today).map(r => (
              <div key={r.id} style={{ fontSize: 13, color: "var(--color-text-warning)", fontWeight: 500 }}>
                🔔 {r.reason}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reminder List Panel */}
      {showReminderList && (
        <div style={{ background: "var(--color-background-primary)", borderRadius: "var(--border-radius-lg)",
          border: "0.5px solid var(--color-border-tertiary)", padding: "1rem", marginBottom: "1rem" }}>
          <div style={{ fontWeight: 500, marginBottom: "0.75rem", display: "flex", justifyContent: "space-between" }}>
            <span>सभी स्मरण / All Reminders</span>
            <button onClick={() => setShowReminderList(false)} style={{ border: "none", background: "none", cursor: "pointer", fontSize: 18, color: "var(--color-text-secondary)" }}>×</button>
          </div>
          {reminders.length === 0 && <div style={{ color: "var(--color-text-secondary)", fontSize: 14 }}>No reminders set yet.</div>}
          {reminders.map(r => (
            <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 12px", borderRadius: "var(--border-radius-md)", marginBottom: 8,
              background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)" }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{r.reason}</div>
                <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>
                  {r.type === "tithi" ? (
                    <>{r.recurring ? "Every " : "One-time · "}{r.paksha === "Both" ? "Shukla+Krishna" : r.paksha} {r.tithiName}</>
                  ) : (
                    <>{r.recurring ? `Every ${DAYS_EN[r.dayOfWeek]}` : `One-time · ${new Date(r.date).toLocaleDateString()}`}</>
                  )}
                  {r.recurring && <span style={{ marginLeft: 8, background: "var(--color-background-success)",
                    color: "var(--color-text-success)", fontSize: 10, padding: "1px 6px", borderRadius: 4 }}>Recurring</span>}
                </div>
              </div>
              <button onClick={() => deleteReminder(r.id)}
                style={{ border: "none", background: "none", cursor: "pointer", color: "var(--color-text-danger)", fontSize: 18, padding: "4px 8px" }}>
                <i className="ti ti-trash" style={{ fontSize: 16 }} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Month Navigation */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
        <button onClick={() => {
          if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
          else setCurrentMonth(m => m - 1);
        }} style={{ padding: "6px 12px", fontSize: 18 }}>‹</button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 500, fontSize: 16 }}>{MONTHS_EN[currentMonth]} {currentYear}</div>
          <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{HINDI_MONTHS[currentMonth]} {currentYear}</div>
        </div>
        <button onClick={() => {
          if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
          else setCurrentMonth(m => m + 1);
        }} style={{ padding: "6px 12px", fontSize: 18 }}>›</button>
      </div>

      {/* Calendar Grid */}
      <div style={{ background: "var(--color-background-primary)", borderRadius: "var(--border-radius-lg)",
        border: "0.5px solid var(--color-border-tertiary)", overflow: "hidden" }}>
        {/* Day headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
          {DAYS_EN.map((d, i) => (
            <div key={d} style={{ padding: "8px 4px", textAlign: "center", fontSize: 11,
              fontWeight: 500, color: i === 0 || i === 6 ? "var(--color-text-danger)" : "var(--color-text-secondary)" }}>
              {d} <br />
              <span style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{HINDI_DAYS[i]}</span>
            </div>
          ))}
        </div>

        {/* Calendar cells */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
          {calCells.map((date, idx) => {
            if (!date) return <div key={`empty-${idx}`} style={{ minHeight: 72, borderRight: "0.5px solid var(--color-border-tertiary)", borderBottom: "0.5px solid var(--color-border-tertiary)" }} />;

            const tithi = TITHIS[getTithiForDate(date)];
            const dayReminders = getDayReminders(date);
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const isSunSat = date.getDay() === 0 || date.getDay() === 6;
            const isPurnima = tithi.name === "Purnima";
            const isAmavasya = tithi.name === "Amavasya";
            const isEkadashi = tithi.name === "Ekadashi";

            return (
              <div key={date.toISOString()} onClick={() => setSelectedDate(date)}
                style={{
                  minHeight: 72, padding: "6px 6px 4px", cursor: "pointer",
                  borderRight: "0.5px solid var(--color-border-tertiary)",
                  borderBottom: "0.5px solid var(--color-border-tertiary)",
                  background: isSelected ? "var(--color-background-info)" : isToday ? "var(--color-background-success)" : "transparent",
                  transition: "background 0.15s",
                  position: "relative",
                }}>
                {/* Date number */}
                <div style={{
                  fontSize: 14, fontWeight: isToday ? 500 : 400,
                  color: isSunSat ? "var(--color-text-danger)" : isSelected ? "var(--color-text-info)" : "var(--color-text-primary)",
                  marginBottom: 2,
                }}>
                  {date.getDate()}
                </div>

                {/* Tithi */}
                <div style={{ fontSize: 10, color: isSelected ? "var(--color-text-info)" : "var(--color-text-secondary)", lineHeight: 1.3 }}>
                  {tithi.hindi}
                </div>

                {/* Special tithi dot */}
                {(isPurnima || isAmavasya || isEkadashi) && (
                  <div style={{ fontSize: 9, marginTop: 2,
                    color: isPurnima ? "var(--color-text-warning)" : isAmavasya ? "var(--color-text-secondary)" : "var(--color-text-success)" }}>
                    {isPurnima ? "🌕" : isAmavasya ? "🌑" : "☽"}
                  </div>
                )}

                {/* Reminder dots */}
                {dayReminders.length > 0 && (
                  <div style={{ position: "absolute", top: 4, right: 4, display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "flex-end" }}>
                    {dayReminders.slice(0, 3).map((_, i) => (
                      <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--color-text-danger)" }} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Panel */}
      <div style={{ marginTop: "1rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {/* Date info */}
        <div style={{ background: "var(--color-background-primary)", borderRadius: "var(--border-radius-lg)",
          border: "0.5px solid var(--color-border-tertiary)", padding: "1rem" }}>
          <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 8 }}>चुनी हुई तिथि / Selected Date</div>
          <div style={{ fontSize: 18, fontWeight: 500 }}>
            {selectedDate.getDate()} {MONTHS_EN[selectedDate.getMonth()]} {selectedDate.getFullYear()}
          </div>
          <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 12 }}>
            {selectedDate.getDate()} {HINDI_MONTHS[selectedDate.getMonth()]} {selectedDate.getFullYear()}
          </div>
          <div style={{ borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: 10 }}>
            <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 4 }}>तिथि</div>
            <div style={{ fontSize: 16, fontWeight: 500 }}>{selectedTithi.hindi}</div>
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{selectedTithi.paksha} {selectedTithi.name}</div>
          </div>
          <button onClick={() => setShowModal(true)}
            style={{ marginTop: 12, width: "100%", fontSize: 13, padding: "6px 0",
              background: "var(--color-background-info)", borderColor: "var(--color-border-info)", color: "var(--color-text-info)" }}>
            <i className="ti ti-plus" style={{ fontSize: 14, marginRight: 4 }} />
            Add Reminder for this day
          </button>
        </div>

        {/* Reminders for selected date */}
        <div style={{ background: "var(--color-background-primary)", borderRadius: "var(--border-radius-lg)",
          border: "0.5px solid var(--color-border-tertiary)", padding: "1rem" }}>
          <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 8 }}>
            स्मरण / Reminders ({selectedReminders.length})
          </div>
          {selectedReminders.length === 0 ? (
            <div style={{ color: "var(--color-text-tertiary)", fontSize: 13, marginTop: 8 }}>
              No reminders for this day.
            </div>
          ) : (
            selectedReminders.map(r => (
              <div key={r.id} style={{ background: "var(--color-background-warning)",
                borderRadius: "var(--border-radius-md)", padding: "8px 10px", marginBottom: 8,
                border: "0.5px solid var(--color-border-warning)" }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>🔔 {r.reason}</div>
                <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 2 }}>
                  {r.recurring ? "Recurring" : "One-time"} · {r.type === "tithi" ? `${r.paksha === "Both" ? "Shukla+Krishna" : r.paksha} ${r.tithiName}` : DAYS_EN[r.dayOfWeek]}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Legend */}
      <div style={{ marginTop: "0.75rem", display: "flex", gap: 16, flexWrap: "wrap", fontSize: 11, color: "var(--color-text-secondary)" }}>
        <span>🌕 Purnima</span>
        <span>🌑 Amavasya</span>
        <span>☽ Ekadashi</span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-text-danger)", display: "inline-block" }} /> Reminder
        </span>
        <span style={{ background: "var(--color-background-success)", padding: "1px 8px", borderRadius: 4 }}>Today</span>
        <span style={{ background: "var(--color-background-info)", padding: "1px 8px", borderRadius: 4 }}>Selected</span>
      </div>

      {/* Add Reminder Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "var(--color-background-primary)", borderRadius: "var(--border-radius-xl)",
            padding: "1.5rem", width: "min(480px, 95vw)", maxHeight: "90vh", overflowY: "auto",
            border: "0.5px solid var(--color-border-tertiary)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div style={{ fontWeight: 500, fontSize: 18 }}>नया स्मरण / New Reminder</div>
              <button onClick={() => setShowModal(false)}
                style={{ border: "none", background: "none", cursor: "pointer", fontSize: 22, color: "var(--color-text-secondary)", lineHeight: 1 }}>×</button>
            </div>

            {/* Reason */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>
                कारण / Reason *
              </label>
              <input type="text" placeholder="e.g. Ekadashi fast, Puja, Birthday..."
                value={form.reason}
                onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                style={{ width: "100%", boxSizing: "border-box" }} />
            </div>

            {/* Type selector */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>
                किस पर? / Reminder type
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[["tithi", "तिथि (Tithi)", "ti-moon"], ["day", "दिन (Day/Date)", "ti-calendar"]].map(([val, label, icon]) => (
                  <button key={val} onClick={() => setForm(f => ({ ...f, type: val }))}
                    style={{ padding: "10px", fontSize: 13, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                      background: form.type === val ? "var(--color-background-info)" : "transparent",
                      borderColor: form.type === val ? "var(--color-border-info)" : "var(--color-border-tertiary)",
                      color: form.type === val ? "var(--color-text-info)" : "var(--color-text-primary)" }}>
                    <i className={`ti ${icon}`} style={{ fontSize: 20 }} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tithi type inputs */}
            {form.type === "tithi" && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "1rem" }}>
                  <div>
                    <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>तिथि</label>
                    <select value={form.tithiName} onChange={e => setForm(f => ({ ...f, tithiName: e.target.value }))}
                      style={{ width: "100%" }}>
                      {uniqueTithiNames.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>पक्ष / Paksha</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>
                      {[
                        { val: "Shukla", label: "Shukla", hindi: "शुक्ल", icon: "🌕" },
                        { val: "Krishna", label: "Krishna", hindi: "कृष्ण", icon: "🌑" },
                        { val: "Both", label: "Both", hindi: "दोनों", icon: "☯" },
                      ].map(({ val, label, hindi, icon }) => (
                        <button key={val} onClick={() => setForm(f => ({ ...f, paksha: val }))}
                          style={{ padding: "7px 4px", fontSize: 11, display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                            background: form.paksha === val ? "var(--color-background-info)" : "transparent",
                            borderColor: form.paksha === val ? "var(--color-border-info)" : "var(--color-border-tertiary)",
                            color: form.paksha === val ? "var(--color-text-info)" : "var(--color-text-primary)",
                            borderRadius: "var(--border-radius-md)", cursor: "pointer" }}>
                          <span style={{ fontSize: 16 }}>{icon}</span>
                          <span style={{ fontWeight: form.paksha === val ? 500 : 400 }}>{label}</span>
                          <span style={{ fontSize: 10, color: form.paksha === val ? "var(--color-text-info)" : "var(--color-text-secondary)" }}>{hindi}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recurring question */}
                <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)",
                  padding: "1rem", marginBottom: "1rem", border: "0.5px solid var(--color-border-tertiary)" }}>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
                    हर बार याद दिलाएं? / Recurring reminder?
                  </div>
                  <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 10 }}>
                    Do you want to be reminded for every {form.paksha === "Both" ? `${form.tithiName} (Shukla & Krishna both)` : `${form.paksha} ${form.tithiName}`}, or just this once?
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <button onClick={() => setForm(f => ({ ...f, recurring: true }))}
                      style={{ padding: "8px", fontSize: 13,
                        background: form.recurring ? "var(--color-background-success)" : "transparent",
                        borderColor: form.recurring ? "var(--color-border-success)" : "var(--color-border-tertiary)",
                        color: form.recurring ? "var(--color-text-success)" : "var(--color-text-primary)" }}>
                      <i className="ti ti-repeat" style={{ fontSize: 16, marginRight: 6 }} />
                      Every {form.tithiName}
                    </button>
                    <button onClick={() => setForm(f => ({ ...f, recurring: false }))}
                      style={{ padding: "8px", fontSize: 13,
                        background: !form.recurring ? "var(--color-background-warning)" : "transparent",
                        borderColor: !form.recurring ? "var(--color-border-warning)" : "var(--color-border-tertiary)",
                        color: !form.recurring ? "var(--color-text-warning)" : "var(--color-text-primary)" }}>
                      <i className="ti ti-calendar-event" style={{ fontSize: 16, marginRight: 6 }} />
                      Only this time
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Day type inputs */}
            {form.type === "day" && (
              <>
                <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)",
                  padding: "1rem", marginBottom: "1rem", border: "0.5px solid var(--color-border-tertiary)" }}>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
                    हर बार याद दिलाएं? / Recurring?
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                    <button onClick={() => setForm(f => ({ ...f, recurring: true }))}
                      style={{ padding: "8px", fontSize: 13,
                        background: form.recurring ? "var(--color-background-success)" : "transparent",
                        borderColor: form.recurring ? "var(--color-border-success)" : "var(--color-border-tertiary)",
                        color: form.recurring ? "var(--color-text-success)" : "var(--color-text-primary)" }}>
                      <i className="ti ti-repeat" style={{ fontSize: 16, marginRight: 6 }} />
                      Every week (day)
                    </button>
                    <button onClick={() => setForm(f => ({ ...f, recurring: false }))}
                      style={{ padding: "8px", fontSize: 13,
                        background: !form.recurring ? "var(--color-background-warning)" : "transparent",
                        borderColor: !form.recurring ? "var(--color-border-warning)" : "var(--color-border-tertiary)",
                        color: !form.recurring ? "var(--color-text-warning)" : "var(--color-text-primary)" }}>
                      <i className="ti ti-calendar-event" style={{ fontSize: 16, marginRight: 6 }} />
                      Specific date
                    </button>
                  </div>
                </div>

                {form.recurring ? (
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>वार / Day of week</label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
                      {DAYS_EN.map((d, i) => (
                        <button key={d} onClick={() => setForm(f => ({ ...f, dayOfWeek: i }))}
                          style={{ padding: "6px 2px", fontSize: 11,
                            background: form.dayOfWeek === i ? "var(--color-background-info)" : "transparent",
                            borderColor: form.dayOfWeek === i ? "var(--color-border-info)" : "var(--color-border-tertiary)",
                            color: form.dayOfWeek === i ? "var(--color-text-info)" : "var(--color-text-primary)" }}>
                          {d}<br />
                          <span style={{ fontSize: 9 }}>{HINDI_DAYS[i]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>तारीख / Date</label>
                    <input type="date" value={form.date}
                      onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                      style={{ width: "100%", boxSizing: "border-box" }} />
                  </div>
                )}
              </>
            )}

            {/* Actions */}
            <div style={{ display: "flex", gap: 8, marginTop: "0.5rem" }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: "10px" }}>रद्द / Cancel</button>
              <button onClick={addReminder} disabled={!form.reason.trim()}
                style={{ flex: 2, padding: "10px", fontSize: 14,
                  background: form.reason.trim() ? "var(--color-background-info)" : "var(--color-background-secondary)",
                  borderColor: form.reason.trim() ? "var(--color-border-info)" : "var(--color-border-tertiary)",
                  color: form.reason.trim() ? "var(--color-text-info)" : "var(--color-text-tertiary)",
                  cursor: form.reason.trim() ? "pointer" : "not-allowed" }}>
                <i className="ti ti-check" style={{ fontSize: 16, marginRight: 6 }} />
                स्मरण जोड़ें / Save Reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
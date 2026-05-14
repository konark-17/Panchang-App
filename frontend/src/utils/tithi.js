// Tithi definitions and reminder matching logic shared across the app

export const TITHIS = [
  { index: 0,  name: "Pratipada",  hindi: "प्रतिपदा",  paksha: "Shukla", num: 1 },
  { index: 1,  name: "Dwitiya",    hindi: "द्वितीया",   paksha: "Shukla", num: 2 },
  { index: 2,  name: "Tritiya",    hindi: "तृतीया",     paksha: "Shukla", num: 3 },
  { index: 3,  name: "Chaturthi",  hindi: "चतुर्थी",    paksha: "Shukla", num: 4 },
  { index: 4,  name: "Panchami",   hindi: "पंचमी",      paksha: "Shukla", num: 5 },
  { index: 5,  name: "Shashthi",   hindi: "षष्ठी",      paksha: "Shukla", num: 6 },
  { index: 6,  name: "Saptami",    hindi: "सप्तमी",     paksha: "Shukla", num: 7 },
  { index: 7,  name: "Ashtami",    hindi: "अष्टमी",     paksha: "Shukla", num: 8 },
  { index: 8,  name: "Navami",     hindi: "नवमी",       paksha: "Shukla", num: 9 },
  { index: 9,  name: "Dashami",    hindi: "दशमी",       paksha: "Shukla", num: 10 },
  { index: 10, name: "Ekadashi",   hindi: "एकादशी",     paksha: "Shukla", num: 11 },
  { index: 11, name: "Dwadashi",   hindi: "द्वादशी",    paksha: "Shukla", num: 12 },
  { index: 12, name: "Trayodashi", hindi: "त्रयोदशी",   paksha: "Shukla", num: 13 },
  { index: 13, name: "Chaturdashi",hindi: "चतुर्दशी",   paksha: "Shukla", num: 14 },
  { index: 14, name: "Purnima",    hindi: "पूर्णिमा",   paksha: "Shukla", num: 15 },
  { index: 15, name: "Pratipada",  hindi: "प्रतिपदा",   paksha: "Krishna", num: 1 },
  { index: 16, name: "Dwitiya",    hindi: "द्वितीया",   paksha: "Krishna", num: 2 },
  { index: 17, name: "Tritiya",    hindi: "तृतीया",     paksha: "Krishna", num: 3 },
  { index: 18, name: "Chaturthi",  hindi: "चतुर्थी",    paksha: "Krishna", num: 4 },
  { index: 19, name: "Panchami",   hindi: "पंचमी",      paksha: "Krishna", num: 5 },
  { index: 20, name: "Shashthi",   hindi: "षष्ठी",      paksha: "Krishna", num: 6 },
  { index: 21, name: "Saptami",    hindi: "सप्तमी",     paksha: "Krishna", num: 7 },
  { index: 22, name: "Ashtami",    hindi: "अष्टमी",     paksha: "Krishna", num: 8 },
  { index: 23, name: "Navami",     hindi: "नवमी",       paksha: "Krishna", num: 9 },
  { index: 24, name: "Dashami",    hindi: "दशमी",       paksha: "Krishna", num: 10 },
  { index: 25, name: "Ekadashi",   hindi: "एकादशी",     paksha: "Krishna", num: 11 },
  { index: 26, name: "Dwadashi",   hindi: "द्वादशी",    paksha: "Krishna", num: 12 },
  { index: 27, name: "Trayodashi", hindi: "त्रयोदशी",   paksha: "Krishna", num: 13 },
  { index: 28, name: "Chaturdashi",hindi: "चतुर्दशी",   paksha: "Krishna", num: 14 },
  { index: 29, name: "Amavasya",   hindi: "अमावस्या",   paksha: "Krishna", num: 15 },
]

export const HINDI_DAYS = ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"]
export const DAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
export const HINDI_MONTHS = [
  "जनवरी","फरवरी","मार्च","अप्रैल","मई","जून",
  "जुलाई","अगस्त","सितंबर","अक्टूबर","नवंबर","दिसंबर"
]
export const MONTHS_EN = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
]

/** Returns true if a reminder matches a given date + tithi */
export function matchesReminder(date, tithi, reminder) {
  if (reminder.type === "tithi") {
    if (reminder.recurring) {
      let nameMatch = tithi.name === reminder.tithiName
      
      if (reminder.tithiName === 'Budhashtami') {
        nameMatch = tithi.name === 'Ashtami' && date.getDay() === 3
      }

      const pakshaMatch = reminder.paksha === "Both" || tithi.paksha === reminder.paksha
      return nameMatch && pakshaMatch
    } else {
      const d = new Date(reminder.date + 'T00:00:00')
      return d.toDateString() === date.toDateString()
    }
  } else {
    if (reminder.recurring) {
      return date.getDay() === reminder.dayOfWeek
    } else {
      const d = new Date(reminder.date + 'T00:00:00')
      return d.toDateString() === date.toDateString()
    }
  }
}

/** Get unique tithi names for the dropdown */
export const UNIQUE_TITHI_NAMES = [...new Set(TITHIS.map(t => t.name)), 'Budhashtami']

/** Get YYYY-MM-DD from a local Date object without timezone shifting bugs */
export function getLocalISODate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

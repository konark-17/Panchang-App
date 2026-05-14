package calculator

import (
	"math"
	"time"

	"panchang/models"
)

// All 30 tithis in order (Shukla 1–15, Krishna 1–15)
var tithiList = []models.Tithi{
	{0, "Pratipada", "प्रतिपदा", "Shukla", 1},
	{1, "Dwitiya", "द्वितीया", "Shukla", 2},
	{2, "Tritiya", "तृतीया", "Shukla", 3},
	{3, "Chaturthi", "चतुर्थी", "Shukla", 4},
	{4, "Panchami", "पंचमी", "Shukla", 5},
	{5, "Shashthi", "षष्ठी", "Shukla", 6},
	{6, "Saptami", "सप्तमी", "Shukla", 7},
	{7, "Ashtami", "अष्टमी", "Shukla", 8},
	{8, "Navami", "नवमी", "Shukla", 9},
	{9, "Dashami", "दशमी", "Shukla", 10},
	{10, "Ekadashi", "एकादशी", "Shukla", 11},
	{11, "Dwadashi", "द्वादशी", "Shukla", 12},
	{12, "Trayodashi", "त्रयोदशी", "Shukla", 13},
	{13, "Chaturdashi", "चतुर्दशी", "Shukla", 14},
	{14, "Purnima", "पूर्णिमा", "Shukla", 15},
	{15, "Pratipada", "प्रतिपदा", "Krishna", 1},
	{16, "Dwitiya", "द्वितीया", "Krishna", 2},
	{17, "Tritiya", "तृतीया", "Krishna", 3},
	{18, "Chaturthi", "चतुर्थी", "Krishna", 4},
	{19, "Panchami", "पंचमी", "Krishna", 5},
	{20, "Shashthi", "षष्ठी", "Krishna", 6},
	{21, "Saptami", "सप्तमी", "Krishna", 7},
	{22, "Ashtami", "अष्टमी", "Krishna", 8},
	{23, "Navami", "नवमी", "Krishna", 9},
	{24, "Dashami", "दशमी", "Krishna", 10},
	{25, "Ekadashi", "एकादशी", "Krishna", 11},
	{26, "Dwadashi", "द्वादशी", "Krishna", 12},
	{27, "Trayodashi", "त्रयोदशी", "Krishna", 13},
	{28, "Chaturdashi", "चतुर्दशी", "Krishna", 14},
	{29, "Amavasya", "अमावस्या", "Krishna", 15},
}

// dateToJD converts a date to Julian Day Number
func dateToJD(t time.Time) float64 {
	y := float64(t.Year())
	m := float64(t.Month())
	d := float64(t.Day())
	h := float64(t.Hour())
	min := float64(t.Minute())
	sec := float64(t.Second())
	fractionalDay := (h + min/60.0 + sec/3600.0) / 24.0

	return 367*y -
		math.Floor(7*(y+math.Floor((m+9)/12))/4) +
		math.Floor(275*m/9) +
		d + 1721013.5 + fractionalDay
}

// getSunLongitude returns the ecliptic longitude of the Sun (degrees)
func getSunLongitude(jd float64) float64 {
	n := jd - 2451545.0
	L := math.Mod(280.46+0.9856474*n, 360)
	g := math.Mod(357.528+0.9856003*n, 360) * math.Pi / 180
	return math.Mod(L+1.915*math.Sin(g)+0.02*math.Sin(2*g)+360, 360)
}

// getMoonLongitude returns the ecliptic longitude of the Moon (degrees)
func getMoonLongitude(jd float64) float64 {
	n := jd - 2451545.0
	L := math.Mod(218.316+13.176396*n, 360)
	M := math.Mod(134.963+13.064993*n, 360) * math.Pi / 180
	F := math.Mod(93.272+13.229350*n, 360) * math.Pi / 180
	return math.Mod(
		L+6.289*math.Sin(M)-1.274*math.Sin(2*F-M)+
			0.658*math.Sin(2*F)-0.214*math.Sin(2*M)+360,
		360,
	)
}

// GetTithi returns the tithi for a given date
func GetTithi(t time.Time) models.Tithi {
	jd := dateToJD(t)
	sun := getSunLongitude(jd)
	moon := getMoonLongitude(jd)
	diff := math.Mod(moon-sun+360, 360)
	idx := int(diff / 12) // 0–29
	if idx >= len(tithiList) {
		idx = len(tithiList) - 1
	}
	return tithiList[idx]
}

// GetPanchangDay returns the full panchang for a given date
func GetPanchangDay(t time.Time) models.PanchangDay {
	tithi := GetTithi(t)
	return models.PanchangDay{
		Date:       t.Format("2006-01-02"),
		Tithi:      tithi,
		IsPurnima:  tithi.Name == "Purnima",
		IsAmavasya: tithi.Name == "Amavasya",
		IsEkadashi: tithi.Name == "Ekadashi",
		DayOfWeek:  int(t.Weekday()),
	}
}

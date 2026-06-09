package models

// Tithi represents a single Hindu lunar day
type Tithi struct {
	Index  int    `json:"index"`
	Name   string `json:"name"`
	Hindi  string `json:"hindi"`
	Paksha string `json:"paksha"`
	Num    int    `json:"num"`
}

// Nakshatra represents the lunar mansion (one of 27) for a given day
type Nakshatra struct {
	Index int    `json:"index"`
	Name  string `json:"name"`
	Hindi string `json:"hindi"`
}

// PanchangDay holds all panchang data for one calendar day
type PanchangDay struct {
	Date       string    `json:"date"`
	Tithi      Tithi     `json:"tithi"`
	Nakshatra  Nakshatra `json:"nakshatra"`
	Var        string    `json:"var"`        // Hindi weekday name
	IsPurnima  bool      `json:"isPurnima"`
	IsAmavasya bool      `json:"isAmavasya"`
	IsEkadashi bool      `json:"isEkadashi"`
	DayOfWeek  int       `json:"dayOfWeek"` // 0=Sunday
}

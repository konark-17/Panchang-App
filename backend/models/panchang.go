package models

// Tithi represents a single Hindu lunar day
type Tithi struct {
	Index  int    `json:"index"`
	Name   string `json:"name"`
	Hindi  string `json:"hindi"`
	Paksha string `json:"paksha"`
	Num    int    `json:"num"`
}

// PanchangDay holds all panchang data for one calendar day
type PanchangDay struct {
	Date       string `json:"date"`
	Tithi      Tithi  `json:"tithi"`
	IsPurnima  bool   `json:"isPurnima"`
	IsAmavasya bool   `json:"isAmavasya"`
	IsEkadashi bool   `json:"isEkadashi"`
	DayOfWeek  int    `json:"dayOfWeek"`  // 0=Sunday
}

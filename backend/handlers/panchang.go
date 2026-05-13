package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"panchang/calculator"
	"panchang/models"
)

// GetDay handles GET /api/panchang/day?date=YYYY-MM-DD
func GetDay(w http.ResponseWriter, r *http.Request) {
	dateStr := r.URL.Query().Get("date")
	t, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		http.Error(w, `{"error":"invalid date, use YYYY-MM-DD"}`, http.StatusBadRequest)
		return
	}
	day := calculator.GetPanchangDay(t)
	writeJSON(w, day)
}

// GetMonth handles GET /api/panchang/month?year=YYYY&month=M
func GetMonth(w http.ResponseWriter, r *http.Request) {
	yearStr := r.URL.Query().Get("year")
	monthStr := r.URL.Query().Get("month")

	year, err1 := strconv.Atoi(yearStr)
	month, err2 := strconv.Atoi(monthStr)
	if err1 != nil || err2 != nil || month < 1 || month > 12 {
		http.Error(w, `{"error":"invalid year or month"}`, http.StatusBadRequest)
		return
	}

	daysInMonth := time.Date(year, time.Month(month+1), 0, 0, 0, 0, 0, time.UTC).Day()
	days := make([]models.PanchangDay, 0, daysInMonth)

	for d := 1; d <= daysInMonth; d++ {
		t := time.Date(year, time.Month(month), d, 0, 0, 0, 0, time.UTC)
		days = append(days, calculator.GetPanchangDay(t))
	}

	writeJSON(w, days)
}

func writeJSON(w http.ResponseWriter, v any) {
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(v); err != nil {
		http.Error(w, `{"error":"encoding failed"}`, http.StatusInternalServerError)
	}
}

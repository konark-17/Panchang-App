# Changelog

All notable changes to **Panchang App** will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Added
- Nakshatra (lunar mansion) calculation across all 27 nakshatras, returned in every API response
- Hindi Var (weekday name) field added to `PanchangDay` API model
- New `/api/panchang/year` endpoint — fetches all 12 months of panchang data in a single request
- Keyboard navigation: `←` / `→` arrow keys for month navigation, `Escape` to close any open modal
- `CONTRIBUTING.md` with full development setup, branch strategy, PR guidelines, and code style rules

---

## [1.0.0] — 2026-06-01

### Added
- Full Hindu Panchang calendar with Tithi and Paksha calculation using astronomical Julian Day Number method
- REST API (Go) with `/api/panchang/day` and `/api/panchang/month` endpoints
- React + Vite frontend with monthly calendar grid, day detail panel, and today's Tithi bar
- Custom reminder system with browser push notifications for Ekadashi, Purnima, and user-defined events
- Time-based alarm overlay for reminders with stop functionality
- Settings modal for app-level preferences
- Progressive Web App (PWA) manifest — installable on Android, iOS, Windows, and macOS
- Offline support via Service Worker
- Docker support for backend containerisation
- `render.yaml` for one-click deployment to Render.com
- `start.ps1` PowerShell script to launch both frontend and backend simultaneously

# पंचांग — Panchang Calendar App

Hindu Panchang Calendar with daily Tithi, Paksha, and smart **browser notifications** for Ekadashi, Purnima, and custom reminders.

**Stack:** Go (backend) · React + Vite (frontend) · PWA (installable on any device)

---

## Running Locally

**Terminal 1 — Backend (Go)**
```bash
cd backend
go run .
# Runs on http://localhost:8080
```

**Terminal 2 — Frontend (React)**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

Or double-click `start.ps1` to open both at once.

Open **http://localhost:5173** in your browser.

---

## Deploy for Free

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial Panchang App"
git remote add origin https://github.com/YOUR_USERNAME/panchang-app.git
git push -u origin main
```

### Step 2 — Deploy Backend to Render.com (Free)

1. Go to https://render.com → **New → Web Service**
2. Connect your GitHub repo
3. Set **Root Directory** to `backend`
4. Runtime: **Go** (auto-detected)
5. Build command: `go build -o server .`
6. Start command: `./server`
7. Click **Deploy**

Your backend URL will be something like: `https://panchang-api.onrender.com`

### Step 3 — Deploy Frontend to Vercel (Free)

1. Go to https://vercel.com → **Add New Project**
2. Import your GitHub repo
3. Set **Root Directory** to `frontend`
4. Add **Environment Variable**: `VITE_API_URL` = your Render.com URL from Step 2
5. Click **Deploy**

Your app will be live at: `https://panchang-app.vercel.app`

---

## Install as Mobile App (PWA)

**Android (Chrome):**
> Open the site → Tap the 3-dot menu → "Add to Home Screen" → Install

**iPhone/iPad (iOS 16.4+):**
> Open in Safari → Tap Share button → "Add to Home Screen"

**Windows/Mac (Chrome/Edge):**
> Click the install icon in the address bar

Once installed, the app works like a native app — no browser UI, homescreen icon, and offline support.

---

## Notifications

The app asks for notification permission on first load.  
When you open the app on a day with a matching reminder, you'll get a notification:

> 🔔 पंचांग स्मरण  
> "आज एकादशी है — Ekadashi fast"

---

## Project Structure

```
Panchang App/
├── backend/           ← Go REST API
│   ├── main.go
│   ├── calculator/tithi.go
│   ├── handlers/panchang.go
│   ├── models/panchang.go
│   ├── Dockerfile
│   └── render.yaml
│
├── frontend/          ← React + Vite + PWA
│   └── src/
│       ├── App.jsx
│       ├── api/client.js
│       ├── hooks/
│       │   ├── usePanchang.js
│       │   ├── useReminders.js
│       │   └── useNotifications.js
│       ├── utils/tithi.js
│       └── components/
│           ├── Header/
│           ├── TodayBar/
│           ├── Calendar/
│           ├── DayPanel/
│           ├── ReminderList/
│           └── ReminderModal/
│
└── start.ps1          ← Start both servers with one click
```

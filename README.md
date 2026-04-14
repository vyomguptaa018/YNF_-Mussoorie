# 🏔️ Mussoorie Trip — April 25–29, 2026

An interactive trip itinerary landing page for the squad. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no build step. Just open and go.

---

## ✨ Features

- **Live countdown** to April 25
- **Day-by-day itinerary** with tabs, timings, and durations
- **Places to see** with photos, tips, and difficulty levels
- **Local food guide** — filterable by area, with timings, price levels, and local recommendations
- **Google Maps directions** buttons on every place and food card
- **Interactive packing checklist** with progress bar
- **Weather info** for Mussoorie in April
- **Quick Tips** for travel, money, health, and connectivity
- **Fully mobile responsive**

---

## 📁 File Structure

```
mussoorie-trip/
├── index.html          ← Main page
├── css/
│   └── style.css       ← All styles
├── js/
│   ├── data.js         ← Trip data (edit this to update content)
│   └── app.js          ← Interactivity (countdown, tabs, animations)
└── README.md
```

---

## 🚀 How to Put This Live on GitHub Pages

### Step 1 — Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **+** button (top right) → **New repository**
3. Name it something like `mussoorie-trip`
4. Keep it **Public** (required for free GitHub Pages)
5. Click **Create repository**

---

### Step 2 — Upload Your Files

**Option A — via GitHub website (easiest):**

1. Open your new repo
2. Click **"uploading an existing file"** or drag & drop
3. Upload the entire folder structure:
   - `index.html`
   - `css/style.css`
   - `js/data.js`
   - `js/app.js`
4. Scroll down, click **Commit changes**

**Option B — via Git (if you have it installed):**

```bash
cd path/to/mussoorie-trip
git init
git add .
git commit -m "Add Mussoorie trip itinerary"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mussoorie-trip.git
git push -u origin main
```

---

### Step 3 — Enable GitHub Pages

1. Go to your repo → **Settings** (top tab)
2. Scroll down to **Pages** in the left sidebar
3. Under **Source**, select **Deploy from a branch**
4. Set Branch to **main** and folder to **/ (root)**
5. Click **Save**

Wait 1–2 minutes, then your site is live at:

```
https://YOUR_USERNAME.github.io/mussoorie-trip/
```

---

## ✏️ How to Update Content

All trip data lives in **`js/data.js`**. You can edit:

- `itinerary` — days, times, activities, map links
- `places` — attractions, images, tips, entry fees
- `foodGuide` — restaurants, timings, prices, local notes
- `packingList` — categories and items
- `weather` — temperature range and tips

No coding knowledge needed — just find the right spot and change the text!

---

## 🗺️ Updating Google Maps Links

All map links follow this pattern:

**Directions:**
```
https://www.google.com/maps/dir/?api=1&destination=PLACE+NAME
```

**Search:**
```
https://www.google.com/maps/search/?api=1&query=PLACE+NAME
```

Replace `PLACE+NAME` with your destination (use `+` for spaces).

---

## 📱 Sharing

Once live on GitHub Pages, just share the URL with your group!

Or you can share the HTML file directly — anyone can open it in a browser, even without internet (except images and map links).

---

Made with ☕ and mountain air · See you in the clouds 🏔️

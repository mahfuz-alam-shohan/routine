This `README.md` serves as the central documentation for your project. It explains the architecture, the specific "Master vs. Shift" logic we implemented, and how the responsive design functions.

You can save this as **`README.md`** in your project root.

---

# 🏫 School Management System (Frontend Prototype)

A mobile-first, fully responsive web interface for managing school academic operations. This project focuses on a **"Professional Compact"** aesthetic that works seamlessly across Desktop (dense data tables) and Mobile (touch-friendly cards), maintaining high utility on both.

## 🚀 Key Features

### 1. Adaptive Layout Architecture

* **Desktop:** Static sidebar, dense data visualization, maximize screen real estate.
* **Mobile:** * Fixed top navigation with slide-out drawer sidebar.
* Backdrop overlay for focus.
* Inputs prevent iOS zooming (font-size optimization).
* Horizontal scrolling wrappers for complex tables.



### 2. Intelligent Schedule Manager (The "Bell Engine")

We implemented a sophisticated **Time-Chain Logic** to handle complex school routines:

* **Master Timeline:** You design *one* master timeline for the school.
* **Bidirectional Calculation:** * Change **Duration**  Auto-calculates **End Time**.
* Change **End Time**  Auto-calculates **Duration**.


* **Chain Reaction:** Changing the start time of the 1st period automatically updates *every subsequent period* to ensure no gaps or overlaps.
* **Strict Mode:** Prevents invalid start times for middle periods (showing a tutorial popup instead).

### 3. Shift Management Strategy

Instead of creating separate schedules for Morning/Day shifts, we use a **Layered Approach**:

1. **Define Master Bells:** (e.g., 8:00, 8:45, 9:30).
2. **Assign Shifts:** Toggle which bells apply to which shift.
* *Example:* Morning Shift uses periods 1-5. Day Shift uses periods 4-8.



---

## 📂 Project Structure

```bash
src/
├── ui/
│   └── institute/
│       ├── layout.js       # The Layout Shell (Sidebar, Header, HTML Wrapper)
│       └── schedules.js    # The Schedule Logic (State Management, Time Calc)

```

### 🧱 Component Breakdown

#### `layout.js`

* **Function:** `InstituteLayout(content, title, schoolName)`
* **Responsibility:** * Wraps page content in the standard HTML shell.
* Manages the Responsive Sidebar state (hidden on mobile, static on PC).
* Injects global CSS (Tailwind + Custom Scrollbars).



#### `schedules.js`

* **Function:** `SchedulesPageHTML(config, slots)`
* **Responsibility:** * **State Management:** Uses a local `AppState` object to track slots, shifts, and active tabs.
* **DOM Manipulation:** Re-renders only necessary parts of the DOM to prevent input focus loss.
* **Logic:** Contains the `recalculateChain()` function which is the brain of the time management.



---

## 🛠️ Usage Guidelines

### 1. Setup

Since this is a Vanilla JS + Tailwind CDN architecture, no build step is strictly required for the UI logic.

1. Ensure you have an endpoint serving the frontend.
2. The backend should provide `config` (shifts) and `existingSlots` (routine data) when calling `SchedulesPageHTML`.

### 2. The Schedule Workflow

1. **Wizard Step:** On first load, select if the school is **Single Shift** or **Multi-Shift**.
2. **Master Tab:**
* Set **School Start Time** (e.g., 08:00).
* Add periods.
* Adjust **Duration** or **End Time**.
* *Note:* You cannot manually edit the Start Time of Period 2, 3, etc. because they are mathematically tied to the end of the previous period.


3. **Shift Tabs (e.g., "Morning"):**
* Switch tabs to see the read-only view.
* Toggle **ON/OFF** for periods that apply to this specific shift.


4. **Save:** Sends the JSON payload to the server.

---

## 📱 Mobile Optimization Details

| Feature | Implementation |
| --- | --- |
| **Tables** | Converted to "Card Views" on Mobile or wrapped in `overflow-x-auto`. |
| **Inputs** | `min-height: 44px` for touch targets. `font-size: 16px` to stop iOS zoom. |
| **Navigation** | Sticky tabs for quick context switching between Master/Shifts. |
| **Popups** | Centered, backdrop-blurred modals for tutorials/warnings. |

---

## ✅ Upcoming Tasks / Roadmap

* [x] **Layout:** Responsive Shell & Sidebar.
* [x] **Schedule:** Master Routine & Time Logic.
* [x] **Schedule:** Shift Assignment Layer.
* [ ] **Teachers:** CRUD interface for teacher profiles.
* [ ] **Subjects:** Subject management and curriculum mapping.
* [ ] **Allocation:** Drag-and-drop teacher allocation to routine slots.

---

## 📝 License

Internal Use Only.

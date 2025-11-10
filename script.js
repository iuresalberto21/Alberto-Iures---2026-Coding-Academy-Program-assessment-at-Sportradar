// ========== ROUTER ==========
const routes = {
  "/calendar": renderCalendarView,
  "/add": renderAddView,
  "/event": renderEventView,
};

function navigate(path) {
  location.hash = path;
}

window.addEventListener("hashchange", onRouteChange);
window.addEventListener("DOMContentLoaded", () => {
  if (!location.hash) {
    location.hash = "/calendar";
  }
  onRouteChange();
});

function onRouteChange() {
  const app = document.getElementById("app");
  const hash = location.hash.slice(1); // Remove #
  const parts = hash.split("/");
  const route = "/" + (parts[1] || "calendar");
  const param = parts[2];
  
  // Update active nav link
  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.remove("active");
    if (link.dataset.page === parts[1]) {
      link.classList.add("active");
    }
  });

  // Close mobile menu
  document.getElementById("nav-toggle").checked = false;

  const handler = routes[route] || renderCalendarView;
  handler(app, param);
}

// ========== DATA ==========
function uid() {
  return Math.random().toString(36).slice(2, 10);
}

let EVENTS = [
  { 
    id: uid(), 
    date: "2025-07-18", 
    time: "18:30", 
    sport: "Football", 
    title: "Salzburg vs. Sturm", 
    status: "scheduled" 
  },
  { 
    id: uid(), 
    date: "2025-10-23", 
    time: "09:45", 
    sport: "Ice Hockey", 
    title: "KAC vs. Capitals", 
    status: "scheduled" 
  },
  { 
    id: uid(), 
    date: "2025-11-03", 
    time: "16:00", 
    sport: "Football", 
    title: "FCSB vs. CSU Craiova", 
    status: "scheduled" 
  },
  { 
    id: uid(), 
    date: "2025-11-04", 
    time: "15:25", 
    sport: "Football", 
    title: "Barcelona vs. Real Madrid", 
    status: "scheduled" 
  },
  { 
    id: uid(), 
    date: "2025-11-04", 
    time: "08:00", 
    sport: "Football", 
    title: "Liverpool vs. Manchester Utd", 
    status: "scheduled" 
  },
  { 
    id: uid(), 
    date: "2025-11-19", 
    time: "20:00", 
    sport: "Football", 
    title: "FINAL: Bayern München vs. Real Madrid", 
    status: "scheduled" 
  },
];

// ========== DATE HELPERS ==========
const pad = (n) => (n < 10 ? "0" + n : "" + n);
const toISO = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;

function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function getDayOfWeekEU(date) {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1; // Convert Sunday from 0 to 6
}

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-GB", { 
    weekday: "short", 
    day: "2-digit", 
    month: "2-digit", 
    year: "numeric" 
  });
}

const monthLabel = (date) =>
  date.toLocaleString("en-US", { month: "long", year: "numeric" });

// ========== CALENDAR VIEW ==========
function renderCalendarView(container) {
  container.innerHTML = "";
  const tpl = document.getElementById("tpl-calendar").content.cloneNode(true);
  container.appendChild(tpl);

  const grid = document.getElementById("grid");
  const label = document.getElementById("monthLabel");
  const sportFilter = document.getElementById("sportFilter");

  const current = new Date();
  const today = new Date();
  current.setDate(1);
  const y = current.getFullYear();
  const m = current.getMonth();

  label.textContent = monthLabel(current);

  // Populate sport filter
  const sports = [...new Set(EVENTS.map(e => e.sport))].sort();
  sports.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s;
    opt.textContent = s;
    sportFilter.appendChild(opt);
  });

  function indexEvents() {
    const selectedSport = sportFilter.value;
    const map = new Map();

    EVENTS.forEach(ev => {
      const [yy, mm] = ev.date.split("-").map(Number);
      if (yy === y && (mm - 1) === m) {
        if (!selectedSport || ev.sport === selectedSport) {
          if (!map.has(ev.date)) map.set(ev.date, []);
          map.get(ev.date).push(ev);
        }
      }
    });
    return map;
  }

  function renderGrid() {
    grid.innerHTML = "";
    const map = indexEvents();

    const totalDays = daysInMonth(y, m);
    const firstDay = new Date(y, m, 1);
    const firstDayOfWeek = getDayOfWeekEU(firstDay);

    // Previous month days
    const prevMonth = m === 0 ? 11 : m - 1;
    const prevYear = m === 0 ? y - 1 : y;
    const prevMonthDays = daysInMonth(prevYear, prevMonth);

    // Render previous month days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const dayNumber = prevMonthDays - i;
      const cell = document.createElement("div");
      cell.className = "day other-month";
      
      const dateEl = document.createElement("div");
      dateEl.className = "date";
      dateEl.innerHTML = `<span class="date-number">${dayNumber}</span>`;
      cell.appendChild(dateEl);
      
      grid.appendChild(cell);
    }

    // Render current month days
    for (let d = 1; d <= totalDays; d++) {
      const iso = toISO(y, m + 1, d);
      const cell = document.createElement("div");
      cell.className = "day";

      // Check if today
      if (d === today.getDate() && m === today.getMonth() && y === today.getFullYear()) {
        cell.classList.add("today");
      }

      const dateEl = document.createElement("div");
      dateEl.className = "date";
      
      const events = map.get(iso);
      if (events && events.length > 0) {
        dateEl.innerHTML = `
          <span class="date-number">${d}</span>
          <span class="dot"></span>
        `;

        // Create events container with scroll
        const eventsContainer = document.createElement("div");
        eventsContainer.className = "day-events";

        // Show all events in scrollable container
        events.forEach(ev => {
          const badge = document.createElement("div");
          badge.className = "badge";
          badge.title = `${ev.time} • ${ev.sport} • ${ev.title}`;
          badge.textContent = `${ev.time} ${ev.title}`;
          badge.addEventListener("click", () => navigate(`/event/${ev.id}`));
          eventsContainer.appendChild(badge);
        });

        cell.appendChild(eventsContainer);
      } else {
        dateEl.innerHTML = `<span class="date-number">${d}</span>`;
      }

      cell.prepend(dateEl);
      grid.appendChild(cell);
    }

    // Render next month days
    const usedCells = firstDayOfWeek + totalDays;
    const remainingCells = usedCells % 7 === 0 ? 0 : 7 - (usedCells % 7);

    for (let d = 1; d <= remainingCells; d++) {
      const cell = document.createElement("div");
      cell.className = "day other-month";
      
      const dateEl = document.createElement("div");
      dateEl.className = "date";
      dateEl.innerHTML = `<span class="date-number">${d}</span>`;
      cell.appendChild(dateEl);
      
      grid.appendChild(cell);
    }
  }

  sportFilter.addEventListener("change", renderGrid);
  renderGrid();
}

// ========== EVENT DETAIL VIEW ==========
function renderEventView(container, param) {
  container.innerHTML = "";
  const id = param || "";
  const event = EVENTS.find(e => e.id === id);

  if (!event) {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <a href="#/calendar" class="backlink">← Back to Calendar</a>
      <h1>Event Not Found</h1>
      <p style="color: var(--muted);">The requested event does not exist.</p>
    `;
    container.appendChild(card);
    return;
  }

  const tpl = document.getElementById("tpl-event").content.cloneNode(true);
  tpl.querySelector(".event-title").textContent = event.title;
  tpl.querySelector('[data-field="date"]').textContent = formatDate(event.date);
  tpl.querySelector('[data-field="time"]').textContent = event.time;
  tpl.querySelector('[data-field="sport"]').textContent = event.sport;
  tpl.querySelector('[data-field="title"]').textContent = event.title;
  tpl.querySelector('[data-field="status"]').textContent = 
    event.status.charAt(0).toUpperCase() + event.status.slice(1);

  container.appendChild(tpl);
}

// ========== ADD EVENT VIEW ==========
function renderAddView(container) {
  container.innerHTML = "";
  const tpl = document.getElementById("tpl-add").content.cloneNode(true);
  container.appendChild(tpl);

  const form = document.getElementById("addForm");

  // Set default date to today
  const today = new Date().toISOString().split("T")[0];
  form.querySelector("#date").value = today;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);

    const date = fd.get("date");
    const time = fd.get("time");
    const sport = fd.get("sport").trim();
    const title = fd.get("title").trim();
    const status = fd.get("status") || "scheduled";

    if (!date || !time || !sport || !title) {
      alert("Please fill in all required fields.");
      return;
    }

    // Add new event
    EVENTS.push({
      id: uid(),
      date,
      time,
      sport,
      title,
      status,
    });

    // Show success message
    const successMsg = document.createElement("div");
    successMsg.className = "success-message";
    successMsg.textContent = "✓ Event added successfully!";
    form.insertAdjacentElement("afterbegin", successMsg);

    // Reset form
    form.reset();
    form.querySelector("#date").value = today;

    // Redirect to calendar after 1.5 seconds
    setTimeout(() => navigate("/calendar"), 1500);
  });
}
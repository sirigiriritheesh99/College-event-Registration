/* ============================================================
   CampusFest '26 — front-end application logic
   No build step, no backend. Registrations are stored in the
   visitor's own browser via localStorage.
   ============================================================ */

"use strict";

/* ------------------------------------------------------------
   1. Data
   ------------------------------------------------------------ */
const CATEGORIES = {
  technology: { label: "Technology", artWord: "CODE" },
  culture: { label: "Culture", artWord: "PLAY" },
  sports: { label: "Sports", artWord: "PLAY" },
  careers: { label: "Careers", artWord: "GROW" },
  arts: { label: "Arts", artWord: "LENS" }
};

const EVENTS = [
  {
    id: "codestorm",
    title: "CodeStorm Hackathon",
    category: "technology",
    artWord: "CODE",
    dayKey: "day1",
    dayShort: "Wed",
    dayNum: "18",
    month: "Nov",
    dayFull: "Wednesday, 18 November 2026",
    time: "9:00 AM",
    dateISO: "2026-11-18T09:00:00",
    durationMin: 1440,
    durationLabel: "24 hours",
    venue: "Innovation Lab, Block C",
    venueShort: "Innovation Lab",
    capacity: 36,
    tagline: "Build something bold in 24 hours.",
    description:
      "A 24-hour build sprint for coders, designers and problem-solvers. Pick a real-world brief, form a team, and ship a working prototype before the clock runs out. Mentors drop in through the night and the best three teams pitch on the main stage.",
    eligibility: "Open to all currently enrolled students. Teams of 2–4; solo builders will be matched with a team.",
    bring: "Laptop, charger, student ID and any hardware you need. Meals and Wi-Fi are provided."
  },
  {
    id: "neon-nights",
    title: "Neon Nights Cultural Fest",
    category: "culture",
    artWord: "PLAY",
    dayKey: "day1",
    dayShort: "Wed",
    dayNum: "18",
    month: "Nov",
    dayFull: "Wednesday, 18 November 2026",
    time: "6:30 PM",
    dateISO: "2026-11-18T18:30:00",
    durationMin: 180,
    durationLabel: "3 hours",
    venue: "Main Auditorium",
    venueShort: "Main Auditorium",
    capacity: 180,
    tagline: "Student bands, dance crews and a headline set under the lights.",
    description:
      "CampusFest's biggest night returns with student bands, dance crews, a fashion showcase and a headline set under the lights. Come for the music, stay for the confetti.",
    eligibility: "Open to all students and staff. No dance or music experience needed to attend.",
    bring: "Student ID and comfortable shoes. Doors open 30 minutes before the show."
  },
  {
    id: "hoops-3v3",
    title: "Hoops 3v3 Tournament",
    category: "sports",
    artWord: "PLAY",
    dayKey: "day2",
    dayShort: "Thu",
    dayNum: "19",
    month: "Nov",
    dayFull: "Thursday, 19 November 2026",
    time: "10:00 AM",
    dateISO: "2026-11-19T10:00:00",
    durationMin: 240,
    durationLabel: "4 hours",
    venue: "Indoor Courts",
    venueShort: "Indoor Courts",
    capacity: 48,
    tagline: "Fast, loud and competitive. Bring your squad.",
    description:
      "Register a squad of three (plus one substitute) for a knockout tournament on the indoor courts. Bring your own kit; we'll bring the refs and the crowd.",
    eligibility: "Open to all students. Teams of 3 plus 1 substitute. Bring your student ID.",
    bring: "Sports kit, trainers and a water bottle. Team bibs are provided."
  },
  {
    id: "ai-career",
    title: "AI & Your Career",
    category: "careers",
    artWord: "GROW",
    dayKey: "day2",
    dayShort: "Thu",
    dayNum: "19",
    month: "Nov",
    dayFull: "Thursday, 19 November 2026",
    time: "2:00 PM",
    dateISO: "2026-11-19T14:00:00",
    durationMin: 120,
    durationLabel: "2 hours",
    venue: "Seminar Hall 2",
    venueShort: "Seminar Hall 2",
    capacity: 80,
    tagline: "A straight-talking session on AI, internships and what comes next.",
    description:
      "A straight-talking session on where AI is actually heading and what it means for internships, portfolios and the first five years of your career. Includes a live Q&A with alumni working in the field.",
    eligibility: "Open to all students. Seats are limited; arrive 10 minutes early.",
    bring: "Student ID and a notebook. Recording is welcome."
  },
  {
    id: "photo-walk",
    title: "Lens & Light Photo Walk",
    category: "arts",
    artWord: "LENS",
    dayKey: "day3",
    dayShort: "Fri",
    dayNum: "20",
    month: "Nov",
    dayFull: "Friday, 20 November 2026",
    time: "7:00 AM",
    dateISO: "2026-11-20T07:00:00",
    durationMin: 120,
    durationLabel: "2 hours",
    venue: "Campus Lake",
    venueShort: "Campus Lake",
    capacity: 25,
    tagline: "A slow golden-hour walk with the photography club.",
    description:
      "A slow, golden-hour walk around campus with the photography club. Learn composition, light and street-style storytelling. All cameras welcome — phones absolutely count.",
    eligibility: "Open to all students. Bring any camera, including a phone.",
    bring: "Camera or phone, comfortable shoes and a water bottle."
  },
  {
    id: "startup-pitch",
    title: "Startup Pitch Night",
    category: "careers",
    artWord: "GROW",
    dayKey: "day3",
    dayShort: "Fri",
    dayNum: "20",
    month: "Nov",
    dayFull: "Friday, 20 November 2026",
    time: "5:00 PM",
    dateISO: "2026-11-20T17:00:00",
    durationMin: 180,
    durationLabel: "3 hours",
    venue: "Incubation Centre",
    venueShort: "Incubation Centre",
    capacity: 60,
    tagline: "Five minutes, one idea, a room full of investors.",
    description:
      "Five minutes, one idea, a room full of investors and alumni. Student founders pitch for seed funding and mentorship. Come to pitch or come to watch — both are free.",
    eligibility: "Open to all students. Pitchers should apply as a team of up to 3.",
    bring: "Student ID and a one-page pitch deck (optional)."
  },
  {
    id: "battle-of-bands",
    title: "Battle of the Bands",
    category: "culture",
    artWord: "PLAY",
    dayKey: "day4",
    dayShort: "Sat",
    dayNum: "21",
    month: "Nov",
    dayFull: "Saturday, 21 November 2026",
    time: "5:30 PM",
    dateISO: "2026-11-21T17:30:00",
    durationMin: 240,
    durationLabel: "4 hours",
    venue: "Open Air Stage",
    venueShort: "Open Air Stage",
    capacity: 150,
    tagline: "Eight student bands, one stage, one winner.",
    description:
      "Eight student bands, one stage, one winner. Expect covers you love, originals you don't know yet, and a crowd that refuses to sit down.",
    eligibility: "Open to all students. Performing bands must register by 15 November.",
    bring: "Student ID and your instrument (if performing)."
  },
  {
    id: "campus-run",
    title: "Campus Run 5K",
    category: "sports",
    artWord: "PLAY",
    dayKey: "day4",
    dayShort: "Sat",
    dayNum: "21",
    month: "Nov",
    dayFull: "Saturday, 21 November 2026",
    time: "6:30 AM",
    dateISO: "2026-11-21T06:30:00",
    durationMin: 120,
    durationLabel: "2 hours",
    venue: "Sports Ground",
    venueShort: "Sports Ground",
    capacity: 120,
    tagline: "A sunrise 5K through campus and the surrounding trails.",
    description:
      "A sunrise 5K through campus and the surrounding trails. Walkers, joggers and serious runners all welcome. Timing chips, medals and a very good breakfast at the finish line.",
    eligibility: "Open to all students and staff. A basic fitness declaration is required at check-in.",
    bring: "Running shoes, weather-appropriate kit and a water bottle."
  }
];

const SCHEDULE = {
  day1: [
    { time: "9:00", period: "AM", title: "CodeStorm Hackathon", meta: "Innovation Lab, Block C · 24 hours", tag: "Technology", flagship: true },
    { time: "11:30", period: "AM", title: "Welcome & opening ceremony", meta: "Main Auditorium · 45 min", tag: "All welcome" },
    { time: "2:00", period: "PM", title: "Design thinking workshop", meta: "Seminar Hall 1 · 90 min", tag: "Workshop" },
    { time: "6:30", period: "PM", title: "Neon Nights cultural fest", meta: "Main Auditorium · 3 hours", tag: "Culture", flagship: true }
  ],
  day2: [
    { time: "10:00", period: "AM", title: "Hoops 3v3 tournament", meta: "Indoor Courts · 4 hours", tag: "Sports", flagship: true },
    { time: "11:00", period: "AM", title: "RoboRumble: bot wars", meta: "Robotics Lab · 2 hours", tag: "Technology" },
    { time: "2:00", period: "PM", title: "AI & your career", meta: "Seminar Hall 2 · 2 hours", tag: "Careers" },
    { time: "4:30", period: "PM", title: "Open mic & poetry slam", meta: "Amphitheatre · 90 min", tag: "Culture" }
  ],
  day3: [
    { time: "7:00", period: "AM", title: "Lens & Light photo walk", meta: "Campus Lake · 2 hours", tag: "Arts", flagship: true },
    { time: "10:00", period: "AM", title: "Debate: the future of work", meta: "Seminar Hall 1 · 2 hours", tag: "Careers" },
    { time: "1:00", period: "PM", title: "Résumé clinic", meta: "Placement Cell · drop-in", tag: "Careers" },
    { time: "5:00", period: "PM", title: "Startup pitch night", meta: "Incubation Centre · 3 hours", tag: "Careers", flagship: true }
  ],
  day4: [
    { time: "6:30", period: "AM", title: "Campus Run 5K", meta: "Sports Ground · 2 hours", tag: "Sports", flagship: true },
    { time: "11:00", period: "AM", title: "Alumni connect brunch", meta: "Convention Hall · 2 hours", tag: "All welcome" },
    { time: "5:30", period: "PM", title: "Battle of the Bands", meta: "Open Air Stage · 4 hours", tag: "Culture", flagship: true },
    { time: "8:00", period: "PM", title: "Closing ceremony & awards", meta: "Open Air Stage · 45 min", tag: "All welcome" }
  ]
};

const STORAGE_KEY = "campusfest26.registrations.v1";
const EVENT_START = new Date("2026-11-18T09:00:00").getTime();

/* ------------------------------------------------------------
   2. Helpers
   ------------------------------------------------------------ */
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const getEvent = (id) => EVENTS.find((event) => event.id === id);

const escapeHTML = (value) =>
  String(value).replace(/[&<>"']/g, (character) => {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return map[character];
  });

const pad = (number) => String(number).padStart(2, "0");

const ICONS = {
  clock: '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.4"/><path d="M8 4.8V8l2.2 1.3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  pin: '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 14s4.6-3.6 4.6-7.3A4.6 4.6 0 0 0 3.4 6.7C3.4 10.4 8 14 8 14Z" stroke="currentColor" stroke-width="1.4"/><circle cx="8" cy="6.6" r="1.6" stroke="currentColor" stroke-width="1.4"/></svg>'
};

/* ------------------------------------------------------------
   3. State & storage
   ------------------------------------------------------------ */
let storageAvailable = true;
let registrations = loadRegistrations();
let activeFilter = "all";
let lastRegistration = null;

function loadRegistrations() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    storageAvailable = false;
    return [];
  }
}

function saveRegistrations() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
    return true;
  } catch (error) {
    storageAvailable = false;
    return false;
  }
}

const seatsTaken = (eventId) => registrations.filter((registration) => registration.eventId === eventId).length;

const seatsLeft = (event) => Math.max(0, event.capacity - seatsTaken(event.id));

/* ------------------------------------------------------------
   4. Events rendering
   ------------------------------------------------------------ */
function eventCardHTML(event, index) {
  const category = CATEGORIES[event.category];
  const left = seatsLeft(event);
  const isLow = left <= 8;
  const isFull = left === 0;
  const percent = Math.round((left / event.capacity) * 100);

  return `
    <article class="event-card" style="animation-delay:${Math.min(index * 45, 180)}ms">
      <div class="event-art art--${event.category}">
        <span class="event-date" aria-hidden="true">
          <span>${event.dayShort}</span>
          <strong>${event.dayNum}</strong>
          <span>${event.month}</span>
        </span>
        <span class="event-cat">${category.label}</span>
        <span class="art-word" aria-hidden="true">${event.artWord}</span>
      </div>
      <div class="event-body">
        <div class="event-meta">
          <span>${ICONS.clock}${event.time}</span>
          <span>${ICONS.pin}${event.venueShort}</span>
        </div>
        <h3>${escapeHTML(event.title)}</h3>
        <p class="event-desc">${escapeHTML(event.tagline)}</p>
        <div class="seats${isLow ? " is-low" : ""}">
          <div class="seats-meta">
            <span class="seats-left">${isFull ? "Fully booked" : `${left} seat${left === 1 ? "" : "s"} left`}</span>
            <span>${event.capacity} total</span>
          </div>
          <div class="seat-bar" role="img" aria-label="${percent}% of seats remaining">
            <span style="width:${percent}%"></span>
          </div>
        </div>
        <div class="event-actions">
          <button class="btn btn-outline" type="button" data-action="details" data-event="${event.id}">Details</button>
          <button class="btn btn-dark" type="button" data-action="register" data-event="${event.id}"${isFull ? " disabled" : ""}>${isFull ? "Full" : "Register"}</button>
        </div>
      </div>
    </article>
  `;
}

function renderEvents() {
  const grid = $("#eventGrid");
  if (!grid) return;

  const filtered = activeFilter === "all" ? EVENTS : EVENTS.filter((event) => event.category === activeFilter);
  grid.innerHTML = filtered.map(eventCardHTML).join("");

  const emptyState = $("#emptyState");
  if (emptyState) emptyState.hidden = filtered.length > 0;

  const resultCount = $("#resultCount");
  if (resultCount) {
    resultCount.textContent = `${filtered.length} ${filtered.length === 1 ? "event" : "events"}`;
  }
}

/* ------------------------------------------------------------
   5. Event select & schedule
   ------------------------------------------------------------ */
function renderEventOptions() {
  const select = $("#eventSelect");
  if (!select) return;

  const current = select.value;
  const days = [
    { key: "day1", label: "Wednesday 18 November" },
    { key: "day2", label: "Thursday 19 November" },
    { key: "day3", label: "Friday 20 November" },
    { key: "day4", label: "Saturday 21 November" }
  ];

  let options = '<option value="">Select an event</option>';
  days.forEach((day) => {
    const dayEvents = EVENTS.filter((event) => event.dayKey === day.key);
    options += `<optgroup label="${day.label}">`;
    dayEvents.forEach((event) => {
      const left = seatsLeft(event);
      options += `<option value="${event.id}"${left === 0 ? " disabled" : ""}>${escapeHTML(event.title)} — ${event.time}${left === 0 ? " (full)" : ` · ${left} left`}</option>`;
    });
    options += "</optgroup>";
  });

  select.innerHTML = options;
  if (current && getEvent(current) && seatsLeft(getEvent(current)) > 0) {
    select.value = current;
  }
}

function renderSchedule() {
  Object.keys(SCHEDULE).forEach((day) => {
    const panel = document.querySelector(`[data-panel="${day}"]`);
    if (!panel) return;

    panel.innerHTML = SCHEDULE[day]
      .map(
        (session) => `
          <article class="session">
            <div class="session-time">
              <strong>${session.time}</strong>
              <span>${session.period}</span>
            </div>
            <div class="session-info">
              <h3>${escapeHTML(session.title)}</h3>
              <p>${escapeHTML(session.meta)}</p>
            </div>
            <div class="session-tags">
              <span class="tag">${escapeHTML(session.tag)}</span>
              ${session.flagship ? '<span class="tag tag-flag">Flagship</span>' : ""}
            </div>
          </article>
        `
      )
      .join("");
  });
}

function setupScheduleTabs() {
  const tabs = $$(".day-tab");

  const activate = (day, moveFocus = false) => {
    tabs.forEach((tab) => {
      const active = tab.dataset.day === day;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
      tab.tabIndex = active ? 0 : -1;

      const panel = document.querySelector(`[data-panel="${tab.dataset.day}"]`);
      if (panel) {
        panel.hidden = !active;
        panel.classList.toggle("is-active", active);
      }

      if (active && moveFocus) tab.focus();
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activate(tab.dataset.day));

    tab.addEventListener("keydown", (event) => {
      let nextIndex = null;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;

      if (nextIndex !== null) {
        event.preventDefault();
        activate(tabs[nextIndex].dataset.day, true);
      }
    });
  });
}

/* ------------------------------------------------------------
   6. Countdown
   ------------------------------------------------------------ */
function updateCountdown() {
  const countdown = $("#countdown");
  if (!countdown) return;

  const difference = EVENT_START - Date.now();

  if (difference <= 0) {
    countdown.classList.add("is-live");
    countdown.innerHTML = '<p class="countdown-live">CampusFest is live — see you there!</p>';
    return;
  }

  const days = Math.floor(difference / 86400000);
  const hours = Math.floor((difference % 86400000) / 3600000);
  const minutes = Math.floor((difference % 3600000) / 60000);
  const seconds = Math.floor((difference % 60000) / 1000);

  const values = { days, hours, minutes, seconds };
  Object.keys(values).forEach((unit) => {
    const element = countdown.querySelector(`[data-unit="${unit}"]`);
    if (element) element.textContent = pad(values[unit]);
  });
}

/* ------------------------------------------------------------
   7. Event details dialog
   ------------------------------------------------------------ */
let dialog;

function openEventDialog(event) {
  if (!dialog) dialog = $("#eventDialog");
  if (!dialog) return;

  const category = CATEGORIES[event.category];
  const left = seatsLeft(event);
  const isFull = left === 0;
  const content = $("#dialogContent");

  content.innerHTML = `
    <div class="dialog-art art--${event.category}">
      <span class="art-word" aria-hidden="true">${event.artWord}</span>
    </div>
    <span class="dialog-kicker">${category.label} · ${event.dayFull}</span>
    <h3 class="dialog-title" id="dialogTitle">${escapeHTML(event.title)}</h3>
    <p class="dialog-desc">${escapeHTML(event.description)}</p>
    <div class="dialog-meta">
      <div><span>Date</span><strong>${event.dayFull}</strong></div>
      <div><span>Time</span><strong>${event.time} · ${event.durationLabel}</strong></div>
      <div><span>Venue</span><strong>${escapeHTML(event.venue)}</strong></div>
    </div>
    <div class="dialog-section">
      <h4>Who can join</h4>
      <p>${escapeHTML(event.eligibility)}</p>
    </div>
    <div class="dialog-section">
      <h4>What to bring</h4>
      <p>${escapeHTML(event.bring)}</p>
    </div>
    <div class="dialog-cta">
      <button class="btn btn-dark" type="button" data-dialog-register="${event.id}"${isFull ? " disabled" : ""}>
        ${isFull ? "Fully booked" : "Reserve my seat"}
        ${isFull ? "" : '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'}
      </button>
      <span class="dialog-seats${left <= 8 ? " is-low" : ""}">
        ${isFull ? "No seats left" : `${left} of ${event.capacity} seats left`}
      </span>
    </div>
  `;

  document.body.classList.add("dialog-open");

  if (typeof dialog.showModal === "function") {
    if (!dialog.open) dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function closeEventDialog() {
  if (!dialog) dialog = $("#eventDialog");
  if (!dialog) return;
  if (typeof dialog.close === "function" && dialog.open) dialog.close();
  else dialog.removeAttribute("open");
  document.body.classList.remove("dialog-open");
}

/* ------------------------------------------------------------
   8. Form validation & submission
   ------------------------------------------------------------ */
const fieldMap = {
  fullName: { input: $("#fullName"), error: $("#fullNameError") },
  studentId: { input: $("#studentId"), error: $("#studentIdError") },
  email: { input: $("#email"), error: $("#emailError") },
  phone: { input: $("#phone"), error: $("#phoneError") },
  year: { input: $("#year"), error: $("#yearError") },
  eventId: { input: $("#eventSelect"), error: $("#eventSelectError") },
  terms: { input: $("#terms"), error: $("#termsError") }
};

const validators = {
  fullName: (value) =>
    value.trim().length >= 2 ? "" : "Please enter your full name (at least 2 characters).",
  studentId: (value) =>
    /^[A-Za-z0-9-]{4,20}$/.test(value.trim())
      ? ""
      : "Use 4–20 letters, numbers or hyphens (e.g. NF22CS104).",
  email: (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
      ? ""
      : "Enter a valid email address, like you@northfield.edu.",
  phone: (value) => {
    const digits = value.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 13
      ? ""
      : "Enter a valid phone number with 10–13 digits.";
  },
  year: (value) => (value ? "" : "Select your year of study."),
  eventId: (value) => {
    if (!value) return "Choose an event to register for.";
    const event = getEvent(value);
    if (!event) return "Choose a valid event.";
    if (seatsLeft(event) <= 0) return "Sorry, this event just filled up. Please choose another.";
    return "";
  },
  terms: (_value, input) => (input.checked ? "" : "Please agree to the code of conduct to continue.")
};

function setFieldError(name, message) {
  const field = fieldMap[name];
  if (!field) return;

  const wrapper = field.input.closest(".field") || field.input.closest(".check-field");
  if (wrapper) wrapper.classList.toggle("has-error", Boolean(message));
  field.input.setAttribute("aria-invalid", message ? "true" : "false");
  if (field.error) field.error.textContent = message;
}

function validateField(name) {
  const field = fieldMap[name];
  if (!field) return true;
  const message = validators[name](field.input.value, field.input);
  setFieldError(name, message);
  return !message;
}

function clearFieldErrors() {
  Object.keys(fieldMap).forEach((name) => setFieldError(name, ""));
  const alert = $("#formAlert");
  if (alert) {
    alert.hidden = true;
    alert.textContent = "";
  }
}

function setupFormValidation() {
  Object.keys(fieldMap).forEach((name) => {
    const field = fieldMap[name];
    if (!field.input) return;

    field.input.addEventListener("blur", () => validateField(name));

    field.input.addEventListener("input", () => {
      const wrapper = field.input.closest(".field");
      if (wrapper && wrapper.classList.contains("has-error")) validateField(name);
      const alert = $("#formAlert");
      if (alert) alert.hidden = true;
    });

    field.input.addEventListener("change", () => {
      if (name === "terms" || name === "year" || name === "eventId") validateField(name);
    });
  });
}

function generateRegistrationId() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "";
  for (let i = 0; i < 6; i += 1) {
    id += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `CF26-${id}`;
}

function setupForm() {
  const form = $("#registrationForm");
  if (!form) return;

  setupFormValidation();

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const alert = $("#formAlert");
    if (alert) alert.hidden = true;

    let firstInvalid = null;
    Object.keys(fieldMap).forEach((name) => {
      const valid = validateField(name);
      if (!valid && !firstInvalid) firstInvalid = fieldMap[name].input;
    });

    if (firstInvalid) {
      if (alert) {
        alert.textContent = "Please fix the highlighted fields below and try again.";
        alert.hidden = false;
      }
      firstInvalid.focus();
      firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      showToast("Almost there — check the highlighted fields.");
      return;
    }

    const email = fieldMap.email.input.value.trim();
    const eventId = fieldMap.eventId.input.value;
    const selectedEvent = getEvent(eventId);

    const duplicate = registrations.some(
      (registration) =>
        registration.email.toLowerCase() === email.toLowerCase() && registration.eventId === eventId
    );

    if (duplicate) {
      const message = "This email is already registered for this event. Use another email or pick a different event.";
      setFieldError("email", message);
      if (alert) {
        alert.textContent = message;
        alert.hidden = false;
      }
      fieldMap.email.input.focus();
      return;
    }

    if (!selectedEvent || seatsLeft(selectedEvent) <= 0) {
      setFieldError("eventId", "Sorry, this event just filled up. Please choose another.");
      fieldMap.eventId.input.focus();
      return;
    }

    const registration = {
      id: generateRegistrationId(),
      fullName: fieldMap.fullName.input.value.trim(),
      studentId: fieldMap.studentId.input.value.trim().toUpperCase(),
      email,
      phone: fieldMap.phone.input.value.trim(),
      year: fieldMap.year.input.value,
      eventId,
      notes: $("#notes") ? $("#notes").value.trim() : "",
      createdAt: new Date().toISOString()
    };

    registrations.push(registration);
    const saved = saveRegistrations();
    lastRegistration = registration;

    renderEvents();
    renderEventOptions();
    showSuccess(registration);
    showToast(
      saved
        ? "Registration confirmed — your pass is ready."
        : "Registration confirmed for this visit. Local storage is unavailable."
    );
  });
}

function showSuccess(registration) {
  const event = getEvent(registration.eventId);
  if (!event) return;

  const form = $("#registrationForm");
  const panel = $("#successPanel");
  if (!form || !panel) return;

  const firstName = registration.fullName.split(/\s+/)[0];

  $("#successFirstName").textContent = firstName;
  $("#successName").textContent = registration.fullName;
  $("#successEvent").textContent = event.title;
  $("#successWhen").textContent = `${event.dayShort} ${event.dayNum} ${event.month} · ${event.time}`;
  $("#successWhere").textContent = event.venueShort;
  $("#successId").textContent = registration.id;
  $("#successStudentId").textContent = registration.studentId;

  form.hidden = true;
  panel.hidden = false;
  panel.focus({ preventScroll: true });
  panel.scrollIntoView({ behavior: "smooth", block: "center" });
}

function resetForm() {
  const form = $("#registrationForm");
  const panel = $("#successPanel");
  if (!form || !panel) return;

  form.reset();
  clearFieldErrors();
  form.hidden = false;
  panel.hidden = true;
  lastRegistration = null;

  renderEventOptions();
  const formCard = $("#formCard");
  if (formCard) formCard.scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => {
    const nameInput = $("#fullName");
    if (nameInput) nameInput.focus({ preventScroll: true });
  }, 450);
}

/* ------------------------------------------------------------
   9. Calendar & print
   ------------------------------------------------------------ */
function icsDate(date) {
  return (
    date.getFullYear() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    "00"
  );
}

function escapeICS(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function downloadCalendar() {
  if (!lastRegistration) return;
  const event = getEvent(lastRegistration.eventId);
  if (!event) return;

  const start = new Date(event.dateISO);
  const end = new Date(start.getTime() + event.durationMin * 60000);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CampusFest 26//Registration//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${lastRegistration.id}@campusfest.northfield.edu`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(start)}`,
    `DTEND:${icsDate(end)}`,
    `SUMMARY:${escapeICS(`${event.title} — CampusFest '26`)}`,
    `LOCATION:${escapeICS(`${event.venue}, Northfield College`)}`,
    `DESCRIPTION:${escapeICS(`CampusFest '26 registration ${lastRegistration.id}. Bring your student ID and confirmation pass.`)}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ];

  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `campusfest-${event.id}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast("Calendar file downloaded.");
}

/* ------------------------------------------------------------
   10. Toast
   ------------------------------------------------------------ */
let toastTimer;

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 4200);
}

/* ------------------------------------------------------------
   11. Choose event / scroll to form
   ------------------------------------------------------------ */
function chooseEvent(eventId) {
  const event = getEvent(eventId);
  if (!event) return;

  if (seatsLeft(event) <= 0) {
    showToast("That event just filled up — try another one.");
    return;
  }

  const select = $("#eventSelect");
  if (select) {
    const option = select.querySelector(`option[value="${eventId}"]`);
    if (option) option.disabled = false;
    select.value = eventId;
    setFieldError("eventId", "");
  }

  closeEventDialog();

  const formCard = $("#formCard");
  if (formCard) {
    formCard.scrollIntoView({ behavior: "smooth", block: "start" });
    formCard.classList.remove("is-highlighted");
    void formCard.offsetWidth;
    formCard.classList.add("is-highlighted");
    window.setTimeout(() => formCard.classList.remove("is-highlighted"), 1200);
  }

  showToast(`${event.title} selected — complete the form to reserve your seat.`);

  window.setTimeout(() => {
    const nameInput = $("#fullName");
    if (nameInput) nameInput.focus({ preventScroll: true });
  }, 600);
}

/* ------------------------------------------------------------
   12. Navigation, scroll & reveal
   ------------------------------------------------------------ */
function setupNavigation() {
  const header = $(".site-header");
  const toggle = $("#menuToggle");
  const nav = $("#primaryNav");
  const navLinks = $$(".nav-link");

  const closeNav = () => {
    if (!nav) return;
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    }
  };

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
  }

  navLinks.forEach((link) => link.addEventListener("click", closeNav));

  document.addEventListener("click", (event) => {
    if (!nav || !nav.classList.contains("is-open")) return;
    if (header && !header.contains(event.target)) closeNav();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) closeNav();
  });

  const sections = ["home", "events", "schedule", "register", "about"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const setActiveLink = () => {
    let current = sections[0] ? sections[0].id : "home";
    const offset = window.scrollY + 160;

    sections.forEach((section) => {
      if (section.offsetTop <= offset) current = section.id;
    });

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      current = "about";
    }

    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${current}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      const bar = $("#scrollBar");
      if (bar) bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;

      if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
      setActiveLink();
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function setupReveal() {
  const elements = $$(".reveal");
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  elements.forEach((element) => observer.observe(element));
}

/* ------------------------------------------------------------
   13. Wire up
   ------------------------------------------------------------ */
function setupFilters() {
  const buttons = $$(".filter");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      buttons.forEach((other) => {
        const active = other === button;
        other.classList.toggle("is-active", active);
        other.setAttribute("aria-pressed", active ? "true" : "false");
      });
      renderEvents();
    });
  });
}

function setupEventInteractions() {
  const grid = $("#eventGrid");
  if (grid) {
    grid.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-action]");
      if (!button) return;
      const eventId = button.dataset.event;
      if (button.dataset.action === "details") {
        const selectedEvent = getEvent(eventId);
        if (selectedEvent) openEventDialog(selectedEvent);
      }
      if (button.dataset.action === "register") chooseEvent(eventId);
    });
  }

  const dialogContent = $("#dialogContent");
  if (dialogContent) {
    dialogContent.addEventListener("click", (event) => {
      const button = event.target.closest("[data-dialog-register]");
      if (button) chooseEvent(button.dataset.dialogRegister);
    });
  }

  const closeButton = $("#dialogClose");
  if (closeButton) closeButton.addEventListener("click", closeEventDialog);

  const eventDialog = $("#eventDialog");
  if (eventDialog) {
    eventDialog.addEventListener("click", (event) => {
      if (event.target === eventDialog) closeEventDialog();
    });
    eventDialog.addEventListener("close", () => document.body.classList.remove("dialog-open"));
  }
}

function setupSuccessActions() {
  const calendarButton = $("#calendarBtn");
  const printButton = $("#printBtn");
  const anotherButton = $("#anotherBtn");

  if (calendarButton) calendarButton.addEventListener("click", downloadCalendar);
  if (printButton) printButton.addEventListener("click", () => window.print());
  if (anotherButton) anotherButton.addEventListener("click", resetForm);
}

function init() {
  const footerYear = $("#footerYear");
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  renderEvents();
  renderEventOptions();
  renderSchedule();

  setupFilters();
  setupEventInteractions();
  setupScheduleTabs();
  setupForm();
  setupSuccessActions();
  setupNavigation();
  setupReveal();

  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;
    registrations = loadRegistrations();
    renderEvents();
    renderEventOptions();
  });
}

init();

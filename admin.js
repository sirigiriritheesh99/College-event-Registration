/* ============================================================
   CampusFest '26 — Organiser dashboard logic
   Reads the registrations written by app.js from localStorage.
   No backend, no build step, no external chart library.
   ============================================================ */

"use strict";

/* ------------------------------------------------------------
   1. Reference data
   ------------------------------------------------------------ */
const STORAGE_KEY = "campus26.registrations.v1";

const CATEGORIES = {
  technology: { label: "Technology", color: "#a8d61e", artWord: "CODE" },
  culture: { label: "Culture", color: "#ff5b3d", artWord: "PLAY" },
  sports: { label: "Sports", color: "#58a9ea", artWord: "PLAY" },
  careers: { label: "Careers", color: "#5c43e8", artWord: "GROW" },
  arts: { label: "Arts", color: "#ffc247", artWord: "LENS" }
};

const EVENTS = [
  { id: "codestorm", title: "CodeStorm Hackathon", category: "technology", day: "Wed 18 Nov", time: "9:00 AM", venue: "Innovation Lab, Block C", capacity: 36 },
  { id: "neon-nights", title: "Neon Nights Cultural Fest", category: "culture", day: "Wed 18 Nov", time: "6:30 PM", venue: "Main Auditorium", capacity: 180 },
  { id: "hoops-3v3", title: "Hoops 3v3 Tournament", category: "sports", day: "Thu 19 Nov", time: "10:00 AM", venue: "Indoor Courts", capacity: 48 },
  { id: "ai-career", title: "AI & Your Career", category: "careers", day: "Thu 19 Nov", time: "2:00 PM", venue: "Seminar Hall 2", capacity: 80 },
  { id: "photo-walk", title: "Lens & Light Photo Walk", category: "arts", day: "Fri 20 Nov", time: "7:00 AM", venue: "Campus Lake", capacity: 25 },
  { id: "startup-pitch", title: "Startup Pitch Night", category: "careers", day: "Fri 20 Nov", time: "5:00 PM", venue: "Incubation Centre", capacity: 60 },
  { id: "battle-of-bands", title: "Battle of the Bands", category: "culture", day: "Sat 21 Nov", time: "5:30 PM", venue: "Open Air Stage", capacity: 150 },
  { id: "campus-run", title: "Campus Run 5K", category: "sports", day: "Sat 21 Nov", time: "6:30 AM", venue: "Sports Ground", capacity: 120 }
];

const YEARS = ["1st year", "2nd year", "3rd year", "4th year", "Postgraduate"];

const YEAR_COLORS = {
  "1st year": "#a8d61e",
  "2nd year": "#ff5b3d",
  "3rd year": "#58a9ea",
  "4th year": "#5c43e8",
  "Postgraduate": "#ffc247"
};

const AVATAR_COLORS = ["#c9f24a", "#ffb59f", "#b7e3ff", "#c8bdff", "#ffeab0", "#e6f9a8"];

const VIEW_META = {
  overview: { title: "Overview", subtitle: "Registration health at a glance" },
  students: { title: "Students", subtitle: "The full student registration list" },
  analytics: { title: "Participation analysis", subtitle: "Who is taking part, and where" },
  events: { title: "Events", subtitle: "Capacity and check-in by event" }
};

const ICONS = {
  ticket: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h11A1.5 1.5 0 0 1 17 6.5v1.2a2.3 2.3 0 0 0 0 4.6v1.2a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 13.5v-1.2a2.3 2.3 0 0 0 0-4.6V6.5Z" stroke="currentColor" stroke-width="1.4"/><path d="M8 5v10" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2 2"/></svg>',
  users: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="7.4" cy="6.6" r="2.5" stroke="currentColor" stroke-width="1.4"/><path d="M3 15.8c0-2.4 2-4.1 4.4-4.1s4.4 1.7 4.4 4.1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M13.2 4.5a2.4 2.4 0 0 1 0 4.5M14 12.2c1.8.4 3 1.8 3 3.6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
  calendar: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="3" y="4.5" width="14" height="12" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M3 8.2h14M6.7 2.8v3.1M13.3 2.8v3.1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
  layers: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m10 2.8 7 3.6-7 3.6-7-3.6 7-3.6Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="m3.6 10 6.4 3.3 6.4-3.3M3.6 13.4 10 16.7l6.4-3.3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  check: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="7.2" stroke="currentColor" stroke-width="1.4"/><path d="m6.7 10.2 2.2 2.2 4.4-4.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  chart: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 16.5h14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><rect x="4.2" y="10" width="2.5" height="4.4" rx=".7" stroke="currentColor" stroke-width="1.3"/><rect x="8.7" y="6.8" width="2.5" height="7.6" rx=".7" stroke="currentColor" stroke-width="1.3"/><rect x="13.2" y="3.6" width="2.5" height="10.8" rx=".7" stroke="currentColor" stroke-width="1.3"/></svg>',
  star: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 2.8 12 7.3l4.8.6-3.5 3.3.9 4.8-4.2-2.4-4.2 2.4.9-4.8L3.2 7.9 8 7.3 10 2.8Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>',
  arrow: '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  trash: '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2.8 4.3h10.4M6 4.3V2.8h4v1.5M4 4.3l.6 8.2A1 1 0 0 0 5.6 13.4h4.8a1 1 0 0 0 1-1l.6-8.1" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};

/* ------------------------------------------------------------
   2. Helpers
   ------------------------------------------------------------ */
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function escapeHTML(value) {
  return String(value == null ? "" : value).replace(/[&<>"']/g, (character) => {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return map[character];
  });
}

const pad = (number) => String(number).padStart(2, "0");

function formatDate(value, withYear = false) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", withYear
    ? { day: "numeric", month: "short", year: "numeric" }
    : { day: "numeric", month: "short" });
}

function dateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function initials(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "??";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

function avatarColor(key) {
  let hash = 0;
  const value = String(key || "");
  for (let i = 0; i < value.length; i += 1) hash = (hash * 31 + value.charCodeAt(i)) % 997;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

const getEvent = (id) => EVENTS.find((event) => event.id === id);
const eventTitle = (id) => (getEvent(id) ? getEvent(id).title : "Unknown event");
const categoryOf = (id) => (getEvent(id) ? CATEGORIES[getEvent(id).category] : { label: "Other", color: "#9b9d90" });

function percent(part, whole) {
  if (!whole) return 0;
  return Math.min(100, Math.round((part / whole) * 100));
}

function plural(number, singular, pluralForm) {
  return number === 1 ? singular : pluralForm || `${singular}s`;
}

function emptyInline(title = "No data yet") {
  return `<div class="empty-panel" style="padding:22px 16px">
    <strong>${escapeHTML(title)}</strong>
    <p>Load demo data or register a student to see this chart.</p>
  </div>`;
}

/* ------------------------------------------------------------
   3. State & storage
   ------------------------------------------------------------ */
let storageAvailable = true;
let registrations = [];
let activeStudentKey = null;
let toastTimer;

const state = {
  view: "overview",
  search: "",
  year: "all",
  event: "all",
  sort: "recent"
};

function loadRegistrations() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item === "object")
      .map((item) => ({ ...item, attended: Boolean(item.attended) }));
  } catch (error) {
    storageAvailable = false;
    return [];
  }
}

function saveRegistrations() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
    storageAvailable = true;
    return true;
  } catch (error) {
    storageAvailable = false;
    return false;
  }
}

function makeId(existing = new Set()) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id;
  do {
    id = "CF26-";
    for (let i = 0; i < 6; i += 1) id += alphabet[Math.floor(Math.random() * alphabet.length)];
  } while (existing.has(id));
  return id;
}

/* ------------------------------------------------------------
   4. Derived data
   ------------------------------------------------------------ */
function buildStudents(list = registrations) {
  const map = new Map();

  list.forEach((registration) => {
    const key = String(registration.email || registration.studentId || registration.id || "").toLowerCase();
    if (!key) return;
    if (!map.has(key)) {
      map.set(key, {
        key,
        name: registration.fullName || "Unnamed student",
        studentId: registration.studentId || "—",
        email: registration.email || "—",
        phone: registration.phone || "—",
        year: registration.year || "—",
        regs: []
      });
    }
    map.get(key).regs.push(registration);
  });

  return Array.from(map.values()).map((student) => {
    const regs = student.regs.slice().sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    const latest = regs[0] || {};
    return {
      ...student,
      regs,
      eventIds: Array.from(new Set(regs.map((reg) => reg.eventId))),
      attended: regs.filter((reg) => reg.attended).length,
      createdAt: latest.createdAt,
      lastRegistration: latest.createdAt
    };
  });
}

function eventCounts(list = registrations) {
  const counts = {};
  EVENTS.forEach((event) => { counts[event.id] = 0; });
  list.forEach((registration) => {
    if (counts[registration.eventId] == null) counts[registration.eventId] = 0;
    counts[registration.eventId] += 1;
  });
  return counts;
}

function attendanceCounts(list = registrations) {
  const counts = {};
  EVENTS.forEach((event) => { counts[event.id] = 0; });
  list.forEach((registration) => {
    if (registration.attended) {
      if (counts[registration.eventId] == null) counts[registration.eventId] = 0;
      counts[registration.eventId] += 1;
    }
  });
  return counts;
}

function registrationsThisWeek(list = registrations) {
  const cutoff = Date.now() - 7 * 86400000;
  return list.filter((registration) => new Date(registration.createdAt).getTime() >= cutoff).length;
}

function totals() {
  const students = buildStudents();
  const attended = registrations.filter((registration) => registration.attended).length;
  const covered = new Set(registrations.map((registration) => registration.eventId)).size;
  return {
    registrations: registrations.length,
    students: students.length,
    attended,
    covered,
    avgPerStudent: students.length ? registrations.length / students.length : 0,
    repeatStudents: students.filter((student) => student.regs.length >= 2).length,
    checkInRate: percent(attended, registrations.length)
  };
}

/* ------------------------------------------------------------
   5. Overview
   ------------------------------------------------------------ */
function renderOverview() {
  const stats = totals();
  const counts = eventCounts();
  const attendedCounts = attendanceCounts();

  const emptyPanel = $("#overviewEmpty");
  if (emptyPanel) emptyPanel.hidden = registrations.length > 0;

  const kpiGrid = $("#kpiGrid");
  if (kpiGrid) {
    kpiGrid.innerHTML = [
      kpiCard({
        label: "Registrations",
        value: stats.registrations,
        note: `${registrationsThisWeek()} in the last 7 days`,
        accent: "#c9f24a",
        icon: ICONS.ticket
      }),
      kpiCard({
        label: "Unique students",
        value: stats.students,
        note: `${stats.repeatStudents} registered for 2+ events`,
        accent: "#ffb59f",
        icon: ICONS.users
      }),
      kpiCard({
        label: "Events with sign-ups",
        value: stats.covered,
        note: `of ${EVENTS.length} events on the programme`,
        accent: "#b7e3ff",
        icon: ICONS.calendar
      }),
      kpiCard({
        label: "Average events",
        value: stats.avgPerStudent.toFixed(1),
        note: "events per registered student",
        accent: "#c8bdff",
        icon: ICONS.layers
      }),
      kpiCard({
        label: "Check-in rate",
        value: `${stats.checkInRate}%`,
        note: `${stats.attended} of ${stats.registrations} marked as attended`,
        accent: "#ffeab0",
        icon: ICONS.check
      })
    ].join("");
  }

  const eventTotal = $("#eventChartTotal");
  if (eventTotal) eventTotal.textContent = `${stats.registrations} ${plural(stats.registrations, "seat")} filled`;

  const eventBars = $("#eventBars");
  if (eventBars) {
    const rows = EVENTS.map((event) => {
      const count = counts[event.id] || 0;
      const fill = percent(count, event.capacity);
      return {
        label: event.title,
        value: count,
        percent: fill,
        display: `${fill}%`,
        color: CATEGORIES[event.category].color,
        title: `${count} of ${event.capacity} seats filled · ${attendedCounts[event.id] || 0} checked in`
      };
    });
    eventBars.innerHTML = rows.some((row) => row.value > 0)
      ? barList(rows)
      : emptyInline("No event registrations yet");
  }

  const categoryMix = $("#categoryMix");
  if (categoryMix) {
    categoryMix.innerHTML = categoryDonut();
  }

  const trend = renderTrend("trendChart", 21);
  const trendTotal = $("#trendTotal");
  if (trendTotal) trendTotal.textContent = `${trend.week} this week`;

  const topStudents = $("#topStudents");
  if (topStudents) {
    const ranked = buildStudents()
      .sort((a, b) => b.regs.length - a.regs.length || b.attended - a.attended || a.name.localeCompare(b.name))
      .slice(0, 5);

    topStudents.innerHTML = ranked.length
      ? ranked.map((student, index) => `
          <div class="rank-item">
            <span class="rank-num">${index + 1}</span>
            <div class="rank-info">
              <strong>${escapeHTML(student.name)}</strong>
              <span>${escapeHTML(student.year)} · ${escapeHTML(student.studentId)}</span>
            </div>
            <span class="rank-score">${student.regs.length} ${plural(student.regs.length, "event")}</span>
          </div>
        `).join("")
      : emptyInline("No participants yet");
  }

  const recentTable = $("#recentTable");
  if (recentTable) {
    const recent = registrations
      .slice()
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 6);

    if (!recent.length) {
      recentTable.innerHTML = emptyInline("No registrations yet");
    } else {
      recentTable.innerHTML = `
        <div class="table-wrap">
          <table class="data">
            <thead><tr><th>Student</th><th>Event</th><th>Year</th><th>Registered</th><th>Status</th><th><span class="sr-only">Actions</span></th></tr></thead>
            <tbody>
              ${recent.map((registration) => {
                const studentKey = String(registration.email || registration.studentId || registration.id).toLowerCase();
                return `
                  <tr>
                    <td>
                      <div class="student-cell">
                        <span class="avatar" style="--avatar-bg:${avatarColor(studentKey)}">${escapeHTML(initials(registration.fullName))}</span>
                        <div><strong>${escapeHTML(registration.fullName)}</strong><span>${escapeHTML(registration.email || "")}</span></div>
                      </div>
                    </td>
                    <td>${escapeHTML(eventTitle(registration.eventId))}</td>
                    <td>${escapeHTML(registration.year || "—")}</td>
                    <td class="num">${formatDate(registration.createdAt)}</td>
                    <td>${registration.attended ? '<span class="chip chip-lime">Checked in</span>' : '<span class="chip chip-muted">Registered</span>'}</td>
                    <td><button class="row-btn" type="button" data-student="${escapeHTML(studentKey)}" aria-label="Open ${escapeHTML(registration.fullName)}">${ICONS.arrow}</button></td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      `;
    }
  }
}

function kpiCard({ label, value, note, accent, icon }) {
  return `
    <div class="kpi" style="--accent:${accent}">
      <div class="kpi-top">
        <span class="kpi-label">${escapeHTML(label)}</span>
        <span class="kpi-icon">${icon}</span>
      </div>
      <div class="kpi-value">${escapeHTML(String(value))}</div>
      <p class="kpi-note">${escapeHTML(note)}</p>
    </div>
  `;
}

/* ------------------------------------------------------------
   6. Chart primitives
   ------------------------------------------------------------ */
function barList(items) {
  return `<div class="bar-list">${items.map((item) => {
    const width = item.percent != null
      ? item.percent
      : (Math.max(...items.map((entry) => entry.value), 1) ? (item.value / Math.max(...items.map((entry) => entry.value), 1)) * 100 : 0);
    const safeWidth = item.value > 0 ? Math.max(2, Math.min(100, width)) : 0;
    const inner = item.attendedPercent != null
      ? `<span style="display:block;height:100%;width:${Math.min(100, item.attendedPercent)}%;background:var(--lime);border-radius:inherit"></span>`
      : "";
    return `
      <div class="bar-row"${item.title ? ` title="${escapeHTML(item.title)}"` : ""}>
        <span class="bar-label">${escapeHTML(item.label)}</span>
        <span class="bar-track">
          <span class="bar-fill" style="width:${safeWidth}%;--bar-color:${item.color || "var(--ink)"}">${inner}</span>
        </span>
        <span class="bar-value">${escapeHTML(String(item.display != null ? item.display : item.value))}</span>
      </div>
    `;
  }).join("")}</div>`;
}

function categoryDonut(list = registrations) {
  const totalsByCategory = Object.keys(CATEGORIES).map((key) => ({
    key,
    label: CATEGORIES[key].label,
    color: CATEGORIES[key].color,
    value: list.filter((registration) => {
      const event = getEvent(registration.eventId);
      return event && event.category === key;
    }).length
  }));

  const total = totalsByCategory.reduce((sum, entry) => sum + entry.value, 0);
  const present = totalsByCategory.filter((entry) => entry.value > 0);

  let cursor = 0;
  const stops = present.map((entry) => {
    const start = (cursor / total) * 100;
    cursor += entry.value;
    const end = (cursor / total) * 100;
    return `${entry.color} ${start.toFixed(2)}% ${end.toFixed(2)}%`;
  }).join(", ");

  const background = total > 0 ? `conic-gradient(${stops})` : "var(--paper-deep)";

  return `
    <div class="donut-wrap">
      <div class="donut" style="background:${background}" role="img" aria-label="Category share of ${total} registrations">
        <div class="donut-center"><strong>${total}</strong><span>registrations</span></div>
      </div>
      <div class="legend">
        ${totalsByCategory.map((entry) => `
          <div class="legend-item">
            <span class="legend-name"><span class="legend-swatch" style="--swatch:${entry.color}"></span>${escapeHTML(entry.label)}</span>
            <strong>${entry.value}${total ? ` · ${percent(entry.value, total)}%` : ""}</strong>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function buildTrendSeries(days) {
  const buckets = new Map();
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const series = [];
  for (let index = days - 1; index >= 0; index -= 1) {
    const date = new Date(now);
    date.setDate(now.getDate() - index);
    series.push({ date, key: dateKey(date), count: 0 });
    buckets.set(dateKey(date), series[series.length - 1]);
  }

  registrations.forEach((registration) => {
    const created = new Date(registration.createdAt);
    if (Number.isNaN(created.getTime())) return;
    const bucket = buckets.get(dateKey(created));
    if (bucket) bucket.count += 1;
  });

  return series;
}

function renderTrend(containerId, days) {
  const container = document.getElementById(containerId);
  const series = buildTrendSeries(days);
  const counts = series.map((entry) => entry.count);
  const total = counts.reduce((sum, count) => sum + count, 0);
  const week = counts.slice(-7).reduce((sum, count) => sum + count, 0);

  let peakIndex = 0;
  counts.forEach((count, index) => { if (count > counts[peakIndex]) peakIndex = index; });
  const peak = counts[peakIndex] > 0 ? series[peakIndex] : null;

  if (!container) return { total, week, peak };

  const width = 600;
  const height = 180;
  const padLeft = 30;
  const padRight = 10;
  const padTop = 14;
  const padBottom = 30;
  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;
  const max = Math.max(1, ...counts);

  const x = (index) => padLeft + (days === 1 ? plotWidth / 2 : (index / (days - 1)) * plotWidth);
  const y = (value) => padTop + plotHeight - (value / max) * plotHeight;
  const points = series.map((entry, index) => `${index === 0 ? "M" : "L"} ${x(index).toFixed(1)} ${y(entry.count).toFixed(1)}`).join(" ");
  const area = `${points} L ${x(days - 1).toFixed(1)} ${(padTop + plotHeight).toFixed(1)} L ${x(0).toFixed(1)} ${(padTop + plotHeight).toFixed(1)} Z`;

  const labelIndexes = [0, Math.floor((days - 1) / 2), days - 1];
  const labels = labelIndexes.map((index, position) => {
    const anchor = position === 0 ? "start" : position === labelIndexes.length - 1 ? "end" : "middle";
    return `<text class="axis-label" x="${x(index).toFixed(1)}" y="${height - 8}" text-anchor="${anchor}">${formatDate(series[index].date)}</text>`;
  }).join("");

  const grid = [0, 0.5, 1].map((fraction) => {
    const lineY = padTop + plotHeight * fraction;
    return `<line class="grid-line" x1="${padLeft}" x2="${width - padRight}" y1="${lineY.toFixed(1)}" y2="${lineY.toFixed(1)}"/>`;
  }).join("");

  const dots = [];
  if (peak) {
    dots.push(`<circle class="dot" cx="${x(peakIndex).toFixed(1)}" cy="${y(counts[peakIndex]).toFixed(1)}" r="3.4"/>`);
  }
  if (counts[days - 1] > 0) {
    dots.push(`<circle class="dot" cx="${x(days - 1).toFixed(1)}" cy="${y(counts[days - 1]).toFixed(1)}" r="3.4"/>`);
  }

  const peakText = peak ? `${formatDate(peak.date)} · ${counts[peakIndex]} ${plural(counts[peakIndex], "sign-up")}` : "No sign-ups in this window";

  container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${days}-day registration trend: ${total} sign-ups. Peak: ${escapeHTML(peakText)}.">
      ${grid}
      <path class="area" d="${area}"/>
      <path class="line" d="${points}"/>
      ${dots.join("")}
      <text class="axis-label" x="0" y="${(padTop + 4).toFixed(1)}">${max}</text>
      <text class="axis-label" x="0" y="${(padTop + plotHeight).toFixed(1)}">0</text>
      ${labels}
    </svg>
    <div class="chart-caption">
      <span>${days} days · ${total} ${plural(total, "registration")}</span>
      <span>Peak: ${escapeHTML(peakText)}</span>
    </div>
  `;

  return { total, week, peak };
}

/* ------------------------------------------------------------
   7. Students
   ------------------------------------------------------------ */
function filteredStudents() {
  const query = state.search.trim().toLowerCase();
  let students = buildStudents();

  if (state.year !== "all") {
    students = students.filter((student) => student.year === state.year);
  }

  if (state.event !== "all") {
    students = students.filter((student) => student.eventIds.includes(state.event));
  }

  if (query) {
    students = students.filter((student) => {
      const events = student.eventIds.map(eventTitle).join(" ");
      return [student.name, student.studentId, student.email, student.phone, student.year, events]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }

  const sorters = {
    recent: (a, b) => new Date(b.lastRegistration || 0) - new Date(a.lastRegistration || 0),
    name: (a, b) => a.name.localeCompare(b.name),
    events: (a, b) => b.regs.length - a.regs.length || b.attended - a.attended || a.name.localeCompare(b.name),
    attendance: (a, b) => b.attended - a.attended || b.regs.length - a.regs.length || a.name.localeCompare(b.name)
  };

  return students.sort(sorters[state.sort] || sorters.recent);
}

function renderStudents() {
  const table = $("#studentTable");
  if (!table) return;

  const students = filteredStudents();
  const count = $("#studentCount");
  if (count) count.textContent = `${students.length} ${plural(students.length, "student")}`;

  if (!students.length) {
    table.innerHTML = emptyInline(registrations.length ? "No students match these filters" : "No students registered yet");
    return;
  }

  table.innerHTML = `
    <div class="table-wrap">
      <table class="data">
        <thead>
          <tr>
            <th>Student</th>
            <th>Student ID</th>
            <th>Year</th>
            <th>Events</th>
            <th>Check-ins</th>
            <th>Last registered</th>
            <th><span class="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          ${students.map((student) => {
            const chips = student.eventIds.slice(0, 3).map((id) => `<span class="chip">${escapeHTML(eventTitle(id))}</span>`);
            if (student.eventIds.length > 3) chips.push(`<span class="chip chip-muted">+${student.eventIds.length - 3} more</span>`);
            return `
              <tr>
                <td>
                  <div class="student-cell">
                    <span class="avatar" style="--avatar-bg:${avatarColor(student.key)}">${escapeHTML(initials(student.name))}</span>
                    <div><strong>${escapeHTML(student.name)}</strong><span>${escapeHTML(student.email)}</span></div>
                  </div>
                </td>
                <td class="num">${escapeHTML(student.studentId)}</td>
                <td>${escapeHTML(student.year)}</td>
                <td><div class="event-chips">${chips.join("")}</div></td>
                <td class="num">${student.attended}/${student.regs.length}</td>
                <td class="num">${formatDate(student.lastRegistration, true)}</td>
                <td><button class="row-btn" type="button" data-student="${escapeHTML(student.key)}" aria-label="Open ${escapeHTML(student.name)}">${ICONS.arrow}</button></td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function openStudent(key) {
  activeStudentKey = key;
  const student = buildStudents().find((entry) => entry.key === key);
  const dialog = $("#studentDialog");
  const body = $("#studentDialogBody");
  if (!student || !dialog || !body) return;

  const sortedRegs = student.regs.slice().sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  const checkInRate = percent(student.attended, sortedRegs.length);

  body.innerHTML = `
    <div class="modal-head">
      <span class="avatar" style="--avatar-bg:${avatarColor(student.key)}">${escapeHTML(initials(student.name))}</span>
      <div>
        <h2 id="studentDialogTitle">${escapeHTML(student.name)}</h2>
        <p>${escapeHTML(student.email)} · ${escapeHTML(student.studentId)}</p>
      </div>
    </div>

    <div class="modal-stats">
      <div class="modal-stat"><span>Year</span><strong>${escapeHTML(student.year)}</strong></div>
      <div class="modal-stat"><span>Events</span><strong>${student.regs.length}</strong></div>
      <div class="modal-stat"><span>Check-ins</span><strong>${student.attended}/${student.regs.length} · ${checkInRate}%</strong></div>
    </div>

    <p class="modal-section-title">Registrations &amp; attendance</p>
    <div class="registration-list">
      ${sortedRegs.map((registration) => `
        <div class="registration-item">
          <div class="reg-main">
            <strong>${escapeHTML(eventTitle(registration.eventId))}</strong>
            <span>${escapeHTML(registration.id || "—")} · registered ${formatDate(registration.createdAt, true)}</span>
          </div>
          <button class="checkin-toggle${registration.attended ? " is-on" : ""}" type="button"
            data-checkin="${escapeHTML(registration.id)}" aria-pressed="${registration.attended ? "true" : "false"}"
            aria-label="Toggle check-in for ${escapeHTML(eventTitle(registration.eventId))}">
            ${registration.attended ? "Checked in" : "Check in"}
          </button>
          <button class="row-btn is-danger" type="button" data-remove-reg="${escapeHTML(registration.id)}"
            aria-label="Remove registration" title="Remove registration">${ICONS.trash}</button>
        </div>
      `).join("")}
    </div>

    <p class="modal-section-title">Contact</p>
    <div class="mini-stats">
      <div class="mini-stat"><span>Email</span><strong style="font-size:.74rem;word-break:break-word">${escapeHTML(student.email)}</strong></div>
      <div class="mini-stat"><span>Phone</span><strong style="font-size:.74rem">${escapeHTML(student.phone)}</strong></div>
    </div>

    <div class="modal-actions">
      <a class="btn btn-dark btn-sm" href="mailto:${encodeURIComponent(student.email)}">
        Email student
      </a>
      <button class="btn btn-outline btn-sm" type="button" data-remove-student="${escapeHTML(student.key)}">
        Remove all registrations
      </button>
    </div>
  `;

  if (typeof dialog.showModal === "function") {
    if (!dialog.open) dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function closeStudentDialog() {
  const dialog = $("#studentDialog");
  if (dialog && typeof dialog.close === "function" && dialog.open) dialog.close();
  else if (dialog) dialog.removeAttribute("open");
  activeStudentKey = null;
}

/* ------------------------------------------------------------
   8. Analytics
   ------------------------------------------------------------ */
function renderAnalytics() {
  const stats = totals();
  const counts = eventCounts();
  const attendedCounts = attendanceCounts();
  const students = buildStudents();

  const analyticsKpis = $("#analyticsKpis");
  if (analyticsKpis) {
    const top = EVENTS
      .map((event) => ({ event, count: counts[event.id] || 0 }))
      .sort((a, b) => b.count - a.count)[0];

    analyticsKpis.innerHTML = [
      kpiCard({
        label: "Total participation",
        value: stats.registrations,
        note: "seats reserved across all events",
        accent: "#c9f24a",
        icon: ICONS.ticket
      }),
      kpiCard({
        label: "Unique students",
        value: stats.students,
        note: `${(stats.avgPerStudent || 0).toFixed(1)} events per student on average`,
        accent: "#ffb59f",
        icon: ICONS.users
      }),
      kpiCard({
        label: "Repeat participants",
        value: stats.students ? `${percent(stats.repeatStudents, stats.students)}%` : "0%",
        note: `${stats.repeatStudents} students joined 2+ events`,
        accent: "#c8bdff",
        icon: ICONS.layers
      }),
      kpiCard({
        label: "Attendance rate",
        value: `${stats.checkInRate}%`,
        note: `${stats.attended} check-ins recorded`,
        accent: "#ffeab0",
        icon: ICONS.check
      }),
      kpiCard({
        label: "Most popular",
        value: top ? top.count : 0,
        note: top && top.count ? `${top.event.title} leads sign-ups` : "No registrations yet",
        accent: "#b7e3ff",
        icon: ICONS.star
      })
    ].join("");
  }

  const attendanceRateChip = $("#attendanceRateChip");
  if (attendanceRateChip) attendanceRateChip.textContent = `${stats.checkInRate}% check-in`;

  const attendanceBars = $("#attendanceBars");
  if (attendanceBars) {
    const rows = EVENTS.map((event) => {
      const registered = counts[event.id] || 0;
      const attended = attendedCounts[event.id] || 0;
      return {
        label: event.title,
        value: registered,
        percent: percent(registered, event.capacity),
        attendedPercent: registered ? percent(attended, registered) : 0,
        display: `${attended}/${registered}`,
        color: "var(--ink)",
        title: `${registered} registered · ${attended} checked in · ${event.capacity} capacity`
      };
    });
    attendanceBars.innerHTML = rows.some((row) => row.value > 0)
      ? `${barList(rows)}
        <div class="chart-caption">
          <span><span class="legend-swatch" style="--swatch:var(--ink);display:inline-block;margin-right:5px"></span>Registration volume</span>
          <span><span class="legend-swatch" style="--swatch:var(--lime);display:inline-block;margin-right:5px"></span>Checked in</span>
        </div>`
      : emptyInline("No attendance data yet");
  }

  const analyticsCategory = $("#analyticsCategory");
  if (analyticsCategory) analyticsCategory.innerHTML = categoryDonut();

  const yearBars = $("#yearBars");
  if (yearBars) {
    const rows = YEARS.map((year) => ({
      label: year,
      value: registrations.filter((registration) => registration.year === year).length,
      color: YEAR_COLORS[year]
    }));
    yearBars.innerHTML = rows.some((row) => row.value > 0) ? barList(rows) : emptyInline("No year data yet");
  }

  const participationBands = $("#participationBands");
  if (participationBands) {
    const bandCounts = [0, 0, 0, 0];
    students.forEach((student) => {
      const count = student.regs.length;
      if (count >= 4) bandCounts[3] += 1;
      else if (count >= 1) bandCounts[count - 1] += 1;
    });
    const rows = [
      { label: "1 event", value: bandCounts[0], color: "#a8d61e" },
      { label: "2 events", value: bandCounts[1], color: "#58a9ea" },
      { label: "3 events", value: bandCounts[2], color: "#5c43e8" },
      { label: "4+ events", value: bandCounts[3], color: "#ff5b3d" }
    ];
    participationBands.innerHTML = rows.some((row) => row.value > 0)
      ? `${barList(rows)}
        <div class="chart-caption"><span>${students.length} unique students</span><span>${stats.repeatStudents} repeat participants</span></div>`
      : emptyInline("No participation data yet");
  }

  const trend = renderTrend("analyticsTrend", 21);
  const peakDayChip = $("#peakDayChip");
  if (peakDayChip) {
    peakDayChip.textContent = trend.peak ? `Peak ${formatDate(trend.peak.date)} · ${trend.peak.count} sign-ups` : "No sign-ups yet";
  }

  const attendanceTable = $("#attendanceTable");
  if (attendanceTable) {
    attendanceTable.innerHTML = `
      <div class="table-wrap">
        <table class="data">
          <thead>
            <tr><th>Event</th><th>Track</th><th>Registered</th><th>Checked in</th><th>Attendance</th><th>Seats left</th><th>Fill</th></tr>
          </thead>
          <tbody>
            ${EVENTS.map((event) => {
              const registered = counts[event.id] || 0;
              const attended = attendedCounts[event.id] || 0;
              const left = Math.max(0, event.capacity - registered);
              const attendanceRate = percent(attended, registered);
              const fill = percent(registered, event.capacity);
              return `
                <tr>
                  <td><strong>${escapeHTML(event.title)}</strong></td>
                  <td>${escapeHTML(CATEGORIES[event.category].label)}</td>
                  <td class="num">${registered}</td>
                  <td class="num">${attended}</td>
                  <td class="num">${registered ? `${attendanceRate}%` : "—"}</td>
                  <td class="num">${left}</td>
                  <td><span class="chip ${fill >= 90 ? "chip-coral" : fill >= 60 ? "chip-lime" : "chip-muted"}">${fill}%</span></td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    `;
  }
}

/* ------------------------------------------------------------
   9. Events view
   ------------------------------------------------------------ */
function renderEvents() {
  const cards = $("#eventCards");
  if (!cards) return;

  const counts = eventCounts();
  const attendedCounts = attendanceCounts();
  const dataCount = $("#dataCount");
  if (dataCount) dataCount.textContent = `${registrations.length} ${plural(registrations.length, "row")}`;

  cards.innerHTML = EVENTS.map((event) => {
    const category = CATEGORIES[event.category];
    const registered = counts[event.id] || 0;
    const attended = attendedCounts[event.id] || 0;
    const left = Math.max(0, event.capacity - registered);
    const fill = percent(registered, event.capacity);
    const status = fill >= 100 ? "Full" : fill >= 80 ? "Almost full" : fill >= 40 ? "Filling" : "Open";

    return `
      <article class="event-admin-card">
        <div class="event-admin-art art--${event.category}">
          <span class="art-word" aria-hidden="true">${category.artWord}</span>
          <span class="chip">${escapeHTML(category.label)}</span>
          <span class="chip chip-ink">${fill}% full</span>
        </div>
        <div class="event-admin-body">
          <h3>${escapeHTML(event.title)}</h3>
          <p class="event-admin-meta">${escapeHTML(event.day)} · ${escapeHTML(event.time)}<br>${escapeHTML(event.venue)}</p>
          <div class="event-fill">
            <div class="fill-meta">
              <span><strong>${registered}</strong> registered</span>
              <span>${event.capacity} capacity</span>
            </div>
            <div class="fill-track${fill >= 80 ? " is-high" : ""}"><span style="width:${fill}%"></span></div>
          </div>
          <div class="event-admin-foot">
            <span><strong>${left}</strong> ${plural(left, "seat")} left</span>
            <span>${attended} checked in</span>
          </div>
          <div class="event-admin-foot" style="margin-top:8px;padding-top:8px">
            <span class="chip ${status === "Full" ? "chip-coral" : status === "Almost full" ? "chip-lime" : "chip-muted"}">${status}</span>
            <button class="card-link" type="button" data-goto-event="${event.id}">View students</button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

/* ------------------------------------------------------------
   10. Add registration
   ------------------------------------------------------------ */
const addFields = {
  addName: { validator: (value) => value.trim().length >= 2 ? "" : "Enter the student's full name." },
  addStudentId: { validator: (value) => /^[A-Za-z0-9-]{4,20}$/.test(value.trim()) ? "" : "Use 4–20 letters, numbers or hyphens." },
  addEmail: { validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()) ? "" : "Enter a valid email address." },
  addPhone: { validator: (value) => {
    const digits = value.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 13 ? "" : "Enter 10–13 digits.";
  } },
  addYear: { validator: (value) => value ? "" : "Select a year of study." },
  addEvent: { validator: (value) => value ? "" : "Select an event." }
};

function setAddError(id, message) {
  const input = document.getElementById(id);
  if (!input) return;
  const field = input.closest(".field");
  if (field) field.classList.toggle("has-error", Boolean(message));
  input.setAttribute("aria-invalid", message ? "true" : "false");
  const error = document.getElementById(`${id}Error`);
  if (error) error.textContent = message;
}

function clearAddErrors() {
  Object.keys(addFields).forEach((id) => setAddError(id, ""));
  const alert = $("#addAlert");
  if (alert) {
    alert.hidden = true;
    alert.textContent = "";
  }
}

function populateAddEventOptions() {
  const select = $("#addEvent");
  if (!select) return;
  const counts = eventCounts();
  const current = select.value;
  select.innerHTML = '<option value="">Select event</option>' + EVENTS.map((event) => {
    const registered = counts[event.id] || 0;
    const left = Math.max(0, event.capacity - registered);
    return `<option value="${event.id}"${left === 0 ? " disabled" : ""}>${escapeHTML(event.title)} — ${left} ${plural(left, "seat")} left${left === 0 ? " (full)" : ""}</option>`;
  }).join("");
  if (current) select.value = current;
}

function openAddDialog() {
  const dialog = $("#addDialog");
  if (!dialog) return;
  const form = $("#addForm");
  if (form) form.reset();
  clearAddErrors();
  populateAddEventOptions();

  if (typeof dialog.showModal === "function") {
    if (!dialog.open) dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
  window.setTimeout(() => {
    const name = $("#addName");
    if (name) name.focus();
  }, 80);
}

function closeAddDialog() {
  const dialog = $("#addDialog");
  if (dialog && typeof dialog.close === "function" && dialog.open) dialog.close();
  else if (dialog) dialog.removeAttribute("open");
}

function setupAddForm() {
  const form = $("#addForm");
  if (!form) return;

  Object.keys(addFields).forEach((id) => {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener("input", () => {
      if (input.closest(".field") && input.closest(".field").classList.contains("has-error")) {
        setAddError(id, addFields[id].validator(input.value));
      }
    });
    input.addEventListener("change", () => setAddError(id, addFields[id].validator(input.value)));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let firstInvalid = null;

    Object.keys(addFields).forEach((id) => {
      const input = document.getElementById(id);
      const message = addFields[id].validator(input ? input.value : "");
      setAddError(id, message);
      if (message && !firstInvalid) firstInvalid = input;
    });

    const eventSelect = $("#addEvent");
    const eventId = eventSelect ? eventSelect.value : "";
    const emailInput = $("#addEmail");

    if (!firstInvalid && eventId && emailInput) {
      const duplicate = registrations.some(
        (registration) => registration.eventId === eventId &&
          String(registration.email || "").toLowerCase() === emailInput.value.trim().toLowerCase()
      );
      if (duplicate) {
        setAddError("addEmail", "This email is already registered for that event.");
        firstInvalid = emailInput;
      }
    }

    if (firstInvalid) {
      const alert = $("#addAlert");
      if (alert) {
        alert.textContent = "Please fix the highlighted fields and try again.";
        alert.hidden = false;
      }
      firstInvalid.focus();
      return;
    }

    const selectedEvent = getEvent(eventId);
    if (!selectedEvent) {
      setAddError("addEvent", "Choose a valid event.");
      return;
    }

    const existingIds = new Set(registrations.map((registration) => registration.id));
    const registration = {
      id: makeId(existingIds),
      fullName: $("#addName").value.trim(),
      studentId: $("#addStudentId").value.trim().toUpperCase(),
      email: $("#addEmail").value.trim(),
      phone: $("#addPhone").value.trim(),
      year: $("#addYear").value,
      eventId,
      notes: $("#addNotes") ? $("#addNotes").value.trim() : "",
      createdAt: new Date().toISOString(),
      attended: Boolean($("#addAttended") && $("#addAttended").checked)
    };

    registrations.push(registration);
    const saved = saveRegistrations();
    closeAddDialog();
    refreshAll();
    showToast(saved ? "Registration added." : "Added for this visit — local storage is unavailable.");
  });
}

/* ------------------------------------------------------------
   11. Student list actions
   ------------------------------------------------------------ */
function toggleCheckIn(registrationId) {
  const registration = registrations.find((entry) => entry.id === registrationId);
  if (!registration) return;

  registration.attended = !registration.attended;
  const saved = saveRegistrations();
  refreshAll();

  if (activeStudentKey) openStudent(activeStudentKey);
  else closeStudentDialog();

  showToast(saved
    ? registration.attended ? "Marked as checked in." : "Check-in removed."
    : "Updated for this visit only.");
}

function removeRegistration(registrationId) {
  const registration = registrations.find((entry) => entry.id === registrationId);
  if (!registration) return;
  if (!window.confirm(`Remove ${registration.fullName}'s registration for ${eventTitle(registration.eventId)}?`)) return;

  registrations = registrations.filter((entry) => entry.id !== registrationId);
  saveRegistrations();
  refreshAll();

  if (activeStudentKey) {
    const stillExists = buildStudents().some((student) => student.key === activeStudentKey);
    if (stillExists) openStudent(activeStudentKey);
    else closeStudentDialog();
  }
  showToast("Registration removed.");
}

function removeStudent(key) {
  const student = buildStudents().find((entry) => entry.key === key);
  if (!student) return;
  if (!window.confirm(`Remove all ${student.regs.length} registration(s) for ${student.name}?`)) return;

  registrations = registrations.filter((registration) => {
    const regKey = String(registration.email || registration.studentId || registration.id || "").toLowerCase();
    return regKey !== key;
  });
  saveRegistrations();
  closeStudentDialog();
  refreshAll();
  showToast("Student removed from the list.");
}

/* ------------------------------------------------------------
   12. Demo data, export & reset
   ------------------------------------------------------------ */
const DEMO_NAMES = [
  "Aarav Sharma", "Diya Patel", "Kabir Nair", "Ananya Rao", "Vihaan Mehta",
  "Isha Iyer", "Arjun Reddy", "Meera Krishnan", "Rohan Das", "Saanvi Joshi",
  "Aditya Menon", "Riya Kapoor", "Karan Bhatia", "Nisha Verma", "Siddharth Pillai",
  "Tanvi Shah", "Rahul Gupta", "Pooja Sinha", "Yash Chauhan", "Aisha Khan",
  "Neel Kulkarni", "Sana Sheikh", "Dhruv Malhotra", "Ira Bose", "Manav Jain",
  "Kavya Suresh", "Pranav Desai", "Zara Ali"
];

const DEMO_DEPARTMENTS = ["CS", "EC", "ME", "CE", "EE", "BT", "BA"];

function buildDemoData() {
  const now = Date.now();
  const usedIds = new Set();
  const demo = [];

  DEMO_NAMES.forEach((name, index) => {
    const department = DEMO_DEPARTMENTS[index % DEMO_DEPARTMENTS.length];
    const studentId = `NF${22 + (index % 4)}${department}${String(101 + index)}`;
    const email = `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@northfield.edu`;
    const year = ["1st year", "1st year", "2nd year", "2nd year", "3rd year", "3rd year", "4th year", "Postgraduate"][index % 8];
    const phone = `+91 9${String(800000000 + index * 1234567).slice(0, 9)}`;

    const picks = new Set([index % EVENTS.length]);
    const soloParticipant = index % 7 === 0;
    if (!soloParticipant) {
      picks.add((index * 3 + 1) % EVENTS.length);
      if (index % 3 === 0) picks.add((index * 5 + 4) % EVENTS.length);
      if (index % 5 === 0) picks.add((index * 7 + 2) % EVENTS.length);
    }

    Array.from(picks).forEach((eventIndex, pickIndex) => {
      const event = EVENTS[eventIndex];
      const ageDays = (index * 3 + pickIndex * 5) % 20;
      const hoursAgo = (index * 7 + pickIndex * 11) % 24;
      const createdAt = new Date(now - ageDays * 86400000 - hoursAgo * 3600000).toISOString();
      demo.push({
        id: makeId(usedIds),
        fullName: name,
        studentId,
        email,
        phone,
        year,
        eventId: event.id,
        notes: pickIndex === 0 && event.category === "technology" ? "Looking for a team of three." : "",
        createdAt,
        attended: (index + pickIndex) % 3 !== 0
      });
      usedIds.add(demo[demo.length - 1].id);
    });
  });

  return demo;
}

function seedDemoData() {
  if (registrations.length) {
    const proceed = window.confirm(
      `Replace the ${registrations.length} registration(s) currently in this browser with demo data?\n\nExport a CSV first if you need to keep them.`
    );
    if (!proceed) return;
  }

  registrations = buildDemoData();
  saveRegistrations();
  refreshAll();
  showToast(`Loaded ${registrations.length} demo registrations across ${EVENTS.length} events.`);
}

function clearAllData() {
  if (!registrations.length) {
    showToast("There is nothing to clear.");
    return;
  }
  if (!window.confirm("Remove every registration from this browser? This cannot be undone.")) return;

  registrations = [];
  saveRegistrations();
  refreshAll();
  showToast("All registrations cleared.");
}

function exportCSV() {
  if (!registrations.length) {
    showToast("There are no registrations to export yet.");
    return;
  }

  const rows = registrations
    .slice()
    .sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0))
    .map((registration) => {
      const event = getEvent(registration.eventId);
      return [
        registration.id || "",
        registration.fullName || "",
        registration.studentId || "",
        registration.email || "",
        registration.phone || "",
        registration.year || "",
        event ? event.title : registration.eventId || "",
        event ? CATEGORIES[event.category].label : "",
        registration.createdAt || "",
        registration.attended ? "Yes" : "No"
      ];
    });

  const header = ["Registration ID", "Full name", "Student ID", "Email", "Phone", "Year", "Event", "Track", "Registered at", "Checked in"];
  const escapeCell = (value) => `"${String(value == null ? "" : value).replace(/"/g, '""')}"`;
  const csv = [header, ...rows].map((row) => row.map(escapeCell).join(",")).join("\r\n");

  const blob = new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `campusfest-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast(`Exported ${registrations.length} registrations.`);
}

/* ------------------------------------------------------------
   13. Views, toast & wiring
   ------------------------------------------------------------ */
function setView(name, updateHash = true) {
  const view = VIEW_META[name] ? name : "overview";
  state.view = view;

  $$(".admin-nav-link").forEach((link) => {
    const active = link.dataset.view === view;
    link.classList.toggle("is-active", active);
    link.setAttribute("aria-current", active ? "page" : "false");
  });

  $$("[data-view-panel]").forEach((panel) => {
    const active = panel.dataset.viewPanel === view;
    panel.hidden = !active;
    if (active) {
      panel.classList.remove("admin-view");
      void panel.offsetWidth;
      panel.classList.add("admin-view");
    }
  });

  const title = $("#viewTitle");
  if (title) title.textContent = VIEW_META[view].title;
  document.title = `${VIEW_META[view].title} — CampusFest '26 Organiser`;

  if (updateHash) {
    try { window.history.replaceState(null, "", `#${view}`); }
    catch (error) { window.location.hash = view; }
  }

  window.scrollTo({ top: 0, behavior: "auto" });
}

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3600);
}

function updateStorageState() {
  const card = $("#storageCard");
  const label = $("#storageState");
  if (card) card.classList.toggle("is-offline", !storageAvailable);
  if (label) label.textContent = storageAvailable ? "Local storage ready" : "Storage unavailable";
}

function refreshAll() {
  renderOverview();
  renderStudents();
  renderAnalytics();
  renderEvents();
  updateStorageState();
}

function populateFilters() {
  const eventFilter = $("#eventFilter");
  if (eventFilter) {
    eventFilter.innerHTML = '<option value="all">All events</option>' + EVENTS
      .map((event) => `<option value="${event.id}">${escapeHTML(event.title)}</option>`)
      .join("");
  }
  populateAddEventOptions();
}

function setupEvents() {
  $$(".admin-nav-link").forEach((link) => {
    link.addEventListener("click", () => setView(link.dataset.view));
  });

  $$("[data-goto]").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.goto));
  });

  document.addEventListener("click", (event) => {
    const eventLink = event.target.closest("[data-goto-event]");
    if (eventLink) {
      state.event = eventLink.dataset.gotoEvent;
      const filter = $("#eventFilter");
      if (filter) filter.value = state.event;
      setView("students");
      renderStudents();
      return;
    }

    const studentButton = event.target.closest("[data-student]");
    if (studentButton) {
      openStudent(studentButton.dataset.student);
    }
  });

  const search = $("#studentSearch");
  if (search) {
    search.addEventListener("input", () => {
      state.search = search.value;
      renderStudents();
    });
  }

  const yearFilter = $("#yearFilter");
  if (yearFilter) {
    yearFilter.addEventListener("change", () => {
      state.year = yearFilter.value;
      renderStudents();
    });
  }

  const eventFilter = $("#eventFilter");
  if (eventFilter) {
    eventFilter.addEventListener("change", () => {
      state.event = eventFilter.value;
      renderStudents();
    });
  }

  const sortFilter = $("#sortFilter");
  if (sortFilter) {
    sortFilter.addEventListener("change", () => {
      state.sort = sortFilter.value;
      renderStudents();
    });
  }

  const addStudentBtn = $("#addStudentBtn");
  if (addStudentBtn) addStudentBtn.addEventListener("click", openAddDialog);

  const addDialogClose = $("#addDialogClose");
  if (addDialogClose) addDialogClose.addEventListener("click", closeAddDialog);
  const addDialog = $("#addDialog");
  if (addDialog) {
    addDialog.addEventListener("click", (event) => {
      if (event.target === addDialog) closeAddDialog();
    });
  }

  const studentDialogClose = $("#studentDialogClose");
  if (studentDialogClose) studentDialogClose.addEventListener("click", closeStudentDialog);
  const studentDialog = $("#studentDialog");
  if (studentDialog) {
    studentDialog.addEventListener("click", (event) => {
      if (event.target === studentDialog) closeStudentDialog();
    });
    studentDialog.addEventListener("close", () => { activeStudentKey = null; });
  }

  const studentDialogBody = $("#studentDialogBody");
  if (studentDialogBody) {
    studentDialogBody.addEventListener("click", (event) => {
      const checkin = event.target.closest("[data-checkin]");
      if (checkin) {
        toggleCheckIn(checkin.dataset.checkin);
        return;
      }
      const removeReg = event.target.closest("[data-remove-reg]");
      if (removeReg) {
        removeRegistration(removeReg.dataset.removeReg);
        return;
      }
      const removeAll = event.target.closest("[data-remove-student]");
      if (removeAll) {
        removeStudent(removeAll.dataset.removeStudent);
      }
    });
  }

  $$("#seedBtn, [data-action='seed']").forEach((button) => button.addEventListener("click", seedDemoData));
  $$("#exportBtn, [data-action='export']").forEach((button) => button.addEventListener("click", exportCSV));

  const clearBtn = $("#clearBtn");
  if (clearBtn) clearBtn.addEventListener("click", clearAllData);

  window.addEventListener("hashchange", () => {
    const name = window.location.hash.replace("#", "");
    if (VIEW_META[name] && name !== state.view) setView(name, false);
  });

  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;
    registrations = loadRegistrations();
    refreshAll();
    showToast("Registrations updated from another tab.");
  });
}

/* ------------------------------------------------------------
   14. Init
   ------------------------------------------------------------ */
function init() {
  registrations = loadRegistrations();
  populateFilters();
  setupAddForm();
  setupEvents();
  refreshAll();

  const fromHash = window.location.hash.replace("#", "");
  setView(VIEW_META[fromHash] ? fromHash : "overview", false);
}

init();

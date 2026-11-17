# CampusFest '26 — College Event Management & Student Participation

A self-contained front-end for a college festival. Students can browse events, check the schedule, get a recommendation from the festival guide and register; organisers get a dashboard with the full student list, event capacity and participation analysis.

There is no build step, backend, database or login. Registrations are stored in the visitor's own browser (`localStorage`), so the site runs from a folder or any static host.

## Open the site

Open `index.html` directly, or serve the folder locally:

```bash
cd "/Users/achuthevuri/Documents/Default Project"
ruby -run -e httpd . -p 8000
```

Then visit <http://localhost:8000/>. The organiser dashboard is at <http://localhost:8000/admin.html> and is linked from the main navigation, hero pass and footer.

## What's included

### Student site (`index.html`)

- **Hero** with a live countdown, festival pass artwork and seat totals.
- **8 events** across technology, culture, sports, careers and arts, with category filters, live seat counts, details dialogs and capacity guards.
- **16-session schedule** across four days with accessible tabs.
- **Registration form** with inline validation, duplicate-registration checks, a generated pass ID and an instant printable student pass.
- **Calendar export** (`.ics`) and print support for the pass.
- **Festival guide chat assistant** — an offline, rule-based helper that recommends events from your interests, answers questions about dates, venues, seats, teams and what to bring, and pre-fills the registration form when you pick an event.
- **About, contact cards and FAQ**.

### Organiser dashboard (`admin.html`)

- **Overview** — registrations, unique students, event coverage, average events per student, check-in rate, seats filled per event, category mix, a 21-day registration trend and recent sign-ups.
- **Students** — the full student list with search, year/event filters, sorting, event chips, check-in counts, student detail dialog, attendance toggles and walk-in registration.
- **Analytics** — registrations vs check-ins, category share, year-of-study split, events-per-student distribution, daily trend and an event attendance table.
- **Events** — capacity cards for every event with fill percentage, seats left, check-in counts and a link to the filtered student list.
- **CSV export** of every registration (including attendance) and **demo data** to explore the dashboard immediately.

The dashboard reads the same `localStorage` key as the student site (`campusfest26.registrations.v1`), so any registration made on the site appears in the dashboard immediately, including across open tabs.

## Project structure

```
index.html    Student-facing festival site
styles.css    Student site styling and responsive rules
app.js        Event rendering, schedule, form validation, pass, calendar export
chatbot.css   Festival guide chat styling and responsive rules
chatbot.js    Offline event recommendations and question answering

admin.html    Organiser dashboard
admin.css     Dashboard layout, charts and responsive rules
admin.js      Student aggregation, analytics, attendance, CSV and demo data

archive/      Earlier site versions (not used by the current site)
```

## Data & demo notes

- A registration stores the pass ID, name, student ID, email, phone, year, event ID, notes, registration timestamp and an attendance flag.
- **Load demo data** replaces the current registrations after a confirmation. Export a CSV first if you need to keep them.
- Demo data is illustrative (28 students, 59 registrations, some repeat and single-event participants) and is generated in `admin.js`.
- Clearing browser storage or using a different browser/device starts with an empty dashboard.
- If local storage is unavailable, the sites still work in memory for the current visit and the dashboard shows a storage warning.

## Limitations

This is a front-end demo, not a production event-management system. There is no authentication, so the dashboard is not access-controlled, and data is not shared between devices. A real deployment would need a backend, accounts, validation on the server and a proper database.

The festival guide is a rule-based assistant, not a live language model. It makes no network calls, needs no API key and answers only from the event data in `app.js`. It can recommend events, explain details and pre-fill the form, but it will hand off anything outside the programme with a fallback reply.

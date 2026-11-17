/* ============================================================
   CampusFest '26 — festival guide chat assistant
   A small, offline, rule-based guide that uses the event data
   already defined in app.js. No API keys, network calls or
   third-party services are involved.
   ============================================================ */

"use strict";

(function () {
  const launcher = document.getElementById("chatLauncher");
  const panel = document.getElementById("chatPanel");
  const log = document.getElementById("chatLog");
  const quick = document.getElementById("chatQuick");
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");
  const closeButton = document.getElementById("chatClose");
  const openers = document.querySelectorAll("[data-chat-open]");

  if (!launcher || !panel || !log || !quick || !form || !input) return;
  if (typeof EVENTS === "undefined" || typeof CATEGORIES === "undefined") return;

  /* ----------------------------------------------------------
     Data & helpers
     ---------------------------------------------------------- */
  const esc = (value) =>
    typeof escapeHTML === "function"
      ? escapeHTML(value)
      : String(value).replace(/[&<>"']/g, (character) => {
          const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
          return map[character];
        });

  const findById = (id) =>
    typeof getEvent === "function" ? getEvent(id) : EVENTS.find((event) => event.id === id);

  const seatsRemaining = (event) =>
    typeof seatsLeft === "function" ? seatsLeft(event) : event.capacity;

  const normalize = (value) =>
    String(value)
      .toLowerCase()
      .replace(/[’']/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  function matchTerm(text, term) {
    const cleaned = normalize(term);
    if (!cleaned) return false;
    return new RegExp(`(^| )${escapeRegExp(cleaned)}(?= |$)`).test(text);
  }

  const KEYWORDS = {
    codestorm: [
      "code", "coding", "coder", "hack", "hackathon", "programming", "programmer",
      "tech", "technology", "developer", "software", "build", "building", "computer science",
      "cs", "prototype", "engineering", "stem"
    ],
    "neon-nights": [
      "music", "dance", "dancing", "cultural", "culture", "concert", "show", "performance",
      "fashion", "party", "singing", "sing", "night", "entertainment", "fest"
    ],
    "hoops-3v3": [
      "basketball", "hoops", "sport", "sports", "game", "games", "team", "tournament",
      "court", "athlete", "athletic", "play", "compete", "competition", "ball"
    ],
    "ai-career": [
      "career", "careers", "job", "jobs", "internship", "internships", "intern", "resume",
      "cv", "ai", "artificial intelligence", "future", "professional", "alumni", "portfolio",
      "interview", "placement", "work"
    ],
    "photo-walk": [
      "photo", "photos", "photography", "camera", "cameras", "art", "arts", "creative",
      "walk", "visual", "composition", "golden hour", "lens", "sunrise"
    ],
    "startup-pitch": [
      "startup", "startups", "business", "pitch", "founder", "founders", "entrepreneur",
      "entrepreneurship", "investor", "investors", "idea", "ideas", "funding", "mentor",
      "mentorship", "company", "venture"
    ],
    "battle-of-bands": [
      "band", "bands", "music", "rock", "sing", "song", "songs", "concert", "live",
      "stage", "performance", "performer", "guitar", "drums", "gig"
    ],
    "campus-run": [
      "run", "running", "runner", "5k", "five k", "fitness", "sport", "sports", "morning",
      "jog", "jogging", "race", "walk", "health", "outdoors", "training", "marathon"
    ]
  };

  const ALIASES = {
    codestorm: ["codestorm", "code storm", "hackathon", "code storm hackathon"],
    "neon-nights": ["neon nights", "neon", "cultural fest", "cultural night"],
    "hoops-3v3": ["hoops", "hoops 3v3", "3v3", "3 on 3", "basketball"],
    "ai-career": ["ai career", "ai and your career", "career talk", "career session"],
    "photo-walk": ["photo walk", "lens and light", "lens light"],
    "startup-pitch": ["startup pitch", "startup night", "pitch night"],
    "battle-of-bands": ["battle of the bands", "battle bands", "bands battle"],
    "campus-run": ["campus run", "campus run 5k", "5k", "five k", "fun run"]
  };

  const TEAM_NOTES = {
    codestorm: "Teams of 2–4. Solo builders are matched with a team before the sprint.",
    "hoops-3v3": "Teams of 3 players plus 1 substitute. Bring your own kit.",
    "startup-pitch": "Pitch as a team of up to 3, or come along to watch."
  };

  const DEFAULT_QUICK = ["Help me choose", "Browse all events", "How do I register?"];
  const PREFERENCE_QUICK = [
    "Tech & building",
    "Music & culture",
    "Sports & games",
    "Careers & startups",
    "Photography & arts",
    "Surprise me"
  ];

  const DAYS = [
    { key: "day1", label: "Wed 18 Nov" },
    { key: "day2", label: "Thu 19 Nov" },
    { key: "day3", label: "Fri 20 Nov" },
    { key: "day4", label: "Sat 21 Nov" }
  ];

  const RECOMMEND_INTENT =
    /\b(recommend|suggest|help me (choose|pick|decide)|which event|what event|best event|not sure|no idea|dont know|where do i start|what suits me|pick an event for me|find me an event)\b/;
  const LIST_INTENT =
    /\b(list|browse|all events|what events|whats on|line up|lineup|full programme|full program|options)\b/;
  const SCHEDULE_INTENT =
    /\b(schedule|timetable|time table|agenda|sessions|calendar|day 1|day one|day 2|day 3|day 4)\b/;
  const FREE_INTENT = /\b(cost|price|fee|pay|payment|ticket|free|expensive)\b/;
  const REGISTER_INTENT = /\b(register|registration|sign up|signup|enrol|enroll|book|reserve)\b/;
  const TEAM_INTENT = /\b(team|teammate|teammates|solo|partner|squad|group)\b/;
  const FOOD_INTENT = /\b(food|eat|meal|meals|breakfast|lunch|dinner|snack)\b/;
  const CONTACT_INTENT = /\b(contact|email|phone|help desk|reach|organiser|organizer|support)\b/;
  const ALT_INTENT = /\b(alternatives?|similar|something else|other options|more options)\b/;
  const CAPABILITY_INTENT = /\b(what can you do|how can you help|what do you know|who are you|what are you)\b/;

  let isOpen = false;
  let hasGreeted = false;
  let typingTimer = 0;
  let typingElement = null;
  let lastPick = null;

  /* ----------------------------------------------------------
     Chat rendering
     ---------------------------------------------------------- */
  function scrollLog() {
    window.requestAnimationFrame(() => {
      log.scrollTop = log.scrollHeight;
    });
  }

  function showTyping() {
    if (typingElement) return;
    typingElement = document.createElement("div");
    typingElement.className = "chat-msg chat-msg--bot chat-typing";
    typingElement.setAttribute("aria-hidden", "true");
    typingElement.innerHTML = "<span></span><span></span><span></span>";
    log.appendChild(typingElement);
    scrollLog();
  }

  function hideTyping() {
    if (!typingElement) return;
    typingElement.remove();
    typingElement = null;
  }

  function setQuickReplies(labels) {
    quick.innerHTML = "";
    if (!labels || !labels.length) {
      quick.hidden = true;
      return;
    }

    labels.forEach((label) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chat-chip";
      chip.textContent = label;
      chip.addEventListener("click", () => submitMessage(label));
      quick.appendChild(chip);
    });

    quick.hidden = false;
  }

  function addMessage(role, html, quickReplies) {
    const message = document.createElement("div");
    message.className = `chat-msg chat-msg--${role}`;

    if (role === "user") {
      const paragraph = document.createElement("p");
      paragraph.textContent = html;
      message.appendChild(paragraph);
    } else {
      message.innerHTML = html;
    }

    log.appendChild(message);

    if (typeof quickReplies !== "undefined") setQuickReplies(quickReplies);
    scrollLog();
  }

  function botSay(html, options) {
    const settings = Object.assign({ quick: DEFAULT_QUICK, delay: 420 }, options || {});
    window.clearTimeout(typingTimer);
    setQuickReplies([]);
    showTyping();

    typingTimer = window.setTimeout(() => {
      hideTyping();
      addMessage("bot", html, settings.quick);
      if (typeof settings.after === "function") settings.after();
    }, settings.delay);
  }

  function submitMessage(value) {
    const text = String(value || input.value || "").trim();
    if (!text) return;
    input.value = "";
    addMessage("user", text);
    respond(text);
    input.focus({ preventScroll: true });
  }

  /* ----------------------------------------------------------
     Intent matching
     ---------------------------------------------------------- */
  function findEvent(raw) {
    const text = normalize(raw);
    const byTitle = EVENTS.find((event) => text.includes(normalize(event.title)));
    if (byTitle) return byTitle;

    for (const id of Object.keys(ALIASES)) {
      if (ALIASES[id].some((alias) => matchTerm(text, alias))) {
        return findById(id);
      }
    }
    return null;
  }

  function detectAspect(text) {
    if (REGISTER_INTENT.test(text)) return "register";
    if (/\b(bring|wear|carry|kit|equipment)\b/.test(text)) return "bring";
    if (/\b(seat|seats|full|space|capacity|available|left)\b/.test(text)) return "seats";
    if (TEAM_INTENT.test(text)) return "team";
    if (FREE_INTENT.test(text)) return "cost";
    if (/\b(where|venue|location|place)\b/.test(text)) return "where";
    if (/\b(when|date|time|timing|day)\b/.test(text)) return "when";
    if (/\b(who|eligib|allowed|open to|qualify|year|beginner)\b/.test(text)) return "who";
    return "about";
  }

  function scoreEvents(raw) {
    const text = normalize(raw);
    const results = EVENTS.map((event) => {
      let score = 0;
      let firstMatch = -1;
      const matches = [];

      (KEYWORDS[event.id] || []).forEach((term) => {
        if (matchTerm(text, term)) {
          score += term.includes(" ") ? 4 : 2;
          matches.push(term);

          const index = text.indexOf(normalize(term));
          if (index !== -1 && (firstMatch === -1 || index < firstMatch)) firstMatch = index;
        }
      });

      if (text.includes(normalize(event.title))) score += 8;

      /* Mentioning an interest earlier in the sentence gives it a gentle
         edge, so "coding and music" leads with the coding event. */
      if (firstMatch !== -1) {
        score += Math.max(0, 1 - firstMatch / Math.max(text.length, 1)) * 1.5;
      }

      return { event, score, matches };
    })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.event.title.localeCompare(b.event.title));

    return results;
  }

  function joinList(items) {
    if (items.length <= 1) return items.join("");
    return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
  }

  /* ----------------------------------------------------------
     Answer builders
     ---------------------------------------------------------- */
  function seatLabel(event) {
    const left = seatsRemaining(event);
    if (left === 0) return "Fully booked";
    return `${left} seat${left === 1 ? "" : "s"} left`;
  }

  function eventCardHTML(event) {
    const left = seatsRemaining(event);
    const full = left === 0;
    const category = CATEGORIES[event.category] ? CATEGORIES[event.category].label : event.category;

    return `
      <div class="chat-event">
        <div class="chat-event-top">
          <span class="chat-event-cat">${esc(category)}</span>
          <span class="chat-event-seats${left <= 8 ? " is-low" : ""}">${full ? "Fully booked" : `${left} left`}</span>
        </div>
        <strong>${esc(event.title)}</strong>
        <p>${esc(event.tagline)}</p>
        <dl class="chat-facts">
          <div><dt>When</dt><dd>${esc(event.dayShort)} ${event.dayNum} ${esc(event.month)} · ${esc(event.time)}</dd></div>
          <div><dt>Where</dt><dd>${esc(event.venue)}</dd></div>
        </dl>
        <div class="chat-event-actions">
          <button type="button" data-chat-details="${event.id}">Details</button>
          <button type="button" class="is-primary" data-chat-register="${event.id}"${full ? " disabled" : ""}>${full ? "Full" : "Register"}</button>
        </div>
      </div>
    `;
  }

  function eventAnswer(event, aspect) {
    const left = seatsRemaining(event);
    const full = left === 0;
    const title = esc(event.title);
    let lead;

    switch (aspect) {
      case "when":
        lead = `<strong>${title}</strong> runs ${esc(event.dayFull)}, starting at ${esc(event.time)} (${esc(event.durationLabel)}).`;
        break;
      case "where":
        lead = `<strong>${title}</strong> is at ${esc(event.venue)} — ${esc(event.dayShort)} ${event.dayNum} ${esc(event.month)} at ${esc(event.time)}.`;
        break;
      case "seats":
        lead = full
          ? `<strong>${title}</strong> is fully booked right now (${event.capacity} of ${event.capacity} seats taken). I can suggest a similar event if you like.`
          : `<strong>${title}</strong> has ${left} of ${event.capacity} seats left. ${left <= 8 ? "It is filling up, so reserve soon." : "There is still room to register."}`;
        break;
      case "bring":
        lead = `<strong>What to bring:</strong> ${esc(event.bring)}`;
        break;
      case "who":
        lead = `<strong>Who can join:</strong> ${esc(event.eligibility)}`;
        break;
      case "team":
        lead = `<strong>Team format:</strong> ${esc(TEAM_NOTES[event.id] || event.eligibility)}`;
        break;
      case "cost":
        lead = `It is <strong>free for enrolled students</strong> — no ticket, payment or account needed.`;
        break;
      case "register":
        lead = `Registration for <strong>${title}</strong> is free and takes about a minute. Tap “Register” below and I will pre-fill the event in the form.`;
        break;
      default:
        lead = `<p>${esc(event.description)}</p><p><strong>Who can join:</strong> ${esc(event.eligibility)}</p>`;
    }

    return `${lead}${eventCardHTML(event)}`;
  }

  function listEventsHTML() {
    return `
      <ul class="chat-list">
        ${EVENTS.map((event) => {
          const left = seatsRemaining(event);
          return `
            <li>
              <button type="button" data-chat-details="${event.id}">
                <span>
                  <strong>${esc(event.title)}</strong>
                  <small>${esc(event.dayShort)} ${event.dayNum} ${esc(event.month)} · ${esc(event.time)} · ${esc(event.venueShort)}</small>
                </span>
                <span class="chat-list-seats">${left === 0 ? "Full" : `${left} left`}</span>
              </button>
            </li>
          `;
        }).join("")}
      </ul>
    `;
  }

  function askPreferences() {
    botSay(
      `<p>Happy to help you choose. What are you into? Pick one below, or just describe it in your own words — for example, “I like coding and music”.</p>`,
      { quick: PREFERENCE_QUICK }
    );
  }

  function recommend(results) {
    const available = results.filter((item) => seatsRemaining(item.event) > 0);

    if (!available.length) {
      botSay(
        `<p>Everything matching that is fully booked right now. Here is the full line-up instead — tap an event for details.</p>${listEventsHTML()}`,
        { quick: DEFAULT_QUICK }
      );
      return;
    }

    const top = available[0];
    const alternatives = available.slice(1, 3);
    lastPick = top.event.id;

    const reasons = [...new Set(top.matches)].slice(0, 2).map((term) => `<em>${esc(term)}</em>`);
    const lead = reasons.length
      ? `You mentioned ${joinList(reasons)}, so this looks like your best match.`
      : "This looks like a good fit for you.";

    const alternativesHTML = alternatives.length
      ? `<p class="chat-alt-label">Also worth a look:</p><div class="chat-alt-list">${alternatives
          .map(
            (item) =>
              `<button type="button" data-chat-details="${item.event.id}">${esc(item.event.title)}</button>`
          )
          .join("")}</div>`
      : "";

    botSay(`${lead}${eventCardHTML(top.event)}${alternativesHTML}`, {
      quick: ["Register for this", "Browse all events"]
    });
  }

  function surprisePick() {
    const options = EVENTS.filter((event) => seatsRemaining(event) > 0);
    if (!options.length) {
      botSay("<p>Every event is currently full — that is a good problem to have. Check back soon or contact the organisers.</p>", {
        quick: DEFAULT_QUICK
      });
      return;
    }

    const event = options[Math.floor(Math.random() * options.length)];
    lastPick = event.id;
    botSay(`<p>Wildcard pick — give this one a go:</p>${eventCardHTML(event)}`, {
      quick: ["Register for this", "Help me choose"]
    });
  }

  function alternatives() {
    const picked = lastPick ? findById(lastPick) : null;
    const open = EVENTS.filter((event) => seatsRemaining(event) > 0 && (!picked || event.id !== picked.id));
    const sameCategory = picked ? open.filter((event) => event.category === picked.category) : [];
    const pool = sameCategory.length ? sameCategory : open;

    if (!pool.length) {
      botSay("<p>There is nothing else open right now. Try the full line-up again in a moment.</p>", {
        quick: DEFAULT_QUICK
      });
      return;
    }

    const event = pool[0];
    lastPick = event.id;
    botSay(`<p>Here is another option:</p>${eventCardHTML(event)}`, {
      quick: ["Register for this", "Browse all events"]
    });
  }

  function startRegistration(event) {
    if (seatsRemaining(event) <= 0) {
      lastPick = event.id;
      botSay(
        `<p><strong>${esc(event.title)}</strong> is fully booked right now. Want me to suggest something similar?</p>`,
        { quick: ["Show alternatives", "Browse all events"] }
      );
      return;
    }

    lastPick = event.id;
    botSay(
      `<p>Great choice. I have selected <strong>${esc(event.title)}</strong> for you — I will open the registration form so you can add your details.</p>`,
      {
        quick: [],
        after: () => {
          window.setTimeout(() => {
            closeChat();
            if (typeof chooseEvent === "function") {
              chooseEvent(event.id);
            } else {
              goToSection("#register");
            }
          }, 550);
        }
      }
    );
  }

  function howToRegister() {
    botSay(
      `<p>Registration is free and takes about a minute:</p>
       <ol class="chat-steps">
         <li>Pick an event — or ask me for a recommendation.</li>
         <li>Fill in your name, student ID, email, phone and year.</li>
         <li>Agree to the code of conduct and confirm. Your pass appears instantly.</li>
       </ol>
       <p>No account, payment or app is needed. Register separately for each event you want to attend.</p>
       <button type="button" class="chat-wide-btn" data-chat-scroll="#register">Open the registration form</button>`,
      { quick: ["Help me choose", "Browse all events"] }
    );
  }

  function scheduleAnswer() {
    const blocks = DAYS.map((day) => {
      const sessions = (typeof SCHEDULE !== "undefined" && SCHEDULE[day.key]) || [];
      return `
        <div>
          <h4>${esc(day.label)}</h4>
          <ul>
            ${sessions
              .map(
                (session) =>
                  `<li><span>${esc(session.time)} ${esc(session.period)}</span>${esc(session.title)}</li>`
              )
              .join("")}
          </ul>
        </div>
      `;
    }).join("");

    botSay(
      `<p>CampusFest runs <strong>18–21 November 2026</strong>. Here is the full 16-session schedule:</p><div class="chat-schedule">${blocks}</div>`,
      { quick: DEFAULT_QUICK }
    );
  }

  function freeAnswer() {
    botSay(
      `<p>Every CampusFest event is <strong>free for currently enrolled students</strong>. There is no payment, ticket or account — just register with your student details and show your pass plus student ID at the door.</p>`,
      { quick: ["Help me choose", "How do I register?"] }
    );
  }

  function teamAnswer() {
    botSay(
      `<p>Team sizes depend on the event:</p>
       <ul class="chat-bullets">
         <li><strong>CodeStorm</strong> — teams of 2–4; solo builders are matched with a team.</li>
         <li><strong>Hoops 3v3</strong> — 3 players plus 1 substitute.</li>
         <li><strong>Startup Pitch</strong> — pitch as a team of up to 3.</li>
         <li>Everything else is individual or spectator-friendly.</li>
       </ul>
       <p>For team matching, add a note when you register or email the student council.</p>`,
      { quick: ["Show me CodeStorm", "Show me Hoops 3v3", "Browse all events"] }
    );
  }

  function foodAnswer() {
    botSay(
      `<p>CodeStorm includes meals and Wi-Fi through the 24-hour sprint, and the Campus Run finishes with breakfast. Other events do not list food in the programme — the festival hub at the Student Centre is the place to ask during fest week.</p>`,
      { quick: DEFAULT_QUICK }
    );
  }

  function contactAnswer() {
    botSay(
      `<p>You can reach the Student Activities Council at <a href="mailto:hello@dsu.edu.in"><strong>hello@dsu.edu.in</strong></a> or <a href="tel:+919876543210"><strong>+91 98765 43210</strong></a>. The help desk runs 9 AM – 6 PM, Monday to Saturday, and the festival hub is at the Student Centre.</p>`,
      { quick: DEFAULT_QUICK }
    );
  }

  function festWhen() {
    botSay(
      `<p>CampusFest '26 runs <strong>Wednesday 18 to Saturday 21 November 2026</strong>. Events start as early as 6:30 AM for the Campus Run and finish with the closing ceremony on Saturday night.</p>`,
      { quick: ["Browse all events", "Help me choose"] }
    );
  }

  function festWhere() {
    botSay(
      `<p>Everything happens on the <strong>Dayananda Sagar University campus</strong>. Venues range from the Innovation Lab and Main Auditorium to the Indoor Courts, Campus Lake and Open Air Stage — each event card lists its exact venue.</p>`,
      { quick: ["Browse all events", "Help me choose"] }
    );
  }

  function capabilities() {
    botSay(
      `<p>I am the festival's event guide. I can:</p>
       <ul class="chat-bullets">
         <li>recommend events based on what you enjoy,</li>
         <li>share dates, venues, seat counts and what to bring,</li>
         <li>explain registration, teams and the schedule.</li>
       </ul>
       <p>Try “I like coding and music”, or tap a suggestion below.</p>`,
      { quick: PREFERENCE_QUICK }
    );
  }

  function fallback() {
    botSay(
      `<p>I do not have that one in the programme yet. I can help with event details, dates, venues, seats, what to bring, registration — or pick an event that suits you.</p>`,
      { quick: PREFERENCE_QUICK }
    );
  }

  /* ----------------------------------------------------------
     Conversation router
     ---------------------------------------------------------- */
  function respond(raw) {
    const text = normalize(raw);

    if (!text) return;

    if (/^(hi|hey|hello|yo|hola|namaste|good morning|good afternoon|good evening)\b/.test(text)) {
      botSay(
        `<p>Hey! I am the CampusFest guide. Tell me what you are into and I will find the right event — or ask me anything about the line-up.</p>`,
        { quick: PREFERENCE_QUICK }
      );
      return;
    }

    if (/^(thanks|thank you|thx|cheers|perfect|great|awesome|cool)\b/.test(text)) {
      botSay(`<p>Anytime. Want another suggestion, or help with registration?</p>`, {
        quick: ["Help me choose", "How do I register?", "Browse all events"]
      });
      return;
    }

    if (/^(bye|goodbye|see you|thats all|that is all)\b/.test(text)) {
      botSay(`<p>See you at CampusFest — 18 to 21 November. Have a great fest!</p>`, { quick: [] });
      return;
    }

    if (/\b(surprise me|wildcard|random)\b/.test(text)) {
      surprisePick();
      return;
    }

    const event = findEvent(text);
    if (event) {
      const aspect = detectAspect(text);
      const asksHow = /\b(how|where|help|explain)\b/.test(text);
      if (aspect === "register" && !asksHow) {
        startRegistration(event);
        return;
      }
      botSay(eventAnswer(event, aspect), { quick: DEFAULT_QUICK });
      return;
    }

    if (ALT_INTENT.test(text)) {
      alternatives();
      return;
    }

    if (RECOMMEND_INTENT.test(text)) {
      const scored = scoreEvents(text);
      if (scored.length) recommend(scored);
      else askPreferences();
      return;
    }

    if (SCHEDULE_INTENT.test(text)) {
      scheduleAnswer();
      return;
    }

    if (LIST_INTENT.test(text)) {
      botSay(`<p>Here is the full line-up. Tap any event for the details, or ask me to narrow it down.</p>${listEventsHTML()}`, {
        quick: ["Help me choose", "How do I register?"]
      });
      return;
    }

    if (FREE_INTENT.test(text)) {
      freeAnswer();
      return;
    }

    if (REGISTER_INTENT.test(text)) {
      if (lastPick && /\b(it|that|this|one)\b/.test(text)) {
        const picked = findById(lastPick);
        if (picked) {
          startRegistration(picked);
          return;
        }
      }
      howToRegister();
      return;
    }

    if (TEAM_INTENT.test(text)) {
      teamAnswer();
      return;
    }

    if (FOOD_INTENT.test(text)) {
      foodAnswer();
      return;
    }

    if (CONTACT_INTENT.test(text)) {
      contactAnswer();
      return;
    }

    if (/\b(fest|festival|campusfest)\b/.test(text) && /\b(when|date|dates|what day|how long|start|end)\b/.test(text)) {
      festWhen();
      return;
    }

    if (/\b(fest|festival|campusfest)\b/.test(text) && /\b(where|venue|location|campus)\b/.test(text)) {
      festWhere();
      return;
    }

    if (CAPABILITY_INTENT.test(text)) {
      capabilities();
      return;
    }

    if (lastPick) {
      const picked = findById(lastPick);
      const refers = /\b(it|that|this|this one|that one|the event)\b/.test(text);
      const aspect = detectAspect(text);
      if (picked && (refers || ["when", "where", "seats", "bring", "who", "team", "cost"].includes(aspect))) {
        botSay(eventAnswer(picked, aspect), { quick: DEFAULT_QUICK });
        return;
      }
    }

    const scored = scoreEvents(text);
    if (scored.length) {
      recommend(scored);
      return;
    }

    fallback();
  }

  /* ----------------------------------------------------------
     Open / close & events
     ---------------------------------------------------------- */
  function openChat() {
    if (isOpen) {
      input.focus({ preventScroll: true });
      return;
    }

    isOpen = true;
    panel.hidden = false;
    launcher.setAttribute("aria-expanded", "true");

    /* Force a style flush so the opening transition runs reliably,
       even when the tab is backgrounded or animations are throttled. */
    void panel.offsetWidth;
    panel.classList.add("is-open");

    if (!hasGreeted) {
      hasGreeted = true;
      botSay(
        `<p><strong>Hey — I am the CampusFest guide.</strong> Tell me what you are into and I will find the right event, or ask me anything about the line-up.</p>`,
        { quick: PREFERENCE_QUICK, delay: 550 }
      );
    }

    window.setTimeout(() => input.focus({ preventScroll: true }), 260);
  }

  function closeChat() {
    if (!isOpen) return;
    isOpen = false;
    panel.classList.remove("is-open");
    launcher.setAttribute("aria-expanded", "false");

    const finish = () => {
      if (!isOpen) panel.hidden = true;
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) finish();
    else window.setTimeout(finish, 240);

    launcher.focus({ preventScroll: true });
  }

  function goToSection(selector) {
    const target = document.querySelector(selector);
    if (!target) return;
    closeChat();
    window.setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "start" }), 220);
  }

  launcher.addEventListener("click", () => (isOpen ? closeChat() : openChat()));
  openers.forEach((opener) => opener.addEventListener("click", openChat));

  if (closeButton) closeButton.addEventListener("click", closeChat);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitMessage(input.value);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen) closeChat();
  });

  log.addEventListener("click", (event) => {
    const detailsButton = event.target.closest("[data-chat-details]");
    if (detailsButton) {
      const eventId = detailsButton.getAttribute("data-chat-details");
      const selected = findById(eventId);
      if (selected && typeof openEventDialog === "function") {
        openEventDialog(selected);
      }
      return;
    }

    const registerButton = event.target.closest("[data-chat-register]");
    if (registerButton) {
      const eventId = registerButton.getAttribute("data-chat-register");
      const selected = findById(eventId);
      if (selected) startRegistration(selected);
      return;
    }

    const scrollButton = event.target.closest("[data-chat-scroll]");
    if (scrollButton) {
      goToSection(scrollButton.getAttribute("data-chat-scroll"));
    }
  });

  /* Greeting is created on first open so the panel is never empty. */
  setQuickReplies([]);
})();

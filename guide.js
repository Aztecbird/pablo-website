const catalogue = [
  {
    title: "Whispering Notes",
    type: "music",
    duration: ["medium", "long"],
    intents: ["sleep", "anxiety", "calm", "overactive"],
    description: "A soft sleep selection for slowing the pace of the evening and making room for rest.",
    href: "/sleep.html",
    action: "Listen on the sleep page"
  },
  {
    title: "Relaxing Within",
    type: "music",
    duration: ["medium", "long"],
    intents: ["sleep", "relax", "stress", "calm"],
    description: "Gentle music for turning attention inward when the day still feels present.",
    href: "/sleep.html",
    action: "Listen on the sleep page"
  },
  {
    title: "Sounds of Nature: Soft River",
    type: "music",
    duration: ["medium", "long"],
    intents: ["sleep", "nature", "ground", "stress", "anxiety"],
    description: "A natural sound environment for grounding, decompressing, or settling into sleep.",
    href: "/sleep.html",
    action: "Listen on the sleep page"
  },
  {
    title: "Piano Peace in the Heart",
    type: "meditation",
    duration: ["short", "medium"],
    intents: ["meditate", "peace", "heart", "calm", "anxiety"],
    description: "A peaceful piano companion for returning attention to the heart and the present moment.",
    href: "/meditation.html",
    action: "Open the meditation page"
  },
  {
    title: "Soft Piano for Inner Peace",
    type: "meditation",
    duration: ["short", "medium"],
    intents: ["meditate", "peace", "quiet", "stress", "focus"],
    description: "Soft piano for a quiet meditation, a gentle pause, or unhurried concentration.",
    href: "/meditation.html",
    action: "Open the meditation page"
  },
  {
    title: "Bliss Moment (Slow Piano)",
    type: "meditation",
    duration: ["short", "medium"],
    intents: ["bliss", "peace", "slow", "calm", "meditate"],
    description: "A slow piano selection for a brief restorative pause and a softer inner atmosphere.",
    href: "/meditation.html",
    action: "Open the meditation page"
  },
  {
    title: "Learn to Still Your Overactive Mind with Powerful I AM Mantras",
    type: "course",
    duration: ["medium", "long"],
    intents: ["overactive", "mind", "mantra", "learn", "anxiety", "focus"],
    description: "A structured course for working with an active mind through a focused I AM mantra practice.",
    href: "/courses.html",
    action: "Explore this course"
  },
  {
    title: "Music & Mantras as Tools for Inner Peace",
    type: "course",
    duration: ["long"],
    intents: ["mantra", "learn", "peace", "journey", "practice", "spiritual"],
    description: "A ten-day journey for someone ready to develop a deeper practice with music and mantras.",
    href: "/courses.html",
    action: "Explore this course"
  },
  {
    title: "One Mantra a Day with Relaxing Music",
    type: "course",
    duration: ["medium", "long"],
    intents: ["mantra", "daily", "learn", "harmony", "practice"],
    description: "A gentle daily path combining one mantra at a time with relaxing music.",
    href: "/courses.html",
    action: "Explore this course"
  }
];

const intentGroups = {
  sleep: ["sleep", "asleep", "bed", "night", "tired", "insomnia", "rest"],
  anxiety: ["anxious", "anxiety", "worried", "worry", "stress", "tense", "overwhelmed"],
  overactive: ["busy mind", "thoughts", "overthinking", "overactive", "cannot stop", "can't stop"],
  focus: ["focus", "work", "study", "concentrate", "creative"],
  meditate: ["meditate", "meditation", "mindful", "stillness", "present"],
  mantra: ["mantra", "affirmation", "i am", "daily practice"],
  ground: ["ground", "grounded", "nature", "river", "unsettled"],
  peace: ["peace", "calm", "quiet", "relax", "soft", "gentle"],
  heart: ["heart", "grief", "sad", "emotion", "love"],
  spiritual: ["spiritual", "inner", "self", "meaning", "connection"]
};

function detectIntents(text) {
  const normalized = text.toLowerCase();
  return Object.entries(intentGroups)
    .filter(([, phrases]) => phrases.some((phrase) => normalized.includes(phrase)))
    .map(([intent]) => intent);
}

function scoreItem(item, intents, duration, format) {
  let score = item.intents.filter((intent) => intents.includes(intent)).length * 4;
  if (item.duration.includes(duration)) score += 2;
  if (format === "any" || item.type === format) score += 3;
  if (intents.length === 0 && item.intents.includes("peace")) score += 1;
  return score;
}

function renderResults(matches, detectedIntents) {
  const result = document.querySelector("#guide-results");
  const context = detectedIntents.length
    ? `I heard a wish for ${detectedIntents.slice(0, 2).join(" and ")}.`
    : "I chose a gentle place to begin.";

  result.innerHTML = `
    <div class="recommendation-intro">
      <div class="subtitle">A SUGGESTION FOR THIS MOMENT</div>
      <p>${context}</p>
    </div>
    ${matches.map((item, index) => `
      <article class="recommendation ${index === 0 ? "featured" : ""}">
        <span class="recommendation-label">${index === 0 ? "Begin here" : "Another possibility"}</span>
        <h2>${item.title}</h2>
        <p>${item.description}</p>
        <a class="btn ${index === 0 ? "primary" : ""}" href="${item.href}">${item.action}</a>
      </article>
    `).join("")}
    <button class="guide-reset" type="button">Start again</button>
  `;

  result.querySelector(".guide-reset").addEventListener("click", () => {
    document.querySelector("#peace-guide").reset();
    document.querySelector("#feeling").focus();
    result.innerHTML = `
      <div class="guide-placeholder">
        <span class="guide-symbol" aria-hidden="true">◌</span>
        <h2>Your recommendation will appear here.</h2>
        <p>Every result comes from Pablo’s existing collection—nothing is invented.</p>
      </div>`;
  });
}

document.querySelectorAll(".prompt-chip").forEach((button) => {
  button.addEventListener("click", () => {
    const feeling = document.querySelector("#feeling");
    feeling.value = button.dataset.prompt;
    feeling.focus();
  });
});

document.querySelector("#peace-guide").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const text = String(data.get("feeling") || "").trim();
  const duration = String(data.get("duration"));
  const format = String(data.get("format"));
  const intents = detectIntents(text);

  const matches = catalogue
    .map((item) => ({ item, score: scoreItem(item, intents, duration, format) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(({ item }) => item);

  renderResults(matches, intents);
  document.querySelector("#guide-results").scrollIntoView({ behavior: "smooth", block: "center" });
});

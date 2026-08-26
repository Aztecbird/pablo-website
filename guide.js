let cataloguePromise;
let catalogueCount = 0;

const intentGroups = {
  sleep: ["sleep", "asleep", "bed", "night", "tired", "insomnia", "rest", "dormir", "sueño", "insomnio", "noche", "descansar"],
  anxiety: ["anxious", "anxiety", "worried", "worry", "stress", "tense", "overwhelmed", "ansiedad", "ansioso", "ansiosa", "estrés", "preocupado", "preocupada"],
  overactive: ["busy mind", "thoughts", "overthinking", "overactive", "cannot stop", "can't stop", "mente ocupada", "pensamientos", "no puedo parar", "sobrepensar"],
  focus: ["focus", "work", "study", "concentrate", "creative", "clarity", "concentración", "trabajo", "estudiar", "creatividad", "claridad"],
  meditate: ["meditate", "meditation", "mindful", "stillness", "present", "meditar", "meditación", "atención plena", "quietud", "presente"],
  mantra: ["mantra", "affirmation", "i am", "daily practice", "afirmación", "yo soy", "práctica diaria"],
  ground: ["ground", "grounded", "nature", "river", "ocean", "rain", "forest", "unsettled", "naturaleza", "río", "océano", "lluvia", "bosque", "tierra"],
  peace: ["peace", "calm", "quiet", "relax", "soft", "gentle", "serenity", "paz", "calma", "tranquilo", "tranquila", "relajar", "suave", "serenidad"],
  heart: ["heart", "grief", "loss", "sad", "emotion", "love", "corazón", "duelo", "pérdida", "triste", "emoción", "amor"],
  spiritual: ["spiritual", "divine", "soul", "awakening", "consciousness", "inner", "espiritual", "divino", "alma", "despertar", "conciencia", "interior"],
  joy: ["joy", "happy", "happiness", "uplifting", "alegría", "feliz", "felicidad"],
  healing: ["heal", "healing", "wellness", "restore", "sanar", "sanación", "bienestar", "restaurar"],
  breath: ["breath", "breathe", "breathing", "breathwork", "respirar", "respiración"],
  gratitude: ["gratitude", "grateful", "thankful", "gratitud", "agradecido", "agradecida"],
  abundance: ["abundance", "wealth", "prosperity", "manifest", "abundancia", "prosperidad", "manifestar"],
  confidence: ["confidence", "self-belief", "worthiness", "confianza", "autoestima", "merecimiento"],
  morning: ["morning", "new day", "wake up", "mañana", "nuevo día", "despertar"]
};

const stopWords = new Set([
  "and", "are", "for", "from", "have", "help", "into", "need", "right", "that", "the", "this", "want", "with", "would",
  "como", "con", "del", "desde", "estoy", "para", "pero", "por", "que", "quiero", "una", "unos", "unas"
]);

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeInsightTimerHref(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "insighttimer.com"
      ? url.href
      : "https://insighttimer.com/pabloarellano";
  } catch {
    return "https://insighttimer.com/pabloarellano";
  }
}

function tokenize(text) {
  return [...new Set(
    normalizeText(text)
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length >= 3 && !stopWords.has(token))
  )];
}

function detectIntents(text) {
  const normalized = normalizeText(text);
  return Object.entries(intentGroups)
    .filter(([, phrases]) => phrases.some((phrase) => normalized.includes(normalizeText(phrase))))
    .map(([intent]) => intent);
}

function detectLanguage(text) {
  const normalized = normalizeText(text);
  const spanishSignals = ["quiero", "necesito", "dormir", "ansiedad", "calma", "meditacion", "corazon", "duelo", "paz", "musica", "espanol"];
  return spanishSignals.some((signal) => normalized.includes(signal)) ? "es" : null;
}

function loadCatalogue() {
  if (!cataloguePromise) {
    cataloguePromise = fetch("/catalogue.json").then(async (response) => {
      if (!response.ok) throw new Error("The recommendation catalogue could not be loaded.");
      const data = await response.json();
      const items = Array.isArray(data) ? data : data.items;
      if (!Array.isArray(items)) throw new Error("The recommendation catalogue is invalid.");
      catalogueCount = items.length;
      const count = document.querySelector("#catalogue-count");
      if (count) count.textContent = `Searching ${catalogueCount.toLocaleString()} public Insight Timer selections.`;
      return items;
    });
  }
  return cataloguePromise;
}

function scoreItem(item, intents, queryTokens, duration, format, language) {
  const title = normalizeText(item.title);
  const searchable = normalizeText(item.searchTerms || `${item.title} ${item.description}`);
  const intentMatches = item.intents.filter((intent) => intents.includes(intent)).length;
  const titleMatches = queryTokens.filter((token) => title.includes(token)).length;
  const searchMatches = queryTokens.filter((token) => searchable.includes(token)).length;

  let score = intentMatches * 8 + titleMatches * 4 + searchMatches * 1.5;
  if (item.duration.includes(duration)) score += 4;
  if (format === "any" || item.type === format) score += 5;
  if (language && item.language === language) score += 5;
  if (!intents.length && item.intents.includes("peace")) score += 2;
  score += Math.min(2, Math.log10(Number(item.plays || 0) + 1) / 4);
  score += Math.min(1, Number(item.rating || 0) / 5);
  return score;
}

function chooseCandidates(catalogue, duration, format, language) {
  let filtered = catalogue;
  if (format !== "any") filtered = filtered.filter((item) => item.type === format);
  if (language !== "any") {
    const languageCode = language === "music" ? "m1" : language;
    filtered = filtered.filter((item) => item.language === languageCode);
  }
  if (format !== "course") {
    const durationMatches = filtered.filter((item) => item.duration.includes(duration));
    if (durationMatches.length >= 3) filtered = durationMatches;
  }
  return filtered.length ? filtered : catalogue;
}

function renderResults(matches, detectedIntents, usedAi = false) {
  const result = document.querySelector("#guide-results");
  const context = detectedIntents.length
    ? `I heard a wish for ${detectedIntents.slice(0, 2).join(" and ")}.`
    : "I chose a gentle place to begin.";
  const labels = ["Begin here", "Another possibility", "One more option"];

  result.innerHTML = `
    <div class="recommendation-intro">
      <div class="subtitle">SUGGESTIONS FROM PABLO’S CATALOGUE</div>
      <p>${escapeHtml(context)}${usedAi ? " The AI interpreter helped understand your words." : ""}</p>
      <p class="catalogue-status">Searched ${catalogueCount.toLocaleString()} public Insight Timer selections.</p>
    </div>
    ${matches.map((item, index) => `
      <article class="recommendation ${index === 0 ? "featured" : ""}">
        <span class="recommendation-label">${labels[index]}</span>
        <h2>${escapeHtml(item.title)}</h2>
        <p class="recommendation-meta">${escapeHtml(item.format || item.type)} · ${escapeHtml(item.durationLabel || "")}${item.languageLabel ? ` · ${escapeHtml(item.languageLabel)}` : ""}</p>
        <p>${escapeHtml(item.description)}</p>
        <a class="btn ${index === 0 ? "primary" : ""}" href="${safeInsightTimerHref(item.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.action || "Open on Insight Timer")} ↗</a>
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
        <p>Every result comes from Pablo’s public Insight Timer collection—nothing is invented.</p>
        <p class="catalogue-status">Searching ${catalogueCount.toLocaleString()} public Insight Timer selections.</p>
      </div>`;
  });
}

function renderError() {
  const result = document.querySelector("#guide-results");
  result.innerHTML = `
    <div class="guide-placeholder">
      <span class="guide-symbol" aria-hidden="true">◌</span>
      <h2>The catalogue could not be loaded.</h2>
      <p>Please refresh the page or browse <a href="https://insighttimer.com/pabloarellano" target="_blank" rel="noopener noreferrer">Pablo’s Insight Timer profile</a>.</p>
    </div>`;
}

document.querySelectorAll(".prompt-chip").forEach((button) => {
  button.addEventListener("click", () => {
    const feeling = document.querySelector("#feeling");
    feeling.value = button.dataset.prompt;
    feeling.focus();
  });
});

document.querySelector("#peace-guide").addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const text = String(data.get("feeling") || "").trim();
  const duration = String(data.get("duration"));
  const format = String(data.get("format"));
  const language = String(data.get("language"));
  const localIntents = detectIntents(text);
  const queryTokens = tokenize(text);
  const languageHint = language === "any" ? detectLanguage(text) : (language === "music" ? "m1" : language);
  const aiEndpoint = document.querySelector('meta[name="peace-guide-api"]')?.content.trim();

  if (aiEndpoint) {
    try {
      const response = await fetch(`${aiEndpoint.replace(/\/$/, "")}/recommend`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text, duration, format, language })
      });

      if (!response.ok) throw new Error("AI recommendation unavailable");
      const aiResult = await response.json();
      catalogueCount = aiResult.catalogueCount || catalogueCount;
      renderResults(aiResult.matches, aiResult.intents, aiResult.mode === "ai");
      document.querySelector("#guide-results").scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    } catch (error) {
      console.warn("Using the private on-device guide instead.", error);
    }
  }

  try {
    const catalogue = await loadCatalogue();
    const candidates = chooseCandidates(catalogue, duration, format, language);
    const matches = candidates
      .map((item) => ({ item, score: scoreItem(item, localIntents, queryTokens, duration, format, languageHint) }))
      .sort((a, b) => b.score - a.score || String(b.item.approvedAt || "").localeCompare(String(a.item.approvedAt || "")))
      .slice(0, 3)
      .map(({ item }) => item);

    renderResults(matches, localIntents);
    document.querySelector("#guide-results").scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (error) {
    console.error(error);
    renderError();
  }
});

loadCatalogue().catch(renderError);

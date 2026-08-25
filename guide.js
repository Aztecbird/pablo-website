let cataloguePromise;

function loadCatalogue() {
  if (!cataloguePromise) {
    cataloguePromise = fetch("/catalogue.json").then((response) => {
      if (!response.ok) throw new Error("The recommendation catalogue could not be loaded.");
      return response.json();
    });
  }
  return cataloguePromise;
}

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

function renderResults(matches, detectedIntents, usedAi = false) {
  const result = document.querySelector("#guide-results");
  const context = detectedIntents.length
    ? `I heard a wish for ${detectedIntents.slice(0, 2).join(" and ")}.`
    : "I chose a gentle place to begin.";

  result.innerHTML = `
    <div class="recommendation-intro">
      <div class="subtitle">A SUGGESTION FOR THIS MOMENT</div>
      <p>${context}${usedAi ? " The AI interpreter helped understand your words." : ""}</p>
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

document.querySelector("#peace-guide").addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const text = String(data.get("feeling") || "").trim();
  const duration = String(data.get("duration"));
  const format = String(data.get("format"));
  const localIntents = detectIntents(text);
  const aiEndpoint = document.querySelector('meta[name="peace-guide-api"]')?.content.trim();

  if (aiEndpoint) {
    try {
      const response = await fetch(`${aiEndpoint.replace(/\/$/, "")}/recommend`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text, duration, format })
      });

      if (!response.ok) throw new Error("AI recommendation unavailable");
      const result = await response.json();
      renderResults(result.matches, result.intents, result.mode === "ai");
      document.querySelector("#guide-results").scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    } catch (error) {
      console.warn("Using the private on-device guide instead.", error);
    }
  }

  const catalogue = await loadCatalogue();

  const matches = catalogue
    .map((item) => ({ item, score: scoreItem(item, localIntents, duration, format) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(({ item }) => item);

  renderResults(matches, localIntents);
  document.querySelector("#guide-results").scrollIntoView({ behavior: "smooth", block: "center" });
});

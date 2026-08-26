#!/usr/bin/env node

import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PROFILE = "pabloarellano";
const PROFILE_URL = `https://insighttimer.com/${PROFILE}/guided-meditations`;
const SITEMAP_INDEX = "https://insighttimer.com/sitemap.xml";
const ITEM_API = "https://filtering.insighttimer-api.net/api/v1/libraryitems";
const REPO_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const OUTPUT_PATH = join(REPO_ROOT, "catalogue.json");
const PUBLISHER_ID = "y3F3c8C2U2v3e9E4S9E4S1H5k2J5T6V9X0K5M8q1L1R4M9x0P6g7G6v1X5S8D8U8U4K8f4Z6T7g3d6d5d6U4z1U6m3d9c2Q7P8m7";
const ACTIVE_COURSE_URLS = [
  "https://insighttimer.com/meditation-courses/course_learn-to-still-your-overactive-mind-using-mantras",
  "https://insighttimer.com/meditation-courses/course_un-mantra-al-dia-con-musica-relajante",
  "https://insighttimer.com/meditation-courses/course_one-mantra-a-day-with-relaxing-music",
  "https://insighttimer.com/meditation-courses/course_contacting-your-creative-force-with-mantras",
  "https://insighttimer.com/meditation-courses/course_music-and-mantras-as-tools-for-inner-peace",
  "https://insighttimer.com/meditation-courses/course_el-camino-facil-a-tu-iluminacion",
  "https://insighttimer.com/meditation-courses/course_pablo-arellano"
];

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/, "").split("=");
    return [key, rest.join("=") || true];
  })
);

const sitemapDir = typeof args.get("sitemap-dir") === "string" ? args.get("sitemap-dir") : null;

const intentRules = {
  sleep: ["sleep", "insomnia", "bedtime", "dream", "night", "lullaby", "rest"],
  anxiety: ["anxiety", "anxious", "stress", "worry", "overwhelmed", "tension", "nervous"],
  overactive: ["overthinking", "overactive", "busy mind", "thoughts", "mental chatter", "subconscious"],
  focus: ["focus", "concentrat", "study", "work", "creative", "clarity"],
  meditate: ["meditat", "mindful", "stillness", "present moment", "contemplat", "insight"],
  mantra: ["mantra", "affirmation", "i am", "chant", "om "],
  ground: ["ground", "nature", "river", "ocean", "rain", "forest", "earth", "birds", "crickets"],
  peace: ["peace", "calm", "relax", "seren", "tranquil", "gentle", "quiet", "soothing", "soft"],
  heart: ["heart", "grief", "loss", "sad", "love", "compassion", "emotion"],
  spiritual: ["spirit", "divine", "soul", "awaken", "consciousness", "angel", "sacred", "inner light"],
  joy: ["joy", "happiness", "uplift", "bliss"],
  healing: ["heal", "wellness", "restore", "recovery", "health"],
  breath: ["breath", "breathing", "breathwork"],
  gratitude: ["gratitude", "grateful", "thankful"],
  abundance: ["abundance", "wealth", "prosper", "manifest"],
  confidence: ["confidence", "self-belief", "worthiness", "self worth"],
  morning: ["morning", "new day", "wake up", "sunrise"]
};

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function normalizeText(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateDescription(value, limit = 300) {
  const text = normalizeText(value);
  if (text.length <= limit) return text;
  const excerpt = text.slice(0, limit - 1);
  const sentenceEnd = excerpt.lastIndexOf(".");
  if (sentenceEnd >= Math.floor(limit * 0.55)) return excerpt.slice(0, sentenceEnd + 1);
  const wordEnd = excerpt.lastIndexOf(" ");
  return `${excerpt.slice(0, wordEnd > 0 ? wordEnd : limit - 1)}…`;
}

function durationGroups(item) {
  if (item.item_type === "COURSES") return ["long"];
  const minutes = Math.max(1, Math.round(Number(item.media_length || 0) / 60));
  if (minutes <= 15) return ["short"];
  if (minutes <= 60) return ["medium"];
  return ["long"];
}

function itemType(item) {
  if (item.item_type === "COURSES") return "course";
  if (item.content_type === "MUSIC") return "music";
  return "meditation";
}

function formatLabel(item) {
  if (item.item_type === "COURSES") return "Course";
  if (item.content_format === "VIDEO" && item.content_type === "MUSIC") return "Music video";
  if (item.content_format === "VIDEO") return "Video meditation";
  if (item.content_type === "MUSIC") return "Music";
  if (item.content_type === "TALKS") return "Talk";
  return "Meditation";
}

function durationLabel(item) {
  if (item.item_type === "COURSES") return `${item.days || "Multi"}-day course`;
  const minutes = Math.max(1, Math.round(Number(item.media_length || 0) / 60));
  return `${minutes} min`;
}

function itemHref(item, sourceUrl) {
  const path = item.web_url || new URL(sourceUrl).pathname;
  return new URL(path, "https://insighttimer.com").href;
}

function englishHashtags(item) {
  const hashtags = Array.isArray(item.hashtags) ? item.hashtags : [];
  return hashtags
    .filter((tag) => typeof tag?.id === "string" && tag.id.endsWith("-en"))
    .flatMap((tag) => [tag.name, tag.topic]);
}

function buildSearchTerms(item) {
  const aiTags = Array.isArray(item.ai_tags_with_score)
    ? item.ai_tags_with_score.map((tag) => tag?.tag)
    : [];
  return normalizeText(unique([
    item.title,
    item.short_description,
    item.activity,
    item.content,
    item.lang?.name,
    ...(item.topics || []),
    ...(item.tags || []),
    ...aiTags,
    ...englishHashtags(item)
  ]).join(" ")).toLowerCase().slice(0, 1000);
}

function buildIntents(searchTerms) {
  const intents = Object.entries(intentRules)
    .filter(([, phrases]) => phrases.some((phrase) => searchTerms.includes(phrase)))
    .map(([intent]) => intent);
  return intents.length ? intents : ["peace"];
}

function compactItem(item, sourceUrl) {
  const searchTerms = buildSearchTerms(item);
  const description = truncateDescription(item.short_description || item.long_description);
  return {
    id: item.id,
    slug: item.slug,
    title: normalizeText(item.title),
    type: itemType(item),
    format: formatLabel(item),
    duration: durationGroups(item),
    durationLabel: durationLabel(item),
    durationMinutes: item.item_type === "COURSES" ? null : Math.max(1, Math.round(Number(item.media_length || 0) / 60)),
    language: item.lang?.iso_639_1 || "music",
    languageLabel: item.lang?.iso_639_1 === "m1" ? "No Spoken Words" : (item.lang?.name || "Music"),
    intents: buildIntents(searchTerms),
    searchTerms,
    description: description || `Explore ${normalizeText(item.title)} on Insight Timer.`,
    href: itemHref(item, sourceUrl),
    action: "Open on Insight Timer",
    rating: Number(item.rating_score || 0),
    plays: Number(item.play_count || item.temp_play_count || 0),
    approvedAt: item.approved_at?.iso_8601_datetime_tz || null
  };
}

function sitemapIsCatalogue(url) {
  const name = new URL(url).pathname.split("/").pop();
  return /(?:courses|tracks|videos).*\.xml$/i.test(name) && !/(worksheet|retreat)/i.test(name);
}

function extractUrls(xml) {
  return [...xml.matchAll(/<loc>(https:\/\/insighttimer\.com\/[^<]*pabloarellano[^<]*)<\/loc>/g)]
    .map((match) => match[1].replaceAll("&amp;", "&"));
}

async function readSitemaps() {
  if (sitemapDir) {
    const filenames = (await readdir(sitemapDir))
      .filter((name) => name.startsWith("it-sitemap-") && name.endsWith(".xml"));
    const documents = await Promise.all(
      filenames.map((name) => readFile(join(sitemapDir, name), "utf8"))
    );
    return unique([...documents.flatMap(extractUrls), ...ACTIVE_COURSE_URLS]);
  }

  const indexResponse = await fetch(SITEMAP_INDEX);
  if (!indexResponse.ok) throw new Error(`Sitemap index returned ${indexResponse.status}`);
  const indexXml = await indexResponse.text();
  const sitemapUrls = [...indexXml.matchAll(/<loc>(https:[^<]+)<\/loc>/g)]
    .map((match) => match[1])
    .filter(sitemapIsCatalogue);

  const documents = [];
  for (let index = 0; index < sitemapUrls.length; index += 6) {
    const batch = sitemapUrls.slice(index, index + 6);
    const batchDocuments = await Promise.all(batch.map(async (url) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`${url} returned ${response.status}`);
      return response.text();
    }));
    documents.push(...batchDocuments);
  }
  return unique([...documents.flatMap(extractUrls), ...ACTIVE_COURSE_URLS]);
}

async function fetchItem(sourceUrl, attempt = 1) {
  const slug = new URL(sourceUrl).pathname.split("/").filter(Boolean).pop();
  try {
    const response = await fetch(`${ITEM_API}/${encodeURIComponent(slug)}/slug`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const item = await response.json();
    if (item.status !== "PUBLISHED") return null;
    if (item.publisher?.id !== PUBLISHER_ID && item.publisher?.username !== PROFILE) return null;
    return compactItem(item, sourceUrl);
  } catch (error) {
    if (attempt >= 3) {
      console.warn(`Skipped ${slug}: ${error.message}`);
      return null;
    }
    await new Promise((resolve) => setTimeout(resolve, 400 * attempt));
    return fetchItem(sourceUrl, attempt + 1);
  }
}

async function mapConcurrent(values, limit, mapper) {
  const results = new Array(values.length);
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < values.length) {
      const currentIndex = nextIndex++;
      results[currentIndex] = await mapper(values[currentIndex]);
      if ((currentIndex + 1) % 50 === 0) {
        console.log(`Read ${currentIndex + 1} of ${values.length} catalogue links`);
      }
    }
  }
  await Promise.all(Array.from({ length: limit }, worker));
  return results;
}

const sourceUrls = await readSitemaps();
console.log(`Found ${sourceUrls.length} public Insight Timer links for ${PROFILE}`);

const fetchedItems = await mapConcurrent(sourceUrls, 10, fetchItem);
const itemsById = new Map();
for (const item of fetchedItems.filter(Boolean)) {
  const current = itemsById.get(item.id);
  if (!current || item.href.includes("/video-")) itemsById.set(item.id, item);
}

const items = [...itemsById.values()].sort((a, b) => {
  const dateDifference = String(b.approvedAt || "").localeCompare(String(a.approvedAt || ""));
  if (dateDifference) return dateDifference;
  return a.title.localeCompare(b.title);
});

const catalogue = {
  source: PROFILE_URL,
  syncedAt: new Date().toISOString(),
  count: items.length,
  items
};

await writeFile(OUTPUT_PATH, `${JSON.stringify(catalogue)}\n`, "utf8");
console.log(`Wrote ${items.length} published catalogue items to ${OUTPUT_PATH}`);

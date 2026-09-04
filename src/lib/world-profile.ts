/** Profil de découverte World Room (mock, aucune authentification). */
export type WorldProfileDraft = {
  username: string;
  completed: boolean;
  firstName: string;
  lastName: string;
  birthdate: string;
  photos: string[];
  gender: "femme" | "homme" | "autre" | "";
  orientation: string;
  showAge: boolean;
  country: string;
  city: string;
  languages: string[];
  intentions: string[];
};

const KEY = "zembo-world-profile-draft";

export const EMPTY_WORLD_PROFILE: WorldProfileDraft = {
  username: "",
  completed: false,
  firstName: "",
  lastName: "",
  birthdate: "",
  photos: [],
  gender: "",
  orientation: "",
  showAge: true,
  country: "Canada",
  city: "",
  languages: [],
  intentions: [],
};

export function loadWorldProfile(): WorldProfileDraft {
  if (typeof window === "undefined") return EMPTY_WORLD_PROFILE;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY_WORLD_PROFILE;
    return { ...EMPTY_WORLD_PROFILE, ...(JSON.parse(raw) as Partial<WorldProfileDraft>) };
  } catch {
    return EMPTY_WORLD_PROFILE;
  }
}

export function saveWorldProfile(draft: WorldProfileDraft) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(draft));
  } catch {
    /* ignore */
  }
}

/** Pseudos déjà utilisés (mock) — le pseudo World Room doit être unique. */
export const TAKEN_USERNAMES = [
  "deena_zembo",
  "admin",
  "zembo",
  "worldroom",
  "moussa",
  "chloe",
];

export function normalizeUsername(v: string) {
  return v
    .toLowerCase()
    .replace(/[^a-z0-9._]/g, "")
    .slice(0, 20);
}

export type UsernameState = "empty" | "short" | "taken" | "ok";

export function checkUsername(v: string): UsernameState {
  const u = normalizeUsername(v);
  if (!u) return "empty";
  if (u.length < 3) return "short";
  return TAKEN_USERNAMES.includes(u) ? "taken" : "ok";
}

/** Un profil World Room existe déjà (pseudo choisi + onboarding terminé). */
export function hasWorldProfile() {
  const p = loadWorldProfile();
  return p.completed && p.username.trim().length > 0;
}

export function ageFromBirthdate(birthdate: string): number | null {
  if (!birthdate) return null;
  const d = new Date(birthdate);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
  return age >= 0 && age < 120 ? age : null;
}

export const ORIENTATIONS = [
  "Hétérosexuel·le",
  "Homosexuel·le",
  "Bisexuel·le",
  "Pansexuel·le",
  "Autre",
  "Préfère ne pas dire",
];

export const COUNTRIES = [
  "Canada",
  "France",
  "Belgique",
  "Suisse",
  "Sénégal",
  "Côte d'Ivoire",
  "Cameroun",
  "Maroc",
  "États-Unis",
  "Royaume-Uni",
  "Espagne",
  "Brésil",
];

export const LANGUAGES = ["Français", "English", "Español", "Português", "Wolof", "Arabe", "Deutsch"];

export const INTENTIONS = [
  { key: "amitie", icon: "👥", label: "Amitié" },
  { key: "discussion", icon: "💬", label: "Discussion" },
  { key: "serieuse", icon: "❤️", label: "Rencontre sérieuse" },
  { key: "legere", icon: "⚡", label: "Rencontre sans prise de tête" },
  { key: "peu-importe", icon: "♾", label: "Peu importe" },
];

export function intentionLabels(keys: string[]) {
  return keys
    .map((k) => INTENTIONS.find((i) => i.key === k)?.label)
    .filter(Boolean) as string[];
}

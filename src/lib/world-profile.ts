/** Profil de découverte World Room (mock, aucune authentification). */
export type WorldProfileDraft = {
  pseudo: string;
  age: string;
  bio: string;
  sunday: string;
  redFlag: string;
  travel: string;
};

const KEY = "zembo-world-profile-draft";

export const EMPTY_WORLD_PROFILE: WorldProfileDraft = {
  pseudo: "",
  age: "",
  bio: "",
  sunday: "",
  redFlag: "",
  travel: "",
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

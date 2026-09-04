import { useSyncExternalStore } from "react";

export type FormatId = "storytime" | "open-mic" | "stand" | "slam";

export const FORMAT_META: Record<
  FormatId,
  { name: string; subtitle: string; accent: string; placeholder: string }
> = {
  storytime: {
    name: "Story Time",
    subtitle: "Partage ton histoire. Inspire la communauté.",
    accent: "oklch(0.62 0.24 300)",
    placeholder: "Mon pire date… et ce que j'en ai appris !",
  },
  "open-mic": {
    name: "Micro Ouvert",
    subtitle: "Anime, partage, échange avec ta communauté.",
    accent: "oklch(0.68 0.16 158)",
    placeholder: "Masterclass : parler en public sans stress",
  },
  stand: {
    name: "Stand-Up",
    subtitle: "Le micro t'appartient. Monte sur scène.",
    accent: "oklch(0.82 0.13 85)",
    placeholder: "5 minutes pour te faire rire (ou pas)",
  },
  slam: {
    name: "Slam Thérapie",
    subtitle: "Tes mots. Ta voix. Ta scène.",
    accent: "oklch(0.6 0.22 350)",
    placeholder: "Slam : lettre à celle que j'étais",
  },
};

export function isFormatId(v: string): v is FormatId {
  return v === "storytime" || v === "open-mic" || v === "stand" || v === "slam";
}

export type LiveConfig = {
  title: string;
  description: string;
  cover: string | null;
  visibility: "public" | "private";
  access: "free" | "paid";
  price: 1 | 3 | 5 | 10;
  comments: "all" | "followers" | "none";
  rules: string;
};

const DEFAULTS: LiveConfig = {
  title: "",
  description: "",
  cover: null,
  visibility: "public",
  access: "free",
  price: 5,
  comments: "all",
  rules: "Respect • Pas de jugement • Bonne vibe uniquement ! ✨",
};

let state: LiveConfig = { ...DEFAULTS };
const listeners = new Set<() => void>();

export function setLiveConfig(patch: Partial<LiveConfig>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

export function getLiveConfig() {
  return state;
}

export function useLiveConfig() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => state,
  );
}

export const VISIBILITY_LABEL = { public: "Public", private: "Privé" } as const;
export const ACCESS_LABEL = { free: "Gratuit", paid: "Payant" } as const;
export const COMMENTS_LABEL = {
  all: "Tout le monde",
  followers: "Abonnés uniquement",
  none: "Personne (Mode écoute)",
} as const;

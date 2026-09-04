// « Zembo Sounds » — placeholders de mélodies (les vraies pistes arriveront plus tard).
// Chaque mélodie existe en version 1 min et 3 min.

export type SlamDuration = 1 | 3;

export type Mood = {
  id: string;
  label: string;
  emoji: string;
};

export const MOODS: Mood[] = [
  { id: "piano", label: "Piano", emoji: "🎹" },
  { id: "guitare", label: "Guitare", emoji: "🎸" },
  { id: "lofi", label: "Lo-fi", emoji: "🎧" },
  { id: "emotion", label: "Émotion", emoji: "〰" },
  { id: "melancolique", label: "Mélancolique", emoji: "🌧" },
  { id: "motivante", label: "Motivante", emoji: "⚡" },
  { id: "afro", label: "Afro douce", emoji: "🥁" },
  { id: "aucune", label: "Sans musique", emoji: "🔇" },
];

export type Sound = {
  id: string;
  name: string;
  mood: string;
  /** durée en minutes : 1 ou 3 uniquement */
  duration: SlamDuration;
  /** libellé d'aperçu (placeholder, pas d'audio pour l'instant) */
  preview: string;
};

const NAMES: Record<string, string[]> = {
  piano: ["Renaissance", "Cicatrices", "Nouveau départ"],
  guitare: ["Je me relève", "Racines", "Douce lumière"],
  lofi: ["Nuit calme", "Respire", "Chambre 4"],
  emotion: ["Larmes sèches", "Silence plein", "Ce que j'ai tu"],
  melancolique: ["Pluie de mars", "Absence", "Vieux carnet"],
  motivante: ["Debout", "Plus fort", "Ma revanche"],
  afro: ["Sankofa", "Terre chaude", "Mama"],
};

export const ZEMBO_SOUNDS: Sound[] = Object.entries(NAMES).flatMap(([mood, names]) =>
  names.flatMap((name) =>
    ([1, 3] as SlamDuration[]).map((duration) => ({
      id: `${mood}-${name}-${duration}`,
      name,
      mood,
      duration,
      preview: `${name} · aperçu`,
    })),
  ),
);

export const soundsFor = (mood: string | null, duration: SlamDuration | null): Sound[] => {
  if (!mood || mood === "aucune" || !duration) return [];
  return ZEMBO_SOUNDS.filter((s) => s.mood === mood && s.duration === duration);
};

export const moodOf = (id: string): Mood => MOODS.find((m) => m.id === id) ?? MOODS[0]!;

export const fmtDur = (d: SlamDuration) => (d === 1 ? "01:00" : "03:00");

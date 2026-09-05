import { zembo } from "./zembo-supabase";
import {
  EMPTY_WORLD_PROFILE,
  ageNumber,
  saveWorldProfile,
  type WorldProfileDraft,
} from "./world-profile";

/**
 * Persistance réelle du profil World Room dans la base ZEMBO (table
 * `public.world_profiles`, une ligne par compte). Le stockage local reste un
 * simple cache : la base est la source de vérité, donc le profil survit à un
 * rechargement et à un changement d'appareil.
 */

export type WorldProfileRow = {
  user_id: string;
  username: string | null;
  photos: string[] | null;
  age: number | null;
  bio: string | null;
  answer_sunday: string | null;
  answer_red_flag: string | null;
  answer_escape: string | null;
  gender: string | null;
  orientation: string | null;
  show_age: boolean | null;
  country: string | null;
  city: string | null;
  languages: string[] | null;
  intentions: string[] | null;
  completed: boolean | null;
};

function rowToDraft(row: WorldProfileRow): WorldProfileDraft {
  return {
    ...EMPTY_WORLD_PROFILE,
    username: row.username ?? "",
    completed: row.completed ?? false,
    photos: row.photos ?? [],
    age: row.age != null ? String(row.age) : "",
    bio: row.bio ?? "",
    answerSunday: row.answer_sunday ?? "",
    answerRedFlag: row.answer_red_flag ?? "",
    answerEscape: row.answer_escape ?? "",
    gender: (row.gender as WorldProfileDraft["gender"]) ?? "",
    orientation: row.orientation ?? "",
    showAge: row.show_age ?? true,
    country: row.country ?? EMPTY_WORLD_PROFILE.country,
    city: row.city ?? "",
    languages: row.languages ?? [],
    intentions: row.intentions ?? [],
  };
}

function draftToRow(userId: string, d: WorldProfileDraft) {
  return {
    user_id: userId,
    username: d.username.trim() || null,
    photos: d.photos,
    age: ageNumber(d.age),
    bio: d.bio.trim() || null,
    answer_sunday: d.answerSunday.trim() || null,
    answer_red_flag: d.answerRedFlag.trim() || null,
    answer_escape: d.answerEscape.trim() || null,
    gender: d.gender || null,
    orientation: d.orientation || null,
    show_age: d.showAge,
    country: d.country || null,
    city: d.city.trim() || null,
    languages: d.languages,
    intentions: d.intentions,
    completed: d.completed,
  };
}

/** Lit le profil World Room du compte en base. `null` = aucun profil enregistré. */
export async function fetchWorldProfile(userId: string): Promise<WorldProfileDraft | null> {
  const { data, error } = await zembo
    .from("world_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    console.warn("[World Room] lecture du profil impossible :", error.message);
    return null;
  }
  if (!data) return null;
  const draft = rowToDraft(data as WorldProfileRow);
  saveWorldProfile(draft); // cache local
  return draft;
}

/** Enregistre (crée ou met à jour) le profil World Room du compte en base. */
export async function upsertWorldProfile(
  userId: string,
  draft: WorldProfileDraft,
): Promise<{ ok: boolean; error?: string }> {
  saveWorldProfile(draft); // cache local immédiat
  const { error } = await zembo
    .from("world_profiles")
    .upsert(draftToRow(userId, draft), { onConflict: "user_id" });
  if (error) {
    console.warn("[World Room] enregistrement du profil impossible :", error.message);
    return {
      ok: false,
      error:
        error.code === "23505"
          ? "Ce pseudo est déjà pris."
          : "Ton profil n'a pas pu être enregistré. Réessaie.",
    };
  }
  return { ok: true };
}

/** Le pseudo est-il déjà utilisé par un autre compte ? (vérification réelle) */
export async function isUsernameTaken(username: string, userId?: string): Promise<boolean> {
  const u = username.trim().toLowerCase();
  if (!u) return false;
  const { data, error } = await zembo
    .from("world_profiles")
    .select("user_id")
    .ilike("username", u)
    .limit(5);
  if (error || !data) return false;
  return data.some((r: { user_id: string }) => r.user_id !== userId);
}

/** Démo : supprime le profil World Room du compte en base. */
export async function deleteWorldProfile(userId: string) {
  await zembo.from("world_profiles").delete().eq("user_id", userId);
}

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Projet Supabase ZEMBO existant (base de l'app). La clé ci-dessous est la clé
// publique "anon" : elle est conçue pour être exposée côté navigateur.
export const ZEMBO_SUPABASE_URL = "https://tadyfoxiptrsmpymsjgg.supabase.co";
export const ZEMBO_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhZHlmb3hpcHRyc21weW1zamdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyMzIwMDQsImV4cCI6MjEwMzgwODAwNH0.KtSc2C6JOrm_XL8PoSsj-iO209NEQwPRGWrTAAAAbSk";

let _client: SupabaseClient | undefined;

function createZemboClient(): SupabaseClient {
  const isBrowser = typeof window !== "undefined";
  return createClient(ZEMBO_SUPABASE_URL, ZEMBO_SUPABASE_ANON_KEY, {
    auth: {
      storageKey: "zembo-auth",
      persistSession: isBrowser,
      autoRefreshToken: isBrowser,
      detectSessionInUrl: isBrowser,
    },
  });
}

/** Client Supabase du projet ZEMBO (auth + données de l'app). */
export const zembo = new Proxy({} as SupabaseClient, {
  get(_, prop, receiver) {
    if (!_client) _client = createZemboClient();
    return Reflect.get(_client, prop, receiver);
  },
});

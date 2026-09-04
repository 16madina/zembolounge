import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { zembo } from "./zembo-supabase";

/** Session du compte ZEMBO (même compte que l'app). */
export function useZemboAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    zembo.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session ?? null);
      setLoading(false);
    });

    const { data: sub } = zembo.auth.onAuthStateChange((_event, next) => {
      setSession(next ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const user: User | null = session?.user ?? null;

  return {
    session,
    user,
    loading,
    signOut: () => zembo.auth.signOut(),
  };
}

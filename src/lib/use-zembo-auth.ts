import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { zembo } from "./zembo-supabase";

/**
 * Session du compte ZEMBO (même compte que l'app).
 * `loading` reste vrai tant que la session n'est pas connue DE FAÇON FIABLE :
 * on attend à la fois getSession() et l'événement INITIAL_SESSION avant de
 * conclure « non connecté » (sinon on redirigerait un utilisateur connecté
 * vers l'auth par erreur).
 */
export function useZemboAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let settled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const settle = (next: Session | null) => {
      if (!active) return;
      settled = true;
      if (timer) clearTimeout(timer);
      setSession(next);
      setLoading(false);
    };

    const { data: sub } = zembo.auth.onAuthStateChange((event, next) => {
      if (!active) return;
      if (next) {
        settle(next);
        return;
      }
      // INITIAL_SESSION sans session = chargement terminé, vraiment non connecté.
      if (event === "INITIAL_SESSION" && !settled) settle(null);
      // Après chargement, refléter les changements (connexion/déconnexion).
      if (settled) setSession(next ?? null);
    });

    zembo.auth.getSession().then(({ data }) => {
      if (!active || settled) return;
      if (data.session) {
        settle(data.session);
      } else {
        // getSession() peut répondre null avant la restauration depuis le
        // stockage : on laisse un délai de grâce à INITIAL_SESSION.
        timer = setTimeout(() => settle(null), 2500);
      }
    });

    return () => {
      active = false;
      if (timer) clearTimeout(timer);
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

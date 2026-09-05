import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Globe } from "lucide-react";
import { useEffect } from "react";
import { useZemboAuth } from "@/lib/use-zembo-auth";
import { hasWorldProfile } from "@/lib/world-profile";
import { fetchWorldProfile } from "@/lib/world-profile-db";

export const Route = createFileRoute("/world/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "World Room — Zembo" },
      {
        name: "description",
        content:
          "Entre dans World Room : découvre des profils du monde entier, ou crée ton profil de découverte en quelques étapes.",
      },
      { property: "og:title", content: "World Room — Zembo" },
      { property: "og:description", content: "Le monde est à un Hello." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorldEntry,
});

function WorldEntry() {
  const navigate = useNavigate();
  const { session, loading } = useZemboAuth();

  useEffect(() => {
    if (loading) return;

    // Vérification 1 — compte Zembo actif ?
    if (!session) {
      navigate({ to: "/login", search: { redirect: "/world" }, replace: true });
      return;
    }

    // Vérification 2 — profil World Room existant ?
    navigate({ to: hasWorldProfile() ? "/world/discover" : "/world/intro", replace: true });
  }, [loading, session, navigate]);

  return (
    <div className="flex h-[100dvh] items-center justify-center bg-[oklch(0.06_0.01_50)]">
      <Globe size={30} className="animate-pulse text-gold" />
      <span className="sr-only">Ouverture de World Room…</span>
    </div>
  );
}

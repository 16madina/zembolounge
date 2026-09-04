import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Globe, Sparkles } from "lucide-react";
import { Pressable } from "@/components/zembo/ui";

export const Route = createFileRoute("/world/onboarding/1")({
  head: () => ({
    meta: [
      { title: "World Room — Onboarding — Zembo" },
      {
        name: "description",
        content: "Crée ton profil World Room, étape par étape.",
      },
      { property: "og:title", content: "World Room — Onboarding — Zembo" },
      { property: "og:description", content: "Crée ton profil World Room." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorldOnboarding1,
});

function WorldOnboarding1() {
  const navigate = useNavigate();
  return (
    <div className="app-scroll no-scrollbar flex min-h-[100dvh] flex-col items-center px-6 pt-[max(env(safe-area-inset-top),14px)] text-center">
      <div className="flex w-full items-center">
        <Pressable
          onClick={() => navigate({ to: "/world/intro" })}
          aria-label="Retour"
          className="-ml-1 rounded-full p-1"
        >
          <ArrowLeft size={24} className="text-gold" />
        </Pressable>
      </div>

      <div className="mt-20 flex flex-col items-center">
        <span className="relative flex h-28 w-28 items-center justify-center">
          <span
            className="absolute inset-0 rounded-full opacity-60 blur-2xl"
            style={{
              background:
                "radial-gradient(circle, oklch(0.78 0.13 82 / 55%), transparent 70%)",
            }}
          />
          <span className="relative flex h-20 w-20 items-center justify-center rounded-full border border-gold/30 bg-gold/8">
            <Globe size={38} className="text-gold" />
          </span>
        </span>

        <h2 className="mt-7 text-[24px] font-extrabold tracking-tight text-foreground">
          Onboarding World Room
        </h2>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-gold/8 px-4 py-1.5 text-[12px] font-bold tracking-wide text-gold">
          <Sparkles size={13} /> BIENTÔT
        </span>
        <p className="mt-4 max-w-[260px] text-[13px] leading-relaxed text-muted-foreground">
          Cette étape arrive juste après. En attendant, retourne à l'accueil
          World Room.
        </p>

        <Pressable
          onClick={() => navigate({ to: "/world/intro" })}
          className="mt-7 rounded-full bg-gold-gradient px-6 py-3 text-[13px] font-bold text-[oklch(0.16_0.02_60)]"
        >
          Retour à World Room
        </Pressable>
      </div>
    </div>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Camera, Plus } from "lucide-react";
import { Pressable } from "@/components/zembo/ui";

export const Route = createFileRoute("/world/onboarding/2")({
  head: () => ({
    meta: [
      { title: "Tes photos World Room — Zembo" },
      {
        name: "description",
        content: "Étape 2/6 : ajoute les photos de ton profil de découverte World Room.",
      },
      { property: "og:title", content: "Tes photos World Room — Zembo" },
      {
        property: "og:description",
        content: "Ajoute jusqu'à 6 photos pour ta carte de découverte.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorldOnboarding2,
});

function WorldOnboarding2() {
  const navigate = useNavigate();
  return (
    <div className="app-scroll no-scrollbar min-h-[100dvh] bg-[oklch(0.06_0.01_50)] px-5 pb-10 pt-[max(env(safe-area-inset-top),14px)]">
      <div className="flex items-center gap-2">
        <Pressable
          onClick={() => navigate({ to: "/world/onboarding/1" })}
          aria-label="Retour"
          className="-ml-1 rounded-full p-1"
        >
          <ArrowLeft size={22} className="text-gold" />
        </Pressable>
        <span className="text-[12px] font-semibold tracking-wide text-muted-foreground">
          ÉTAPE 2/6
        </span>
      </div>

      <div className="mt-3 flex gap-1.5">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full ${i <= 1 ? "bg-gold-gradient" : "bg-white/10"}`}
          />
        ))}
      </div>

      <h1 className="mt-5 text-[22px] font-extrabold leading-tight text-foreground">
        Tes photos
      </h1>
      <p className="mt-1.5 text-[13px] text-muted-foreground">
        Ajoute jusqu'à 6 photos. La première sera ta photo principale.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Pressable
            key={i}
            className="flex aspect-[3/4] flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed border-gold/30 bg-white/[0.03]"
          >
            {i === 0 ? (
              <Camera size={20} className="text-gold" />
            ) : (
              <Plus size={18} className="text-gold/70" />
            )}
            <span className="text-[10px] text-muted-foreground">
              {i === 0 ? "Principale" : "Ajouter"}
            </span>
          </Pressable>
        ))}
      </div>

      <p className="mt-4 rounded-2xl border border-gold/20 bg-gold/[0.05] p-3 text-[11.5px] leading-relaxed text-muted-foreground">
        L'ajout de photos et les étapes 3 à 6 (genre, orientation, pays, ville, langues,
        intentions) arrivent juste après.
      </p>

      <div className="mt-6 flex w-full items-center justify-center rounded-full border border-gold/25 bg-white/[0.04] py-3.5 text-[14px] font-bold text-muted-foreground">
        Suite bientôt
      </div>
    </div>
  );
}

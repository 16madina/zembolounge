import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Camera, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { WorldStep, worldHead } from "@/components/zembo/WorldStep";
import { Pressable } from "@/components/zembo/ui";
import {
  EMPTY_WORLD_PROFILE,
  loadWorldProfile,
  saveWorldProfile,
  type WorldProfileDraft,
} from "@/lib/world-profile";

export const Route = createFileRoute("/world/onboarding/2")({
  head: worldHead(2, "Ajoute tes photos", "Ajoute jusqu'à 6 photos pour ton profil de découverte World Room."),
  component: Step2,
});

const TINTS = [
  "linear-gradient(150deg, oklch(0.7 0.13 60), oklch(0.4 0.09 35))",
  "linear-gradient(150deg, oklch(0.68 0.13 300), oklch(0.38 0.1 290))",
  "linear-gradient(150deg, oklch(0.7 0.12 160), oklch(0.4 0.09 170))",
  "linear-gradient(150deg, oklch(0.7 0.13 250), oklch(0.4 0.1 260))",
  "linear-gradient(150deg, oklch(0.78 0.13 85), oklch(0.5 0.11 70))",
  "linear-gradient(150deg, oklch(0.66 0.12 20), oklch(0.38 0.09 15))",
];

function Step2() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState<WorldProfileDraft>(EMPTY_WORLD_PROFILE);
  useEffect(() => setDraft(loadWorldProfile()), []);

  const photos = draft.photos;
  const add = () =>
    setDraft((d) =>
      d.photos.length >= 6 ? d : { ...d, photos: [...d.photos, TINTS[d.photos.length % TINTS.length]] },
    );
  const remove = (i: number) =>
    setDraft((d) => ({ ...d, photos: d.photos.filter((_, idx) => idx !== i) }));

  return (
    <WorldStep
      step={2}
      title="Ajoute tes photos"
      subtitle="Montre ta vraie personnalité !"
      back="/world/onboarding/1"
      ctaDisabled={photos.length < 2}
      onCta={() => {
        saveWorldProfile(draft);
        navigate({ to: "/world/onboarding/3" });
      }}
    >
      <div className="grid grid-cols-2 gap-3">
        {photos[0] ? (
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-gold/30">
            <div className="h-full w-full" style={{ background: photos[0] }} />
            <span className="absolute bottom-2 left-2 rounded-md bg-gold-gradient px-1.5 py-0.5 text-[9.5px] font-bold text-[oklch(0.16_0.02_60)]">
              Photo principale
            </span>
            <Pressable
              onClick={() => remove(0)}
              aria-label="Retirer la photo principale"
              className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/70"
            >
              <X size={13} className="text-white" />
            </Pressable>
          </div>
        ) : (
          <Pressable
            onClick={add}
            className="relative flex aspect-[3/4] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gold/40 bg-white/[0.03] px-2"
          >
            <Camera size={24} className="text-gold" />
            <span className="text-center text-[11px] leading-tight text-muted-foreground">
              Ajouter une photo principale
            </span>
            <span className="rounded-md bg-gold-gradient px-1.5 py-0.5 text-[9.5px] font-bold text-[oklch(0.16_0.02_60)]">
              Photo principale
            </span>
          </Pressable>
        )}

        {photos[1] ? (
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-gold/20">
            <div className="h-full w-full" style={{ background: photos[1] }} />
            <Pressable
              onClick={() => remove(1)}
              aria-label="Retirer la photo"
              className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/70"
            >
              <X size={13} className="text-white" />
            </Pressable>
          </div>
        ) : (
          <Pressable
            onClick={add}
            className="flex aspect-[3/4] flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed border-gold/25 bg-white/[0.03]"
          >
            <Plus size={20} className="text-gold/80" />
            <span className="text-[10.5px] text-muted-foreground">Ajouter</span>
          </Pressable>
        )}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3">
        {[2, 3, 4].map((i) =>
          photos[i] ? (
            <div key={i} className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-gold/20">
              <div className="h-full w-full" style={{ background: photos[i] }} />
              <Pressable
                onClick={() => remove(i)}
                aria-label="Retirer la photo"
                className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/70"
              >
                <X size={11} className="text-white" />
              </Pressable>
            </div>
          ) : (
            <Pressable
              key={i}
              onClick={add}
              className="flex aspect-[3/4] items-center justify-center rounded-2xl border border-dashed border-gold/25 bg-white/[0.03]"
            >
              <Plus size={18} className="text-gold/70" />
            </Pressable>
          ),
        )}
      </div>

      <p className="mt-4 text-[11.5px] leading-relaxed text-muted-foreground">
        Ajoute au moins 2 photos. Tu peux en ajouter jusqu'à 6. ({photos.length}/6)
      </p>
    </WorldStep>
  );
}

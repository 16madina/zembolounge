import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MapPin, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { WorldStep, worldHead } from "@/components/zembo/WorldStep";
import { useZemboAuth } from "@/lib/use-zembo-auth";
import {
  EMPTY_WORLD_PROFILE,
  ageNumber,
  intentionLabels,
  loadWorldProfile,
  saveWorldProfile,
  type WorldProfileDraft,
} from "@/lib/world-profile";
import { upsertWorldProfile } from "@/lib/world-profile-db";

export const Route = createFileRoute("/world/onboarding/7")({
  head: worldHead(7, "Ton profil est prêt", "Récapitulatif de ton profil World Room avant d'entrer dans la découverte."),
  component: Step6,
});

function Step6() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState<WorldProfileDraft>(EMPTY_WORLD_PROFILE);
  useEffect(() => setDraft(loadWorldProfile()), []);

  const age = ageNumber(draft.age);
  const labels = intentionLabels(draft.intentions);
  const main = draft.photos[0];

  return (
    <WorldStep
      step={7}
      title="Ton profil est prêt !"
      subtitle="Voici un aperçu de ce que les autres verront."
      back="/world/onboarding/6"
      cta="Entrer dans World Room"
      onCta={() => {
        saveWorldProfile({ ...draft, completed: true });
        navigate({ to: "/world/discover" });
      }}
      secondary="Modifier"
      onSecondary={() => navigate({ to: "/world/onboarding/1" })}
    >
      <div className="rounded-3xl border border-gold/25 bg-white/[0.03] p-4">
        <div className="flex items-center gap-3.5">
          <span
            className="flex h-20 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gold/25"
            style={main ? { background: main } : undefined}
          >
            {!main && <User size={22} className="text-gold/70" />}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[17px] font-extrabold text-foreground">
              {draft.username ? `@${draft.username}` : "Ton pseudo"}
              {draft.showAge && age !== null ? `, ${age}` : ""}
            </p>
            {draft.bio && (
              <p className="truncate text-[12.5px] text-foreground/80">{draft.bio}</p>
            )}
            <p className="mt-1 flex items-center gap-1 truncate text-[12.5px] text-muted-foreground">
              <MapPin size={12} className="shrink-0 text-gold" />
              {[draft.city, draft.country].filter(Boolean).join(", ") || "Ta ville"}
            </p>
            {draft.languages.length > 0 && (
              <p className="mt-1 truncate text-[11.5px] text-muted-foreground">
                {draft.languages.join(" · ")}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
            Intentions
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(labels.length ? labels : ["À compléter"]).map((l) => (
              <span
                key={l}
                className="rounded-full border border-gold/30 bg-gold/[0.08] px-2.5 py-1 text-[11.5px] font-semibold text-gold"
              >
                {l}
              </span>
            ))}
          </div>
        </div>

        {draft.photos.length > 1 && (
          <div className="mt-4 flex gap-2">
            {draft.photos.slice(1, 6).map((p, i) => (
              <span
                key={i}
                className="h-12 w-10 shrink-0 rounded-xl border border-white/10"
                style={{ background: p }}
              />
            ))}
          </div>
        )}
      </div>

      <p className="mt-4 text-[11.5px] leading-relaxed text-muted-foreground">
        Ton profil World Room est séparé de ton compte Zembo. Tu pourras le modifier à tout moment.
      </p>
    </WorldStep>
  );
}

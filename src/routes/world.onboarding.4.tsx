import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { WorldStep, worldHead, worldInputCls } from "@/components/zembo/WorldStep";
import { Pressable } from "@/components/zembo/ui";
import {
  EMPTY_WORLD_PROFILE,
  ORIENTATIONS,
  loadWorldProfile,
  saveWorldProfile,
  type WorldProfileDraft,
} from "@/lib/world-profile";

export const Route = createFileRoute("/world/onboarding/4")({
  head: worldHead(4, "Quelques infos sur toi", "Genre, orientation et visibilité de ton âge sur World Room."),
  component: Step3,
});

const GENDERS = [
  { key: "femme" as const, icon: "♀", label: "Femme" },
  { key: "homme" as const, icon: "♂", label: "Homme" },
  { key: "autre" as const, icon: "⚧", label: "Autre" },
];

function Step3() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState<WorldProfileDraft>(EMPTY_WORLD_PROFILE);
  useEffect(() => setDraft(loadWorldProfile()), []);

  return (
    <WorldStep
      step={4}
      title="Quelques infos sur toi"
      subtitle="Aide les autres à mieux te connaître."
      back="/world/onboarding/3"
      ctaDisabled={!draft.gender}
      onCta={() => {
        saveWorldProfile(draft);
        navigate({ to: "/world/onboarding/5" });
      }}
    >
      <p className="mb-2 text-[12.5px] font-semibold text-foreground">
        Genre <span className="text-gold">*</span>
      </p>
      <div className="grid grid-cols-3 gap-3">
        {GENDERS.map((g) => {
          const active = draft.gender === g.key;
          return (
            <Pressable
              key={g.key}
              onClick={() => setDraft((d) => ({ ...d, gender: g.key }))}
              className={`flex flex-col items-center gap-1.5 rounded-2xl border py-4 ${
                active
                  ? "border-gold bg-gold/[0.1]"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <span className={`text-[22px] leading-none ${active ? "text-gold" : "text-foreground/70"}`}>
                {g.icon}
              </span>
              <span className="text-[12px] font-semibold text-foreground">{g.label}</span>
            </Pressable>
          );
        })}
      </div>

      <div className="mt-6">
        <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">Orientation</label>
        <select
          className={`${worldInputCls} appearance-none`}
          value={draft.orientation}
          onChange={(e) => setDraft((d) => ({ ...d, orientation: e.target.value }))}
        >
          <option value="">Sélectionner</option>
          {ORIENTATIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 rounded-2xl border border-gold/20 bg-white/[0.03] p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[13px] font-semibold text-foreground">Âge visible</span>
          <Pressable
            onClick={() => setDraft((d) => ({ ...d, showAge: !d.showAge }))}
            role="switch"
            aria-checked={draft.showAge}
            aria-label="Âge visible"
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
              draft.showAge ? "bg-gold-gradient" : "bg-white/15"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                draft.showAge ? "left-[22px]" : "left-0.5"
              }`}
            />
          </Pressable>
        </div>
        <p className="mt-2 text-[11.5px] text-muted-foreground">
          Ton âge sera visible sur ton profil.
        </p>
      </div>
    </WorldStep>
  );
}

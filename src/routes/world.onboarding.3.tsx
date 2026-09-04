import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { WorldStep, worldHead, worldInputCls } from "@/components/zembo/WorldStep";
import {
  EMPTY_WORLD_PROFILE,
  ageNumber,
  loadWorldProfile,
  saveWorldProfile,
  type WorldProfileDraft,
} from "@/lib/world-profile";

export const Route = createFileRoute("/world/onboarding/3")({
  head: worldHead(3, "Ton âge et ta World Card", "Âge, bio courte et tes 3 réponses World Card."),
  component: Step3,
});

const ANSWERS = [
  { key: "answerSunday" as const, label: "Mon dimanche parfait", placeholder: "Ex. : brunch et longue marche" },
  { key: "answerRedFlag" as const, label: "Mon plus gros red flag", placeholder: "Ex. : ne jamais répondre" },
  { key: "answerEscape" as const, label: "Si je pouvais partir demain", placeholder: "Ex. : direction Lisbonne" },
];

function Step3() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState<WorldProfileDraft>(EMPTY_WORLD_PROFILE);
  useEffect(() => setDraft(loadWorldProfile()), []);

  const age = ageNumber(draft.age);
  const valid =
    age !== null &&
    ANSWERS.every((a) => draft[a.key].trim().length >= 2);

  return (
    <WorldStep
      step={3}
      title="Ton âge et ta World Card"
      subtitle="Trois réponses valent mille photos."
      back="/world/onboarding/2"
      ctaDisabled={!valid}
      onCta={() => {
        saveWorldProfile(draft);
        navigate({ to: "/world/onboarding/4" });
      }}
    >
      <div className="flex flex-col gap-5">
        <div>
          <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
            Âge <span className="text-gold">*</span>
          </label>
          <input
            className={worldInputCls}
            value={draft.age}
            onChange={(e) =>
              setDraft((d) => ({ ...d, age: e.target.value.replace(/\D/g, "").slice(0, 2) }))
            }
            inputMode="numeric"
            placeholder="Ex. : 27"
          />
          <p className="mt-1.5 text-[11.5px] text-muted-foreground">Entre 18 et 99 ans.</p>
        </div>

        <div>
          <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
            Bio (facultatif)
          </label>
          <textarea
            className={`${worldInputCls} min-h-[84px] resize-none`}
            value={draft.bio}
            onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value.slice(0, 120) }))}
            placeholder="Deux phrases sur toi…"
            maxLength={120}
          />
          <p className="mt-1.5 text-right text-[11px] text-muted-foreground">{draft.bio.length}/120</p>
        </div>

        {ANSWERS.map((a) => (
          <div key={a.key}>
            <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
              {a.label} <span className="text-gold">*</span>
            </label>
            <input
              className={worldInputCls}
              value={draft[a.key]}
              onChange={(e) => setDraft((d) => ({ ...d, [a.key]: e.target.value.slice(0, 90) }))}
              placeholder={a.placeholder}
              maxLength={90}
            />
          </div>
        ))}
      </div>
    </WorldStep>
  );
}

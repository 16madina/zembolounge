import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { WorldStep, worldHead, worldInputCls } from "@/components/zembo/WorldStep";
import {
  EMPTY_WORLD_PROFILE,
  ageFromBirthdate,
  loadWorldProfile,
  saveWorldProfile,
  type WorldProfileDraft,
} from "@/lib/world-profile";

export const Route = createFileRoute("/world/onboarding/1")({
  head: worldHead(1, "Commençons par les bases", "Prénom, nom et date de naissance pour ton profil World Room."),
  component: Step1,
});

function Step1() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState<WorldProfileDraft>(EMPTY_WORLD_PROFILE);
  useEffect(() => setDraft(loadWorldProfile()), []);

  const set = (k: keyof WorldProfileDraft, v: string) => setDraft((d) => ({ ...d, [k]: v }));
  const age = ageFromBirthdate(draft.birthdate);
  const valid =
    draft.firstName.trim().length >= 2 &&
    draft.lastName.trim().length >= 2 &&
    age !== null &&
    age >= 18 &&
    age <= 99;

  return (
    <WorldStep
      step={1}
      title="Commençons par les bases"
      subtitle="Dis-nous qui tu es."
      back="/world/intro"
      ctaDisabled={!valid}
      onCta={() => {
        saveWorldProfile(draft);
        navigate({ to: "/world/onboarding/2" });
      }}
    >
      <div className="flex flex-col gap-5">
        <div>
          <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
            Prénom <span className="text-gold">*</span>
          </label>
          <input
            className={worldInputCls}
            value={draft.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            placeholder="Ex. : Deena"
            maxLength={24}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
            Nom <span className="text-gold">*</span>
          </label>
          <input
            className={worldInputCls}
            value={draft.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            placeholder="Ex. : Diallo"
            maxLength={24}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
            Date de naissance <span className="text-gold">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              className={`${worldInputCls} pr-11`}
              value={draft.birthdate}
              onChange={(e) => set("birthdate", e.target.value)}
            />
            <Calendar
              size={17}
              className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-gold"
            />
          </div>
          <p className="mt-1.5 text-[11.5px] text-muted-foreground">
            Ton âge sera visible, pas ta date de naissance. {age !== null && `(${age} ans)`}
          </p>
        </div>
      </div>
    </WorldStep>
  );
}

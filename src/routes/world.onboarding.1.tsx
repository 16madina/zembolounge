import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { WorldStep, worldHead, worldInputCls } from "@/components/zembo/WorldStep";
import {
  EMPTY_WORLD_PROFILE,
  checkUsername,
  normalizeUsername,
  loadWorldProfile,
  saveWorldProfile,
  type WorldProfileDraft,
} from "@/lib/world-profile";

export const Route = createFileRoute("/world/onboarding/1")({
  head: worldHead(1, "Choisis ton pseudo", "Ton identifiant public World Room, visible sur ta World Card."),
  component: Step1,
});

function Step1() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState<WorldProfileDraft>(EMPTY_WORLD_PROFILE);
  useEffect(() => setDraft(loadWorldProfile()), []);

  const userState = checkUsername(draft.username);

  return (
    <WorldStep
      step={1}
      title="Choisis ton pseudo"
      subtitle="C'est ton identifiant public dans World Room."
      back="/world/intro"
      ctaDisabled={userState !== "ok"}
      onCta={() => {
        saveWorldProfile(draft);
        navigate({ to: "/world/onboarding/2" });
      }}
    >
      <div>
        <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
          Pseudo <span className="text-gold">*</span>
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[14px] font-bold text-gold">
            @
          </span>
          <input
            className={`${worldInputCls} pl-8`}
            value={draft.username}
            onChange={(e) =>
              setDraft((d) => ({ ...d, username: normalizeUsername(e.target.value) }))
            }
            placeholder="deena"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            maxLength={20}
          />
        </div>
        {userState === "ok" && (
          <p className="mt-1.5 text-[11.5px] font-semibold text-[oklch(0.75_0.16_150)]">
            ✓ Pseudo disponible
          </p>
        )}
        {userState === "taken" && (
          <p className="mt-1.5 text-[11.5px] font-semibold text-[oklch(0.65_0.2_25)]">
            ✗ Ce pseudo est déjà pris
          </p>
        )}
        {userState === "short" && (
          <p className="mt-1.5 text-[11.5px] text-muted-foreground">Au moins 3 caractères.</p>
        )}
        {userState === "empty" && (
          <p className="mt-1.5 text-[11.5px] text-muted-foreground">
            Ton identifiant public, visible sur ta World Card.
          </p>
        )}
      </div>

      <p className="mt-5 rounded-2xl border border-gold/25 bg-gold/[0.06] p-3.5 text-[12px] leading-relaxed text-foreground/85">
        ✨ Ton nom, ta date de naissance et ton email restent dans ton compte Zembo. World Room ne
        te demande que tes infos de découverte.
      </p>
    </WorldStep>
  );
}

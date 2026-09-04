import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { WorldStep, worldHead } from "@/components/zembo/WorldStep";
import { Pressable } from "@/components/zembo/ui";
import {
  EMPTY_WORLD_PROFILE,
  INTENTIONS,
  loadWorldProfile,
  saveWorldProfile,
  type WorldProfileDraft,
} from "@/lib/world-profile";

export const Route = createFileRoute("/world/onboarding/6")({
  head: worldHead(6, "Tes intentions", "Amitié, discussion ou rencontre : dis ce que tu cherches sur World Room."),
  component: Step5,
});

function Step5() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState<WorldProfileDraft>(EMPTY_WORLD_PROFILE);
  useEffect(() => setDraft(loadWorldProfile()), []);

  const toggle = (k: string) =>
    setDraft((d) => ({
      ...d,
      intentions: d.intentions.includes(k)
        ? d.intentions.filter((x) => x !== k)
        : [...d.intentions, k],
    }));

  return (
    <WorldStep
      step={6}
      title="Tes intentions"
      subtitle="Qu'est-ce que tu recherches sur World Room ?"
      back="/world/onboarding/5"
      ctaDisabled={draft.intentions.length === 0}
      onCta={() => {
        saveWorldProfile(draft);
        navigate({ to: "/world/onboarding/7" });
      }}
    >
      <div className="flex flex-col gap-3">
        {INTENTIONS.map((it) => {
          const on = draft.intentions.includes(it.key);
          return (
            <Pressable
              key={it.key}
              onClick={() => toggle(it.key)}
              className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left ${
                on ? "border-gold bg-gold/[0.08]" : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <span className="text-[18px] leading-none">{it.icon}</span>
              <span className="min-w-0 flex-1 truncate text-[13.5px] font-semibold text-foreground">
                {it.label}
              </span>
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                  on ? "border-transparent bg-gold-gradient" : "border-white/20"
                }`}
              >
                {on && <Check size={13} className="text-[oklch(0.16_0.02_60)]" />}
              </span>
            </Pressable>
          );
        })}
      </div>

      <p className="mt-5 rounded-2xl border border-gold/25 bg-gold/[0.06] p-3.5 text-[12px] leading-relaxed text-foreground/85">
        ✨ Sois honnête, ça aide à faire des rencontres plus authentiques.
      </p>
    </WorldStep>
  );
}

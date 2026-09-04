import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { WorldStep, worldHead, worldInputCls } from "@/components/zembo/WorldStep";
import { Pressable } from "@/components/zembo/ui";
import {
  COUNTRIES,
  EMPTY_WORLD_PROFILE,
  LANGUAGES,
  loadWorldProfile,
  saveWorldProfile,
  type WorldProfileDraft,
} from "@/lib/world-profile";

export const Route = createFileRoute("/world/onboarding/5")({
  head: worldHead(5, "Où es-tu ?", "Pays, ville et langues parlées pour ton profil World Room."),
  component: Step4,
});

function Step4() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState<WorldProfileDraft>(EMPTY_WORLD_PROFILE);
  const [langOpen, setLangOpen] = useState(false);
  useEffect(() => setDraft(loadWorldProfile()), []);

  const toggleLang = (l: string) =>
    setDraft((d) => ({
      ...d,
      languages: d.languages.includes(l) ? d.languages.filter((x) => x !== l) : [...d.languages, l],
    }));

  return (
    <WorldStep
      step={5}
      title="Où es-tu ?"
      subtitle="Dis-nous d'où tu viens."
      back="/world/onboarding/4"
      ctaDisabled={!draft.country || draft.city.trim().length < 2}
      onCta={() => {
        saveWorldProfile(draft);
        navigate({ to: "/world/onboarding/6" });
      }}
    >
      <div className="flex flex-col gap-5">
        <div>
          <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
            Pays <span className="text-gold">*</span>
          </label>
          <div className="relative">
            <MapPin size={16} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gold" />
            <select
              className={`${worldInputCls} appearance-none pl-10`}
              value={draft.country}
              onChange={(e) => setDraft((d) => ({ ...d, country: e.target.value }))}
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
            Ville <span className="text-gold">*</span>
          </label>
          <input
            className={worldInputCls}
            value={draft.city}
            onChange={(e) => setDraft((d) => ({ ...d, city: e.target.value }))}
            placeholder="Ex. : Montréal"
            maxLength={40}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
            Langues que tu parles
          </label>
          <Pressable
            onClick={() => setLangOpen((o) => !o)}
            className={`${worldInputCls} flex items-center justify-between text-left`}
          >
            <span className={draft.languages.length ? "text-foreground" : "text-muted-foreground/70"}>
              {draft.languages.length ? draft.languages.join(", ") : "Sélectionner"}
            </span>
            <span className="text-gold">{langOpen ? "▴" : "▾"}</span>
          </Pressable>

          {langOpen && (
            <div className="mt-2 overflow-hidden rounded-2xl border border-gold/20 bg-white/[0.03]">
              {LANGUAGES.map((l) => {
                const on = draft.languages.includes(l);
                return (
                  <Pressable
                    key={l}
                    onClick={() => toggleLang(l)}
                    className="flex w-full items-center justify-between border-b border-white/5 px-4 py-3 text-left last:border-b-0"
                  >
                    <span className="text-[13px] text-foreground">{l}</span>
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                        on ? "border-transparent bg-gold-gradient" : "border-white/20"
                      }`}
                    >
                      {on && <Check size={13} className="text-[oklch(0.16_0.02_60)]" />}
                    </span>
                  </Pressable>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </WorldStep>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Pressable } from "@/components/zembo/ui";
import {
  EMPTY_WORLD_PROFILE,
  loadWorldProfile,
  saveWorldProfile,
  type WorldProfileDraft,
} from "@/lib/world-profile";

export const Route = createFileRoute("/world/onboarding/1")({
  head: () => ({
    meta: [
      { title: "Crée ton profil World Room — Zembo" },
      {
        name: "description",
        content:
          "Étape 1/6 : pseudo, âge, bio et tes 3 réponses World Card pour ton profil de découverte.",
      },
      { property: "og:title", content: "Crée ton profil World Room — Zembo" },
      {
        property: "og:description",
        content: "Voici ce que les autres verront de toi dans World Room.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorldOnboarding1,
});

const CARD_FIELDS = [
  {
    key: "sunday" as const,
    lead: "Mon dimanche parfait :",
    placeholder: "plage + musique",
  },
  {
    key: "redFlag" as const,
    lead: "Mon plus gros red flag :",
    placeholder: "le mensonge",
  },
  {
    key: "travel" as const,
    lead: "Si je pouvais partir demain :",
    placeholder: "Zanzibar",
  },
];

function WorldOnboarding1() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState<WorldProfileDraft>(EMPTY_WORLD_PROFILE);

  useEffect(() => {
    setDraft(loadWorldProfile());
  }, []);

  const set = (key: keyof WorldProfileDraft, value: string) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const ageNum = Number(draft.age);
  const valid =
    draft.pseudo.trim().length >= 2 &&
    Number.isFinite(ageNum) &&
    ageNum >= 18 &&
    ageNum <= 99;

  const submit = () => {
    if (!valid) return;
    saveWorldProfile(draft);
    navigate({ to: "/world/onboarding/2" });
  };

  const inputCls =
    "w-full rounded-2xl border border-gold/20 bg-white/[0.04] px-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground/70 outline-none focus:border-gold/50";

  return (
    <div className="app-scroll no-scrollbar min-h-[100dvh] bg-[oklch(0.06_0.01_50)] px-5 pb-10 pt-[max(env(safe-area-inset-top),14px)]">
      <div className="flex items-center gap-2">
        <Pressable
          onClick={() => navigate({ to: "/world/intro" })}
          aria-label="Retour"
          className="-ml-1 rounded-full p-1"
        >
          <ArrowLeft size={22} className="text-gold" />
        </Pressable>
        <span className="text-[12px] font-semibold tracking-wide text-muted-foreground">
          ÉTAPE 1/6
        </span>
      </div>

      <div className="mt-3 flex gap-1.5">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full ${i === 0 ? "bg-gold-gradient" : "bg-white/10"}`}
          />
        ))}
      </div>

      <h1 className="mt-5 text-[22px] font-extrabold leading-tight text-foreground">
        Crée ton profil World Room
      </h1>
      <p className="mt-1.5 text-[13px] text-muted-foreground">
        Voici ce que les autres verront de toi.
      </p>

      <div className="mt-6 flex flex-col gap-5">
        <div>
          <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
            Pseudo <span className="text-gold">*</span>
          </label>
          <input
            className={inputCls}
            value={draft.pseudo}
            onChange={(e) => set("pseudo", e.target.value)}
            placeholder="Ex. : Deena"
            maxLength={24}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
            Âge <span className="text-gold">*</span>
          </label>
          <input
            className={inputCls}
            value={draft.age}
            onChange={(e) => set("age", e.target.value.replace(/\D/g, "").slice(0, 2))}
            inputMode="numeric"
            placeholder="34"
          />
          <p className="mt-1.5 text-[11.5px] text-muted-foreground">
            Ton âge sera visible, façon « 34 ». (18–99)
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-[12.5px] font-semibold text-foreground">
            Bio courte <span className="text-muted-foreground">(facultative)</span>
          </label>
          <textarea
            className={`${inputCls} min-h-[84px] resize-none`}
            value={draft.bio}
            onChange={(e) => set("bio", e.target.value.slice(0, 120))}
            placeholder="En quelques mots, qui es-tu ?"
          />
          <p className="mt-1 text-right text-[11px] text-muted-foreground">
            {draft.bio.length}/120
          </p>
        </div>

        <div className="rounded-3xl border border-gold/25 bg-gold/[0.05] p-4">
          <p className="text-[13px] font-bold text-gold">Ta World Card</p>
          <p className="mt-1 text-[11.5px] leading-relaxed text-muted-foreground">
            Ces 3 petites phrases apparaîtront sur ta carte de découverte.
          </p>
          <div className="mt-4 flex flex-col gap-4">
            {CARD_FIELDS.map((f) => (
              <div key={f.key}>
                <p className="mb-1.5 text-[12.5px] font-semibold text-foreground">
                  {f.lead}
                </p>
                <input
                  className={inputCls}
                  value={draft[f.key]}
                  onChange={(e) => set(f.key, e.target.value.slice(0, 60))}
                  placeholder={f.placeholder}
                />
              </div>
            ))}
          </div>
        </div>

        <Pressable
          onClick={submit}
          disabled={!valid}
          className={`flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-bold ${
            valid
              ? "glow-gold bg-gold-gradient text-[oklch(0.16_0.02_60)]"
              : "border border-gold/20 bg-white/[0.04] text-muted-foreground"
          }`}
        >
          Continuer <span className="text-[17px] leading-none">›</span>
        </Pressable>
      </div>
    </div>
  );
}

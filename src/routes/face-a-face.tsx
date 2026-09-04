import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowLeft, Gift, Mars, Venus, VenetianMask } from "lucide-react";
import { Pressable } from "@/components/zembo/ui";

export const Route = createFileRoute("/face-a-face")({
  head: () => ({
    meta: [
      { title: "Face à Face — Trouve ton adversaire | Zembo" },
      {
        name: "description",
        content:
          "Choisis tes critères et lance un Face à Face : 20 questions, une compatibilité révélée en direct.",
      },
      { property: "og:title", content: "Face à Face — Trouve ton adversaire | Zembo" },
      {
        property: "og:description",
        content: "Homme, femme ou LGBT, âge, distance et langue : lance ta recherche de joueur.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FaceAFaceLobby,
});

const GOLD = "oklch(0.85 0.14 86)";

const TARGETS = [
  { id: "Homme", icon: Mars, tint: "oklch(0.66 0.19 250)" },
  { id: "Femme", icon: Venus, tint: "oklch(0.68 0.22 350)" },
  { id: "LGBT", icon: VenetianMask, tint: "oklch(0.7 0.19 300)" },
];

const AGES = ["18-25", "26-35", "36-45", "46+"];
const DISTANCES = ["10 km", "50 km", "100 km", "Partout"];
const LANGS = ["Français", "English"];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="text-[13px] font-extrabold tracking-[0.14em] text-gold uppercase">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Pill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Pressable
      onClick={onClick}
      aria-pressed={active}
      className="rounded-full border px-4 py-2 text-[13px] font-bold transition-colors"
      style={{
        borderColor: active ? GOLD : "oklch(0.28 0.01 60)",
        background: active ? "oklch(0.85 0.14 86 / 12%)" : "oklch(0.08 0.005 280)",
        color: active ? GOLD : "oklch(0.82 0 0)",
      }}
    >
      {label}
    </Pressable>
  );
}

function FaceAFaceLobby() {
  const navigate = useNavigate();
  const [target, setTarget] = useState("Femme");
  const [age, setAge] = useState("26-35");
  const [distance, setDistance] = useState("50 km");
  const [lang, setLang] = useState("Français");
  const [searching, setSearching] = useState(false);

  const criteria = `${target} · ${age} · ${distance} · ${lang}`;

  useEffect(() => {
    if (!searching) return;
    const t = setTimeout(() => navigate({ to: "/play/face-a-face" }), 2500);
    return () => clearTimeout(t);
  }, [searching, navigate]);

  return (
    <div className="relative min-h-full overflow-x-hidden bg-[oklch(0.03_0_0)] pb-10">
      <header className="flex items-start gap-2 px-4 pt-[max(env(safe-area-inset-top),14px)]">
        <Pressable onClick={() => navigate({ to: "/play" })} aria-label="Retour" className="mt-1">
          <ArrowLeft size={24} className="text-gold" />
        </Pressable>
        <div className="flex-1 text-center">
          <p className="text-[19px] leading-none tracking-[0.1em]">
            <span style={{ color: "oklch(0.66 0.19 250)" }}>◕</span>
            <span className="text-gold">⚡</span>
            <span style={{ color: "oklch(0.68 0.22 350)" }}>◕</span>
          </p>
          <h1 className="mt-1.5 text-[27px] leading-none font-extrabold tracking-tight">
            FACE <span className="text-gold-gradient">À FACE</span>
          </h1>
          <p className="mt-2 text-[13px] text-muted-foreground">
            Teste ta compatibilité en temps réel
          </p>
        </div>
        <span className="mt-1 w-6" />
      </header>

      <div className="px-4">
        <Section title="Qui veux-tu affronter ?">
          <div className="grid grid-cols-3 gap-2.5">
            {TARGETS.map((t) => {
              const active = target === t.id;
              const Icon = t.icon;
              return (
                <Pressable
                  key={t.id}
                  onClick={() => setTarget(t.id)}
                  aria-pressed={active}
                  className="flex flex-col items-center gap-2 rounded-2xl border py-4 transition-colors"
                  style={{
                    borderColor: active ? GOLD : "oklch(0.24 0.01 60)",
                    background: active ? "oklch(0.85 0.14 86 / 10%)" : "oklch(0.07 0.005 280)",
                    boxShadow: active ? "0 0 22px -8px oklch(0.85 0.14 86 / 80%)" : undefined,
                  }}
                >
                  <Icon size={26} style={{ color: t.tint }} />
                  <span
                    className="text-[13px] font-extrabold"
                    style={{ color: active ? GOLD : "oklch(0.85 0 0)" }}
                  >
                    {t.id}
                  </span>
                </Pressable>
              );
            })}
          </div>
        </Section>

        <Section title="Tranche d'âge">
          <div className="flex flex-wrap gap-2">
            {AGES.map((a) => (
              <Pill key={a} label={a} active={age === a} onClick={() => setAge(a)} />
            ))}
          </div>
        </Section>

        <Section title="Distance">
          <div className="flex flex-wrap gap-2">
            {DISTANCES.map((d) => (
              <Pill key={d} label={d} active={distance === d} onClick={() => setDistance(d)} />
            ))}
          </div>
        </Section>

        <Section title="Langue">
          <div className="flex gap-2 rounded-full border border-border bg-[oklch(0.07_0.005_280)] p-1">
            {LANGS.map((l) => {
              const active = lang === l;
              return (
                <Pressable
                  key={l}
                  onClick={() => setLang(l)}
                  aria-pressed={active}
                  className="relative flex-1 rounded-full py-2 text-[13px] font-bold"
                  style={{ color: active ? "oklch(0.16 0.02 60)" : "oklch(0.75 0 0)" }}
                >
                  {active && (
                    <motion.span
                      layoutId="ff-lang"
                      className="absolute inset-0 rounded-full bg-gold-gradient"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{l}</span>
                </Pressable>
              );
            })}
          </div>
        </Section>

        <div className="mt-6 flex items-center justify-center gap-2 rounded-full border border-emerald/30 bg-emerald/10 px-3 py-2">
          <Gift size={14} className="text-emerald" />
          <span className="text-[11.5px] font-semibold text-emerald">
            Gratuit — aucun Zem ni Ticket requis
          </span>
        </div>

        <Pressable
          onClick={() => {
            navigator.vibrate?.(15);
            setSearching(true);
          }}
          className="mt-4 w-full rounded-full bg-gold-gradient py-3.5 text-[15px] font-extrabold text-[oklch(0.16_0.02_60)]"
        >
          Rechercher un joueur
        </Pressable>
      </div>

      <AnimatePresence>
        {searching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[oklch(0.02_0_0)] px-6"
          >
            <div className="relative flex h-56 w-56 items-center justify-center">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="absolute rounded-full border"
                  style={{ borderColor: "oklch(0.85 0.14 86 / 45%)", inset: 0 }}
                  animate={{ scale: [0.45, 1], opacity: [0.75, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.7, ease: "easeOut" }}
                />
              ))}
              <div className="relative h-24 w-24 overflow-hidden rounded-full border border-gold/50">
                <div className="h-full w-full bg-gradient-to-br from-[oklch(0.6_0.14_300)] to-[oklch(0.35_0.1_250)] blur-[10px]" />
              </div>
            </div>
            <p className="mt-6 text-[17px] font-extrabold text-gold">Recherche d'un joueur…</p>
            <p className="mt-2 text-[13px] text-muted-foreground">{criteria}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

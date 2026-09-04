import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ArrowLeft, Plane, Settings2, Sparkles, TriangleAlert, Sunrise } from "lucide-react";
import { toast } from "sonner";
import { BottomSheet } from "@/components/zembo/Sheet";
import { Chip, Pressable } from "@/components/zembo/ui";
import { photoUrl } from "@/components/zembo/PhotoAvatar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/world/discover")({
  head: () => ({
    meta: [
      { title: "Découverte World Room — Zembo" },
      {
        name: "description",
        content:
          "Voyage de profil en profil à travers le monde : World Cards, réponses de personnalité et Hello.",
      },
      { property: "og:title", content: "Découverte World Room — Zembo" },
      {
        property: "og:description",
        content: "Le monde est à un Hello. Découvre une personne à la fois.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorldDiscover,
});

type WorldCard = {
  id: string;
  name: string;
  age: number;
  flag: string;
  city: string;
  country: string;
  intent: string;
  sunday: string;
  redFlag: string;
  travel: string;
};

const POOL: WorldCard[] = [
  {
    id: "moussa",
    name: "Moussa",
    age: 34,
    flag: "🇨🇮",
    city: "Abidjan",
    country: "Côte d'Ivoire",
    intent: "Amitié",
    sunday: "Plage + musique jusqu'au coucher du soleil",
    redFlag: "Le mensonge, même petit",
    travel: "Zanzibar, sans hésiter",
  },
  {
    id: "chloe",
    name: "Chloé",
    age: 28,
    flag: "🇫🇷",
    city: "Paris",
    country: "France",
    intent: "Discussion",
    sunday: "Brunch tardif et marché aux livres",
    redFlag: "Ceux qui n'écoutent jamais",
    travel: "Un train de nuit vers Lisbonne",
  },
  {
    id: "awa",
    name: "Awa",
    age: 26,
    flag: "🇸🇳",
    city: "Dakar",
    country: "Sénégal",
    intent: "Rencontre",
    sunday: "Thiéboudienne en famille puis Corniche",
    redFlag: "Le manque de respect envers sa mère",
    travel: "Bali, pour apprendre à surfer",
  },
  {
    id: "david",
    name: "David",
    age: 31,
    flag: "🇨🇦",
    city: "Montréal",
    country: "Canada",
    intent: "Amitié",
    sunday: "Café, vinyles et longue marche au Mont-Royal",
    redFlag: "Zéro curiosité pour les autres",
    travel: "Le Japon en automne",
  },
  {
    id: "lina",
    name: "Lina",
    age: 29,
    flag: "🇲🇦",
    city: "Casablanca",
    country: "Maroc",
    intent: "Discussion",
    sunday: "Pâtisseries, terrasse et longs débats",
    redFlag: "Les gens qui parlent mal aux serveurs",
    travel: "Un road trip en Namibie",
  },
];

const ENTER_FROM = [-1, 1, -1, 1, -1];

function AnswerPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2 rounded-2xl border border-gold/20 bg-black/45 px-3 py-2 backdrop-blur-md">
      <span className="mt-0.5 shrink-0 text-gold">{icon}</span>
      <p className="min-w-0 text-[12px] leading-snug text-white/90">
        <span className="text-gold/85">{label} : </span>
        {value}
      </p>
    </div>
  );
}

function WorldDiscover() {
  const [index, setIndex] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [gender, setGender] = useState("Tous");
  const [zone, setZone] = useState("Monde entier");
  const [lang, setLang] = useState("FR");
  const [intent, setIntent] = useState("Peu importe");
  const [ageRange, setAgeRange] = useState("25–35");

  const card = useMemo(() => POOL[index % POOL.length]!, [index]);
  const dir = ENTER_FROM[index % ENTER_FROM.length]!;

  const next = () => setIndex((i) => i + 1);

  const tap = () => {
    if (typeof navigator !== "undefined") navigator.vibrate?.(8);
  };

  return (
    <div className="relative h-full overflow-hidden bg-[oklch(0.06_0.01_50)]">
      {/* Fond : carte du monde sombre + points lumineux */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          background:
            "radial-gradient(110% 60% at 50% 8%, oklch(0.2 0.05 75 / 60%), transparent 65%), radial-gradient(90% 50% at 50% 100%, oklch(0.4 0.06 60 / 20%), transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            "radial-gradient(oklch(0.82 0.13 85 / 55%) 1px, transparent 1.4px)",
          backgroundSize: "18px 18px",
          maskImage:
            "radial-gradient(80% 55% at 50% 45%, black 30%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(80% 55% at 50% 45%, black 30%, transparent 78%)",
        }}
      />

      {/* En-tête */}
      <header className="relative z-20 flex items-start justify-between px-4 pt-4">
        <div className="min-w-0">
          <h1 className="text-gold-gradient text-[17px] font-black tracking-[0.18em]">
            🌍 WORLD ROOM
          </h1>
          <p className="mt-0.5 text-[11px] text-white/55">Le monde est à un Hello.</p>
        </div>
        <Pressable
          onClick={() => {
            tap();
            setFiltersOpen(true);
          }}
          aria-label="Filtres"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/35 bg-black/45 text-gold"
        >
          <Settings2 size={18} />
        </Pressable>
      </header>

      {/* World Card */}
      <div className="relative z-10 px-4 pt-3">
        <div className="relative h-[calc(100dvh-300px)] min-h-[380px]">
          <AnimatePresence mode="wait">
            <motion.article
              key={card.id + index}
              initial={{ opacity: 0, x: dir * 90, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: dir * -110, scale: 0.94 }}
              transition={{ duration: 0.42, ease: [0.32, 0.72, 0, 1] }}
              className="absolute inset-0 overflow-hidden rounded-[28px] border border-gold/25 bg-surface shadow-[0_24px_60px_-24px_oklch(0.82_0.13_85/35%)]"
            >
              <img
                src={photoUrl(card.id, 640)}
                alt={`${card.name}, ${card.city}`}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/40" />

              {/* Haut de carte */}
              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white/90 backdrop-blur-md">
                  <span>{card.flag}</span>
                  {card.country} · {card.city}
                </span>
                <span className="rounded-full bg-gold-gradient px-2.5 py-1 text-[10px] font-bold tracking-wide text-[oklch(0.16_0.02_60)]">
                  {card.intent}
                </span>
              </div>

              {/* Bas de carte */}
              <div className="absolute inset-x-0 bottom-0 space-y-2 p-3.5">
                <div>
                  <h2 className="text-[26px] leading-tight font-black text-white">
                    {card.name}, {card.age}
                  </h2>
                  <p className="text-[12px] text-white/60">
                    {card.flag} {card.country}
                  </p>
                </div>
                <AnswerPill
                  icon={<Sunrise size={14} />}
                  label="Mon dimanche parfait"
                  value={card.sunday}
                />
                <AnswerPill
                  icon={<TriangleAlert size={14} />}
                  label="Mon plus gros red flag"
                  value={card.redFlag}
                />
                <AnswerPill
                  icon={<Plane size={14} />}
                  label="Si je pouvais partir demain"
                  value={card.travel}
                />
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>

      {/* Actions */}
      <div className="relative z-20 flex items-stretch gap-2 px-4 pt-4">
        <Pressable
          onClick={() => {
            tap();
            next();
          }}
          className="flex flex-1 items-center justify-center gap-1 rounded-2xl border border-border bg-surface/80 px-2 py-3 text-[12px] font-bold text-white/75"
        >
          <ArrowLeft size={15} />
          PASSER
        </Pressable>
        <Pressable
          onClick={() => {
            tap();
            toast.success(`👋 Hello envoyé à ${card.name}`);
            next();
          }}
          className="bg-gold-gradient flex flex-[1.4] items-center justify-center gap-1.5 rounded-2xl px-2 py-3 text-[13px] font-black text-[oklch(0.16_0.02_60)]"
        >
          👋 DIRE HELLO
        </Pressable>
        <Pressable
          onClick={() => {
            tap();
            toast("✨ Demande de connexion envoyée");
            next();
          }}
          className="flex flex-1 items-center justify-center gap-1 rounded-2xl border border-gold/45 bg-black/45 px-2 py-3 text-[12px] font-bold text-gold"
        >
          <Sparkles size={15} />
          CONNECTER
        </Pressable>
      </div>

      <BottomSheet open={filtersOpen} onClose={() => setFiltersOpen(false)}>
        <div className="space-y-4 px-4 pb-2">
          <h3 className="text-[15px] font-bold text-white">Filtres de découverte</h3>
          {[
            {
              label: "Qui veux-tu rencontrer ?",
              opts: ["Tous", "Hommes", "Femmes", "LGBT+"],
              value: gender,
              set: setGender,
            },
            {
              label: "Tranche d'âge",
              opts: ["18–24", "25–35", "36–45", "46+"],
              value: ageRange,
              set: setAgeRange,
            },
            {
              label: "Zone",
              opts: ["Monde entier", "Mon pays", "Afrique", "Europe", "Amériques"],
              value: zone,
              set: setZone,
            },
            { label: "Langue", opts: ["FR", "EN"], value: lang, set: setLang },
            {
              label: "Intention",
              opts: ["Peu importe", "Amitié", "Discussion", "Rencontre"],
              value: intent,
              set: setIntent,
            },
          ].map((g) => (
            <div key={g.label} className="space-y-2">
              <p className="text-[12px] font-semibold text-white/60">{g.label}</p>
              <div className="flex flex-wrap gap-2">
                {g.opts.map((o) => (
                  <Chip key={o} active={g.value === o} onClick={() => g.set(o)}>
                    {o}
                  </Chip>
                ))}
              </div>
            </div>
          ))}
          <Pressable
            onClick={() => {
              setFiltersOpen(false);
              toast.success("Filtres appliqués");
            }}
            className={cn(
              "bg-gold-gradient w-full rounded-2xl py-3 text-[14px] font-black text-[oklch(0.16_0.02_60)]",
            )}
          >
            Appliquer
          </Pressable>
        </div>
      </BottomSheet>
    </div>
  );
}

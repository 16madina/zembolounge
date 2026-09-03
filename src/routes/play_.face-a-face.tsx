import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  BarChart3,
  ChevronLeft,
  Info,
  Lock,
  MoreVertical,
  Send,
  Star,
  Target,
  Timer,
  Video,
} from "lucide-react";
import { NeonFacesIcon } from "@/components/zembo/GameIcons";
import { photoUrl } from "@/components/zembo/PhotoAvatar";
import { Pressable } from "@/components/zembo/ui";
import { ZemboIcon } from "@/components/zembo/ZemboMark";
import { IMG } from "@/lib/zembo-data";

export const Route = createFileRoute("/play_/face-a-face")({
  head: () => ({
    meta: [
      { title: "Face à Face — Zembo" },
      {
        name: "description",
        content:
          "Face à Face : affronte un autre joueur sur les mêmes questions et découvre votre compatibilité en temps réel.",
      },
      { property: "og:title", content: "Face à Face — Zembo" },
      {
        property: "og:description",
        content: "Mêmes questions, réponses secrètes, compatibilité révélée en direct.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FaceAFace,
});

const CHOICES = [
  { k: "A", label: "La confiance" },
  { k: "B", label: "La communication" },
  { k: "C", label: "La stabilité financière" },
  { k: "D", label: "La passion" },
];

const BLUE = "oklch(0.66 0.19 250)";
const PINK = "oklch(0.68 0.22 350)";

function PlayerPanel({
  role,
  name,
  color,
  glow,
}: {
  role: string;
  name: string;
  color: string;
  glow: string;
}) {
  return (
    <div className="relative min-w-0 flex-1 overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="absolute inset-x-0 -top-6 h-16 blur-2xl" style={{ background: glow }} />
      <p
        className="relative pt-1.5 text-center text-[9.5px] font-extrabold tracking-[0.16em]"
        style={{ color }}
      >
        {role}
      </p>
      <div className="relative mt-1.5">
        <img
          src={photoUrl(name, 300)}
          alt={name}
          loading="lazy"
          className="h-[132px] w-full object-cover"
        />
        <span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-emerald">
          <Video size={10} /> ON
        </span>
        <span className="absolute bottom-1.5 left-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white">
          {name}
        </span>
      </div>
      <p className="relative py-1.5 text-center text-[10px] font-bold text-gold">❤️ 10 POINTS</p>
    </div>
  );
}

function FaceAFace() {
  const navigate = useNavigate();

  return (
    <div className="pb-6">
      {/* Barre haute */}
      <div className="flex items-center gap-2 px-4 pt-[max(env(safe-area-inset-top),12px)]">
        <Pressable
          onClick={() => navigate({ to: "/play" })}
          className="flex items-center gap-0.5 text-[12.5px] font-semibold text-gold"
        >
          <ChevronLeft size={18} /> Quitter
        </Pressable>
        <span className="ml-auto flex items-center gap-1.5 rounded-full border border-gold/55 px-2.5 py-1 text-[10.5px] font-bold text-gold">
          <Info size={12} /> Règles
        </span>
        <Pressable aria-label="Plus">
          <MoreVertical size={17} className="text-foreground/70" />
        </Pressable>
      </div>

      <div className="mt-2 flex flex-col items-center">
        <NeonFacesIcon size={54} />
        <h1 className="mt-1 text-[24px] leading-none font-extrabold tracking-tight">
          FACE <span className="text-gold-gradient">À FACE</span>
        </h1>
        <p className="mt-1.5 text-[12.5px] text-muted-foreground">
          Testez votre compatibilité en temps réel !
        </p>
      </div>

      {/* Deux panneaux vidéo */}
      <div
        className="mx-4 mt-3 flex gap-2 rounded-3xl p-2"
        style={{
          background: `linear-gradient(120deg, color-mix(in oklab, ${BLUE} 22%, transparent), color-mix(in oklab, ${PINK} 22%, transparent))`,
        }}
      >
        <PlayerPanel
          role="VOUS"
          name="Deena"
          color={BLUE}
          glow="radial-gradient(circle, oklch(0.62 0.24 300 / 45%), transparent 70%)"
        />
        <PlayerPanel
          role="ADVERSAIRE"
          name="Moussa"
          color={PINK}
          glow="radial-gradient(circle, oklch(0.66 0.19 250 / 45%), transparent 70%)"
        />
      </div>

      {/* Barre compatibilité */}
      <div className="mx-4 mt-3 flex items-center gap-3 rounded-2xl border border-border bg-[oklch(0.11_0.008_60)] p-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold tracking-wide text-foreground/70">
            ❤️ COMPATIBILITÉ ACTUELLE
          </p>
          <p className="text-[17px] font-extrabold text-gold">–– %</p>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/55">
          <ZemboIcon size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-right text-[10px] font-bold tracking-wide text-foreground/70">
            OBJECTIF MATCH : 85%+
          </p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-[oklch(0.2_0.014_70)]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "85%" }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="h-full rounded-full bg-gold-gradient"
              />
            </div>
            <Star size={11} className="shrink-0 text-gold" />
            <span className="shrink-0 text-[10.5px] font-bold text-gold">85%</span>
          </div>
        </div>
      </div>

      {/* Scène table */}
      <div className="relative mx-4 mt-3 overflow-hidden rounded-2xl border border-border">
        <img
          src={IMG.table}
          alt="Table Zembo avec deux tasses"
          width={768}
          height={512}
          className="h-[120px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-[oklch(0.09_0.008_60)]/35" />
      </div>

      {/* Carte question */}
      <div
        className="mx-4 mt-3 rounded-3xl border border-gold/45 bg-[oklch(0.115_0.01_60)] p-4"
        style={{ boxShadow: "0 12px 34px -20px oklch(0.82 0.13 85 / 60%)" }}
      >
        <p className="text-[22px] leading-none text-gold">“</p>
        <h2 className="mt-1 text-center text-[15.5px] leading-snug font-bold">
          Dans une relation, qu'est-ce qui compte le plus pour toi ?
        </h2>
        <div className="mt-3 space-y-2">
          {CHOICES.map((c) => (
            <Pressable
              key={c.k}
              className="flex w-full items-center gap-3 rounded-2xl border border-gold/40 bg-[oklch(0.13_0.012_65)] px-3 py-2.5 text-left"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-gradient text-[12px] font-extrabold text-[oklch(0.16_0.02_60)]">
                {c.k}
              </span>
              <span className="text-[14px] font-semibold">{c.label}</span>
            </Pressable>
          ))}
        </div>
      </div>

      {/* Réponses + chrono */}
      <div className="mx-4 mt-3 grid grid-cols-2 gap-2">
        <div
          className="rounded-2xl border p-3 text-center"
          style={{ borderColor: `color-mix(in oklab, ${BLUE} 55%, transparent)` }}
        >
          <p className="text-[10px] font-bold tracking-wide" style={{ color: BLUE }}>
            VOTRE RÉPONSE
          </p>
          <Lock size={15} className="mx-auto mt-1.5 text-foreground/70" />
          <p className="mt-1 text-[11.5px] text-muted-foreground">En attente…</p>
        </div>
        <div
          className="rounded-2xl border p-3 text-center"
          style={{ borderColor: `color-mix(in oklab, ${PINK} 55%, transparent)` }}
        >
          <p className="text-[10px] font-bold tracking-wide" style={{ color: PINK }}>
            RÉPONSE ADVERSAIRE
          </p>
          <Lock size={15} className="mx-auto mt-1.5 text-foreground/70" />
          <p className="mt-1 text-[11.5px] text-muted-foreground">En attente…</p>
        </div>
      </div>
      <div className="mt-2 flex justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold/70 text-[13px] font-extrabold text-gold">
          15 S
        </span>
      </div>

      {/* Stats */}
      <div className="mx-4 mt-3 grid grid-cols-3 gap-2">
        {[
          { icon: <BarChart3 size={14} className="text-gold" />, t: "COMPATIBILITÉ ACTUELLE", v: "–– %" },
          { icon: <Target size={14} className="text-gold" />, t: "OBJECTIF MATCH", v: "85%+ pour un match" },
          { icon: <Timer size={14} className="text-gold" />, t: "TEMPS RESTANT", v: "18:25 min" },
        ].map((s) => (
          <div key={s.t} className="rounded-2xl border border-border bg-[oklch(0.11_0.008_60)] p-2.5">
            {s.icon}
            <p className="mt-1.5 text-[8.5px] leading-tight font-bold tracking-wide text-muted-foreground">
              {s.t}
            </p>
            <p className="mt-1 text-[11px] leading-tight font-bold">{s.v}</p>
          </div>
        ))}
      </div>

      {/* Chat */}
      <div className="mx-4 mt-3 rounded-2xl border border-border bg-[oklch(0.11_0.008_60)] p-3">
        <div className="flex items-start gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold/55">
            <ZemboIcon size={14} />
          </span>
          <p className="min-w-0 flex-1 text-[12.5px]">
            <span className="font-semibold text-gold">Zembo</span>{" "}
            <span className="rounded-full border border-gold/50 px-1.5 py-[1px] text-[8.5px] font-bold text-gold">
              BOT
            </span>{" "}
            <span className="text-foreground/85">Répondez sincèrement et bonne chance !</span>
          </p>
          <span className="shrink-0 text-[10.5px] text-muted-foreground">21:30</span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <input
            placeholder="Écrire un message…"
            className="min-w-0 flex-1 rounded-full border border-border bg-surface-2/60 px-3.5 py-2.5 text-[13px] outline-none placeholder:text-muted-foreground"
          />
          <Pressable
            aria-label="Envoyer"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-gradient"
          >
            <Send size={16} className="text-[oklch(0.16_0.02_60)]" />
          </Pressable>
        </div>
      </div>
    </div>
  );
}

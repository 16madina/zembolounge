import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ChevronLeft, Info, Lock, MoreVertical, Send, Smile, Video } from "lucide-react";
import { photoUrl } from "@/components/zembo/PhotoAvatar";
import { Pressable } from "@/components/zembo/ui";
import { ZemboIcon } from "@/components/zembo/ZemboMark";

export const Route = createFileRoute("/play_/face-a-face")({
  head: () => ({
    meta: [
      { title: "Face à Face — Zembo" },
      {
        name: "description",
        content:
          "Face à Face : affronte un autre joueur sur 20 questions et découvre votre compatibilité en temps réel.",
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

function PlayerCard({
  role,
  name,
  color,
  border,
}: {
  role: string;
  name: string;
  color: string;
  border: string;
}) {
  return (
    <div
      className="relative flex-1 overflow-hidden rounded-2xl border"
      style={{ borderColor: border }}
    >
      <img
        src={photoUrl(name, 300)}
        alt={name}
        loading="lazy"
        className="h-[168px] w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />
      <div className="absolute left-2.5 top-2">
        <p className="text-[11px] font-extrabold tracking-wide" style={{ color }}>
          {role}
        </p>
        <p className="text-[12.5px] text-white/85">{name}</p>
      </div>
      <span className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[9.5px] font-bold text-emerald">
        <Video size={10} /> ON
      </span>
      <div className="absolute bottom-2 left-2.5">
        <p className="text-[16px] font-extrabold text-white">❤️ 10</p>
        <p className="text-[9.5px] tracking-wide text-white/70">POINTS</p>
      </div>
    </div>
  );
}

function FaceAFace() {
  const navigate = useNavigate();

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-[max(env(safe-area-inset-top),12px)]">
        <Pressable
          onClick={() => navigate({ to: "/play" })}
          className="flex items-center gap-1 text-[13px] font-semibold text-gold"
        >
          <ChevronLeft size={20} /> Quitter
        </Pressable>
        <Pressable className="ml-auto flex items-center gap-1.5 rounded-full border border-gold/60 px-2.5 py-1.5 text-[11px] font-semibold text-gold">
          <Info size={12} /> Règles
        </Pressable>
        <Pressable aria-label="Plus" className="flex h-8 w-8 items-center justify-center rounded-full border border-border">
          <MoreVertical size={16} className="text-foreground/70" />
        </Pressable>
      </div>

      <div className="mt-2 text-center">
        <p className="text-[16px]">🔵 ⚡ 🔴</p>
        <h1 className="mt-1 text-[30px] leading-none font-extrabold tracking-tight">
          FACE <span className="text-gold-gradient">À FACE</span>
        </h1>
        <p className="mt-1.5 text-[12.5px] text-muted-foreground">
          Testez votre compatibilité en temps réel !
        </p>
      </div>

      {/* Duel */}
      <div className="relative mx-4 mt-4">
        <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-full border border-gold/70 bg-background px-3 py-1 text-[10.5px] font-bold text-gold">
          QUESTION 1 / 20
        </span>
        <div className="flex gap-2">
          <PlayerCard
            role="VOUS"
            name="Deena"
            color="oklch(0.72 0.16 245)"
            border="oklch(0.6 0.16 245 / 60%)"
          />
          <PlayerCard
            role="ADVERSAIRE"
            name="Moussa"
            color="oklch(0.72 0.2 340)"
            border="oklch(0.6 0.2 340 / 60%)"
          />
        </div>
      </div>

      {/* Compatibilité */}
      <div className="mx-4 mt-2.5 flex items-center gap-2.5 rounded-2xl border border-border bg-[oklch(0.11_0.008_60)] px-3 py-2.5">
        <span className="text-[16px]">💞</span>
        <div>
          <p className="text-[9.5px] tracking-wide text-muted-foreground">COMPATIBILITÉ ACTUELLE</p>
          <p className="text-[14px] font-extrabold">– – %</p>
        </div>
        <span className="mx-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/60">
          <ZemboIcon size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[9.5px] tracking-wide text-muted-foreground">OBJECTIF MATCH : 85%+</p>
          <div className="mt-1 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[oklch(0.25_0.01_60)]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "85%" }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="h-full rounded-full bg-gold-gradient"
              />
            </div>
            <span className="text-[11.5px] font-bold">85%</span>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="relative mx-4 mt-4 rounded-3xl border border-gold/50 bg-[oklch(0.1_0.008_60)] p-3.5">
        <span className="absolute -top-3.5 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border border-gold/60 bg-background text-[13px] text-gold">
          ❝
        </span>
        <h2 className="mt-1 text-center text-[16px] leading-snug font-bold">
          Dans une relation, qu'est-ce qui compte le plus pour toi ?
        </h2>
        <div className="mt-3 space-y-2">
          {CHOICES.map((c) => (
            <Pressable
              key={c.k}
              className="flex w-full items-center gap-2.5 rounded-2xl border border-gold/25 bg-surface-2/50 px-3 py-2.5 text-left"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gold/70 text-[11px] font-bold text-gold">
                {c.k}
              </span>
              <span className="text-[13.5px] font-medium">{c.label}</span>
            </Pressable>
          ))}
        </div>
      </div>

      {/* Réponses + chrono */}
      <div className="mx-4 mt-3 flex items-center gap-2">
        <div className="flex-1 rounded-2xl border border-[oklch(0.6_0.16_245_/_50%)] bg-[oklch(0.11_0.01_245)] p-2.5 text-center">
          <p className="text-[10px] font-bold tracking-wide text-[oklch(0.72_0.16_245)]">
            VOTRE RÉPONSE
          </p>
          <p className="mt-1 flex items-center justify-center gap-1 text-[11.5px] text-foreground/80">
            <Lock size={11} /> En attente…
          </p>
        </div>
        <div className="flex h-[68px] w-[68px] shrink-0 flex-col items-center justify-center rounded-full border-[3px] border-gold/80">
          <p className="text-[22px] leading-none font-extrabold">15</p>
          <p className="text-[9px] text-muted-foreground">s</p>
        </div>
        <div className="flex-1 rounded-2xl border border-[oklch(0.6_0.2_340_/_50%)] bg-[oklch(0.11_0.01_340)] p-2.5 text-center">
          <p className="text-[10px] font-bold tracking-wide text-[oklch(0.72_0.2_340)]">
            RÉPONSE ADVERSAIRE
          </p>
          <p className="mt-1 flex items-center justify-center gap-1 text-[11.5px] text-foreground/80">
            <Lock size={11} /> En attente…
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-4 mt-3 grid grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-[oklch(0.11_0.008_60)] py-3">
        {[
          { e: "📊", t: "COMPATIBILITÉ ACTUELLE", v: "– – %", s: "" },
          { e: "🎯", t: "OBJECTIF MATCH", v: "85%+", s: "pour un match" },
          { e: "⏱️", t: "TEMPS RESTANT", v: "18:25", s: "min" },
        ].map((c) => (
          <div key={c.t} className="px-2 text-center">
            <p className="text-[15px]">{c.e}</p>
            <p className="mt-1 text-[9px] leading-tight tracking-wide text-muted-foreground">{c.t}</p>
            <p className="mt-0.5 text-[13px] font-extrabold">{c.v}</p>
            {c.s && <p className="text-[9.5px] text-muted-foreground">{c.s}</p>}
          </div>
        ))}
      </div>

      {/* Bot + saisie */}
      <div className="mx-4 mt-3 flex items-start gap-2.5 rounded-2xl border border-border bg-[oklch(0.11_0.008_60)] p-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/50 bg-black">
          <ZemboIcon size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-[12.5px] font-bold">
            Zembo
            <span className="rounded-md bg-violet/25 px-1.5 py-0.5 text-[9px] font-bold text-violet">
              BOT
            </span>
            <span className="ml-auto text-[10.5px] font-normal text-muted-foreground">21:30</span>
          </p>
          <p className="mt-0.5 text-[12px] text-foreground/85">
            Répondez sincèrement et bonne chance !
          </p>
        </div>
      </div>

      <div className="mx-4 mt-2.5 flex items-center gap-2">
        <Smile size={20} className="shrink-0 text-muted-foreground" />
        <input
          placeholder="Écrire un message…"
          className="min-w-0 flex-1 rounded-full border border-border bg-surface-2/60 px-3.5 py-2.5 text-[13px] outline-none placeholder:text-muted-foreground"
        />
        <Pressable
          aria-label="Envoyer"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/60"
        >
          <Send size={16} className="text-gold" />
        </Pressable>
      </div>
    </div>
  );
}

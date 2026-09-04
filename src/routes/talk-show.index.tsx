import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Award,
  Bell,
  BookOpen,
  ChevronRight,
  Feather,
  Mic,
  MicVocal,
  MessageCircle,
  Shield,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { Pressable } from "@/components/zembo/ui";
import { ZemboIcon, ZemboWordmark } from "@/components/zembo/ZemboMark";

export const Route = createFileRoute("/talk-show/")({
  head: () => ({
    meta: [
      { title: "Talk Show — Choisis ton format — Zembo" },
      {
        name: "description",
        content:
          "Storytelling, Open Mic, Stand, Slam : choisis ton format de Talk Show Zembo et monte sur scène.",
      },
      { property: "og:title", content: "Talk Show — Choisis ton format — Zembo" },
      {
        property: "og:description",
        content: "Exprime-toi, inspire, échange. Choisis ton format de Talk Show en direct.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TalkShowSelector,
});

const VIOLET = "oklch(0.62 0.24 300)";
const GREEN = "oklch(0.68 0.16 158)";
const AMBER = "oklch(0.82 0.13 85)";
const MAGENTA = "oklch(0.6 0.22 350)";

type Format = {
  id: string;
  title: string;
  accent: string;
  accroche: string;
  desc: string;
  pill?: string;
  format: "storytime" | "open-mic" | "stand" | "slam";
  icon: ReactNode;
};

const FORMATS: Format[] = [
  {
    id: "storytime",
    title: "Storytime",
    accent: VIOLET,
    accroche: "Raconte ton histoire.",
    desc: "Partage une expérience, un moment marquant ou une histoire qui t'a construit.",
    format: "storytime",
    icon: (
      <span className="relative">
        <BookOpen size={46} className="text-gold" strokeWidth={1.7} />
        <Feather size={15} className="absolute -bottom-1 -right-1 text-gold-deep" />
      </span>
    ),
  },
  {
    id: "open-mic",
    title: "Micro Ouvert",
    accent: GREEN,
    accroche: "Anime. Partage. Échange.",
    desc: "Masterclass, concept, coachings, discussions en direct avec ta communauté.",
    pill: "👥 Pose des questions & interagis en direct",
    format: "open-mic",
    icon: <MicVocal size={46} className="text-gold" strokeWidth={1.7} />,
  },
  {
    id: "stand",
    title: "Stand-Up",
    accent: AMBER,
    accroche: "Le micro t'appartient.",
    desc: "Monte sur scène, parle de ce que tu veux : idées, opinions, talents, débats et plus encore.",
    format: "stand",
    icon: (
      <span className="relative">
        <Users size={46} className="text-gold" strokeWidth={1.7} />
        <MessageCircle size={15} className="absolute -bottom-1 -right-1 text-gold-deep" fill="currentColor" />
      </span>
    ),
  },
  {
    id: "slam",
    title: "Slam Thérapie",
    accent: MAGENTA,
    accroche: "Tes mots. Ta voix. Ta scène.",
    desc: "Déclame ton slam, ta poésie ou ton texte et fais vibrer la communauté.",
    format: "slam",
    icon: <Mic size={46} className="text-gold" strokeWidth={1.7} />,
  },
];

function TalkShowSelector() {
  const navigate = useNavigate();

  return (
    <div className="app-scroll no-scrollbar pb-[112px]">
      {/* En-tête */}
      <header className="sticky top-0 z-20 flex items-center justify-between gap-2 border-b border-border/50 bg-background/85 px-4 pt-[max(env(safe-area-inset-top),12px)] pb-3 backdrop-blur-xl">
        <Pressable onClick={() => navigate({ to: "/" })} aria-label="Retour" className="-ml-1">
          <ArrowLeft size={24} className="text-gold" />
        </Pressable>
        <div className="flex items-center gap-2">
          <ZemboIcon size={22} />
          <ZemboWordmark className="text-[15px]" />
        </div>
        <Pressable
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface/60"
        >
          <Bell size={17} className="text-foreground/70" />
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-live px-1 text-[9px] font-bold text-white">
            7
          </span>
        </Pressable>
      </header>

      {/* Titre + sous-titre */}
      <section className="flex items-center gap-3 px-4 pt-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-gold/55 bg-gold/8">
          <Mic size={20} className="text-gold" />
        </span>
        <div className="min-w-0">
          <h1 className="text-[30px] leading-none font-extrabold tracking-tight text-foreground">
            TALK SHOW
          </h1>
          <p className="mt-1.5 text-[12.5px] font-medium text-gold">
            Exprime-toi. Inspire. Écoute. Échange.
          </p>
        </div>
      </section>

      {/* Séparateur */}
      <div className="mt-5 flex items-center gap-3 px-4">
        <span className="h-px flex-1 bg-border/60" />
        <span className="text-[10px] font-bold tracking-[0.18em] text-gold">
          ✦ CHOISIS TON FORMAT ✦
        </span>
        <span className="h-px flex-1 bg-border/60" />
      </div>

      {/* Cartes format */}
      <div className="mt-4 space-y-3 px-4">
        {FORMATS.map((f) => (
          <Pressable
            key={f.id}
            onClick={() =>
              navigate({ to: "/talk-show/config/$format", params: { format: f.format } })
            }
            className="card-surface flex items-center gap-3 rounded-[20px] p-3"
            style={{ borderColor: `color-mix(in oklab, ${f.accent} 40%, transparent)` }}
          >
            {/* Vignette illustrée */}
            <span
              className="relative flex h-[108px] w-[108px] shrink-0 items-center justify-center overflow-hidden rounded-[16px]"
              style={{
                background: `linear-gradient(150deg, color-mix(in oklab, ${f.accent} 28%, oklch(0.12 0 0)), oklch(0.1 0 0))`,
              }}
            >
              <span
                className="absolute inset-0 opacity-70 blur-xl"
                style={{
                  background: `radial-gradient(circle at 50% 42%, color-mix(in oklab, ${f.accent} 55%, transparent), transparent 70%)`,
                }}
              />
              <span className="relative drop-shadow-[0_4px_12px_oklch(0.82_0.13_85_/_35%)]">
                {f.icon}
              </span>
            </span>

            {/* Contenu */}
            <div className="min-w-0 flex-1">
              <h2 className="text-[14px] font-extrabold tracking-[0.07em] text-foreground uppercase">
                {f.title}
              </h2>
              <p className="mt-1 text-[12.5px] font-semibold" style={{ color: f.accent }}>
                {f.accroche}
              </p>
              <p className="mt-1 line-clamp-2 text-[11.5px] leading-snug text-muted-foreground">
                {f.desc}
              </p>
              {f.pill && (
                <span
                  className="mt-2 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold"
                  style={{
                    color: f.accent,
                    background: `color-mix(in oklab, ${f.accent} 14%, transparent)`,
                    borderColor: `color-mix(in oklab, ${f.accent} 45%, transparent)`,
                  }}
                >
                  {f.pill}
                </span>
              )}
            </div>

            {/* Bouton › */}
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/55">
              <ChevronRight size={17} className="text-gold" />
            </span>
          </Pressable>
        ))}
      </div>

      {/* Bannière basse */}
      <div className="mx-4 mt-4 flex items-center gap-3 rounded-[16px] border border-border bg-[oklch(0.115_0.008_60)] p-3.5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/12">
          <Award size={20} className="text-gold" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold text-foreground">
            Sois respectueux et bienveillant.
          </p>
          <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
            Zembo est un espace d'expression libre et positive.
          </p>
        </div>
        <Shield size={18} className="shrink-0 text-gold" />
      </div>
    </div>
  );
}

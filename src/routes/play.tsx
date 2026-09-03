import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, HelpCircle, Users } from "lucide-react";
import { Pressable } from "@/components/zembo/ui";

export const Route = createFileRoute("/play")({
  head: () => ({
    meta: [
      { title: "Play & Fun — Zembo" },
      {
        name: "description",
        content:
          "Choisis ton jeu Zembo : Zembo Quiz, Hot Seat, Face à Face ou Tu préfères ? et lance la partie avec ta communauté.",
      },
      { property: "og:title", content: "Play & Fun — Zembo" },
      {
        property: "og:description",
        content: "Quiz, chaise chaude, face à face : lance une partie en direct avec ta communauté.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlayHub,
});

type Game = {
  id: string;
  title: string;
  emoji: string;
  desc: string;
  players: string;
  tag: string;
  accent: string;
  to: "/play/quiz" | "/play/hot-seat" | "/play/face-a-face" | null;
};

const GAMES: Game[] = [
  {
    id: "quiz",
    title: "ZEMBO QUIZ",
    emoji: "🧠",
    desc: "Culture générale, sport, musique, histoire et plus. Réponds, reste en jeu et sois le dernier survivant !",
    players: "4 - 10 joueurs",
    tag: "🏆 COMPÉTITION",
    accent: "oklch(0.82 0.13 85)",
    to: "/play/quiz",
  },
  {
    id: "hot",
    title: "HOT SEAT",
    emoji: "🪑",
    desc: "Un joueur sur la chaise chaude ! Réponds aux questions des autres avant la fin du chrono.",
    players: "4 - 10 joueurs",
    tag: "✦ INTERACTIF",
    accent: "oklch(0.65 0.24 5)",
    to: "/play/hot-seat",
  },
  {
    id: "face",
    title: "FACE À FACE",
    emoji: "⚡",
    desc: "Affronte un autre joueur dans un match de compatibilité. Réponds aux mêmes questions et découvre si vous êtes faits l'un pour l'autre !",
    players: "2 joueurs",
    tag: "👥 SOCIAL",
    accent: "oklch(0.66 0.19 250)",
    to: "/play/face-a-face",
  },
  {
    id: "prefer",
    title: "TU PRÉFÈRES ?",
    emoji: "💬",
    desc: "Deux choix, un seul toi. Vote, défends ton choix et découvre celui des autres !",
    players: "4 - 10 joueurs",
    tag: "◎ DISCUSSION",
    accent: "oklch(0.7 0.18 150)",
    to: null,
  },
];

function PlayHub() {
  const navigate = useNavigate();

  return (
    <div className="pb-4">
      <div className="flex items-start px-4 pt-[max(env(safe-area-inset-top),14px)]">
        <Pressable onClick={() => navigate({ to: "/" })} aria-label="Retour" className="mt-1">
          <ArrowLeft size={24} className="text-gold" />
        </Pressable>
        <div className="flex-1 text-center">
          <p className="text-[22px] leading-none">🎉</p>
          <h1 className="mt-1.5 text-[30px] leading-none font-extrabold tracking-tight">
            PLAY <span className="text-gold-gradient">&amp; FUN</span>
          </h1>
          <p className="mt-2 text-[13.5px] text-muted-foreground">
            Choisis ton jeu et lance la partie !
          </p>
        </div>
        <Pressable
          aria-label="Aide"
          className="mt-1 flex h-8 w-8 items-center justify-center rounded-full border border-gold/60"
        >
          <HelpCircle size={17} className="text-gold" />
        </Pressable>
      </div>

      {/* Bandeau trophée */}
      <div className="relative mt-4 h-[104px]">
        <div className="absolute inset-x-6 top-6 h-16 rounded-[100%] bg-gold/18 blur-2xl" />
        <div className="relative flex h-full items-center justify-center gap-3 text-[20px]">
          <span className="opacity-70">🎮</span>
          <span className="opacity-70">💛</span>
          <span className="text-[44px] drop-shadow-[0_6px_20px_oklch(0.82_0.13_85_/_45%)]">🏆</span>
          <span className="opacity-70">⭐</span>
          <span className="opacity-70">🎲</span>
        </div>
      </div>

      {/* Cartes de jeux */}
      <div className="grid grid-cols-2 gap-3 px-4">
        {GAMES.map((g) => (
          <Pressable
            key={g.id}
            onClick={() => g.to && navigate({ to: g.to })}
            className="relative overflow-hidden rounded-3xl border p-3 text-center"
            style={{
              borderColor: `color-mix(in oklab, ${g.accent} 55%, transparent)`,
              background: `linear-gradient(170deg, color-mix(in oklab, ${g.accent} 10%, oklch(0.1 0.008 60)), oklch(0.085 0.006 60))`,
            }}
          >
            <span
              className="absolute right-2 top-2 rounded-full border px-2 py-[3px] text-[8.5px] font-bold tracking-wide"
              style={{
                color: g.accent,
                borderColor: `color-mix(in oklab, ${g.accent} 55%, transparent)`,
              }}
            >
              {g.tag}
            </span>
            <div className="mt-7 flex justify-center">
              <span
                className="flex h-[76px] w-[76px] items-center justify-center rounded-full text-[38px]"
                style={{
                  background: `radial-gradient(circle, color-mix(in oklab, ${g.accent} 30%, transparent), transparent 70%)`,
                }}
              >
                {g.emoji}
              </span>
            </div>
            <h2 className="mt-2 text-[15px] font-extrabold tracking-tight">{g.title}</h2>
            <p className="mt-1.5 text-[11px] leading-snug text-foreground/70">{g.desc}</p>
            <p
              className="mt-2.5 flex items-center justify-center gap-1.5 text-[12px] font-semibold"
              style={{ color: g.accent }}
            >
              <Users size={13} /> {g.players}
            </p>
          </Pressable>
        ))}
      </div>

      {/* Bientôt */}
      <div className="mx-4 mt-3 flex items-center gap-3 rounded-3xl border border-border bg-[oklch(0.115_0.008_60)] p-3.5">
        <span className="text-[28px]">🎲</span>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-bold">D'autres jeux arrivent bientôt…</p>
          <p className="mt-0.5 text-[11.5px] leading-snug text-muted-foreground">
            Reste connecté, l'expérience ne fait que commencer !
          </p>
        </div>
        <Pressable className="flex shrink-0 items-center gap-1 rounded-full border border-gold/60 px-2.5 py-1.5 text-[10px] font-bold tracking-wide text-gold">
          NOUVEAUTÉS <ChevronRight size={13} />
        </Pressable>
      </div>
    </div>
  );
}

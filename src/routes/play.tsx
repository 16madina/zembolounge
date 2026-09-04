import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, Dices, HelpCircle, Users } from "lucide-react";
import type { ReactNode } from "react";
import { BrainZIcon, BubblesIcon, ThroneIcon, TrophyZIcon, VersusIcon } from "@/components/zembo/GameIcons";
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
  icon: ReactNode;
  desc: string;
  players: string;
  badge: string;
  accent: string;
  to: "/play/quiz" | "/play/hot-seat" | "/face-a-face" | null;
};

const GOLD = "oklch(0.82 0.13 85)";
const PINK = "oklch(0.68 0.22 350)";
const BLUE = "oklch(0.66 0.19 250)";
const GREEN = "oklch(0.78 0.19 155)";

const GAMES: Game[] = [
  {
    id: "quiz",
    title: "ZEMBO QUIZ",
    icon: <BrainZIcon size={62} />,
    desc: "Culture générale, sport, musique, histoire et plus. Réponds, reste en jeu et sois le dernier survivant !",
    players: "4 - 10 joueurs",
    badge: "🏆 COMPÉTITION",
    accent: GOLD,
    to: "/play/quiz",
  },
  {
    id: "hot",
    title: "HOT SEAT",
    icon: <ThroneIcon size={62} color={PINK} />,
    desc: "Un joueur sur la chaise chaude ! Réponds aux questions des autres avant la fin du chrono.",
    players: "4 - 10 joueurs",
    badge: "INTERACTIF",
    accent: PINK,
    to: "/play/hot-seat",
  },
  {
    id: "face",
    title: "FACE À FACE",
    icon: <VersusIcon size={62} />,
    desc: "Affronte un autre joueur dans un match de compatibilité. Réponds aux mêmes questions et découvre si vous êtes faits l'un pour l'autre !",
    players: "2 joueurs",
    badge: "SOCIAL",
    accent: BLUE,
    to: "/face-a-face",
  },
  {
    id: "prefer",
    title: "TU PRÉFÈRES ?",
    icon: <BubblesIcon size={62} color={GREEN} />,
    desc: "Deux choix, un seul toi. Vote, défends ton choix et découvre celui des autres !",
    players: "4 - 10 joueurs",
    badge: "DISCUSSION",
    accent: GREEN,
    to: null,
  },
];

function PlayHub() {
  const navigate = useNavigate();

  return (
    <div className="pb-[110px]">
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

      {/* Bandeau décoratif : arc lumineux + trophée Z + icônes flottantes */}
      <div className="relative mt-3 h-[132px] overflow-hidden">
        <div className="absolute inset-x-4 top-10 h-[120px] rounded-[100%] border-t border-gold/35 bg-gold/8 blur-[1px]" />
        <div className="absolute inset-x-10 top-12 h-16 rounded-[100%] bg-gold/15 blur-2xl" />
        <span className="absolute left-6 top-8 text-[17px] opacity-60">🎮</span>
        <span className="absolute left-16 bottom-6 text-[15px] opacity-50">❤️</span>
        <span className="absolute right-16 bottom-7 text-[15px] opacity-50">⭐</span>
        <span className="absolute right-6 top-9 text-[17px] opacity-60">🎲</span>
        <div className="relative flex h-full items-center justify-center">
          <span className="drop-shadow-[0_10px_28px_oklch(0.82_0.13_85_/_40%)]">
            <TrophyZIcon size={104} />
          </span>
        </div>
      </div>

      {/* Grille 2x2 */}
      <div className="grid grid-cols-2 gap-3 px-4">
        {GAMES.map((g) => (
          <Pressable
            key={g.id}
            onClick={() => g.to && navigate({ to: g.to })}
            className="relative flex flex-col items-center overflow-hidden rounded-[22px] border bg-surface px-3 pt-9 pb-3.5 text-center"
            style={{
              borderColor: `color-mix(in oklab, ${g.accent} 50%, transparent)`,
              boxShadow: `0 10px 30px -18px color-mix(in oklab, ${g.accent} 60%, transparent)`,
            }}
          >
            <span
              className="absolute right-2 top-2 rounded-full border px-2 py-[3px] text-[8.5px] font-bold tracking-wide"
              style={{
                color: g.accent,
                borderColor: `color-mix(in oklab, ${g.accent} 55%, transparent)`,
              }}
            >
              {g.badge}
            </span>
            <span
              className="flex h-[78px] w-[78px] items-center justify-center rounded-full"
              style={{
                background: `radial-gradient(circle, color-mix(in oklab, ${g.accent} 20%, transparent), transparent 70%)`,
              }}
            >
              {g.icon}
            </span>
            <h2 className="mt-2 text-[15px] font-extrabold tracking-tight">{g.title}</h2>
            <p className="mt-1.5 text-[12px] leading-snug text-foreground/70">{g.desc}</p>
            <p
              className="mt-auto flex items-center justify-center gap-1.5 pt-2.5 text-[12px] font-semibold"
              style={{ color: g.accent }}
            >
              <Users size={13} /> {g.players}
            </p>
          </Pressable>
        ))}
      </div>

      {/* Bannière basse */}
      <div className="mx-4 mt-3 flex items-center gap-3 rounded-[20px] border border-border bg-[oklch(0.115_0.008_60)] p-3.5">
        <Dices size={26} className="shrink-0 text-gold" />
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

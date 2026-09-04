import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  BadgeCheck,
  ChevronRight,
  Clock,
  Dices,
  Eye,
  FastForward,
  Flame,
  Crown,
  Flower2,
  Gem,
  Star,
  Gift,
  Globe,
  Heart,
  Laugh,
  Mic,
  MicOff,
  PartyPopper,
  Send,
  Shield,
  Smile,
  SkipForward,
  Sparkles,
  Users,
  Vote,
} from "lucide-react";
import stage from "@/assets/zembo-table-stage.png";
import { PhotoAvatar, photoUrl } from "@/components/zembo/PhotoAvatar";
import { BottomSheet } from "@/components/zembo/Sheet";
import { Pressable } from "@/components/zembo/ui";

export const Route = createFileRoute("/table/$id")({
  head: () => ({
    meta: [
      { title: "Zembo Table — discussion à 6 places" },
      {
        name: "description",
        content:
          "Zembo Table : 6 joueurs autour d'une table à questions, dé, tour de parole, vote et file d'attente des spectateurs.",
      },
      { property: "og:title", content: "Zembo Table — discussion à 6 places" },
      {
        property: "og:description",
        content: "Cartes à questions, tour de parole chronométré, vote de la table et montée des spectateurs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TableRoom,
});

/** Sièges dessinés sur le décor — coordonnées en % du conteneur de l'image */
const SEAT_SPOTS = [
  { n: 1, av: [50, 33], mic: [58.3, 36.6], dots: [55.4, 41.5] },
  { n: 2, av: [79, 40.8], mic: [86.9, 45.3], dots: [83.8, 49.2] },
  { n: 3, av: [85, 75.6], mic: [90.5, 80], dots: [88.6, 84.5] },
  { n: 4, av: [50.1, 86.8], mic: [58.5, 90.7], dots: [55.3, 95.7] },
  { n: 5, av: [15.1, 75.6], mic: [22.8, 80], dots: [20, 84.5] },
  { n: 6, av: [15.1, 46.6], mic: [22.6, 52.3], dots: [20, 57.4] },
] as const;

type Seat = {
  n: number;
  name: string | null;
  label: string;
  you?: boolean;
  host?: boolean;
};

const SEATS0: Seat[] = [
  { n: 1, name: "Deena", label: "Deena (Toi)", you: true },
  { n: 2, name: "Sarah", label: "Sarah — ★ HÔTE", host: true },
  { n: 3, name: "Leïla", label: "Leïla" },
  { n: 4, name: "Yann", label: "Yann" },
  { n: 5, name: "Aïcha", label: "Aïcha" },
  { n: 6, name: "Marc", label: "Marc" },
];

const QUESTIONS = [
  "Peut-on réellement pardonner une infidélité et retrouver la même confiance ?",
  "L'argent a-t-il déjà changé une de tes relations ?",
  "Peut-on aimer sans confiance ?",
  "Quel est le pardon le plus difficile que tu aies accordé ?",
];

const QUEUE0 = ["Moussa", "Karim", "Emma"];

const CHAT0 = [
  { id: 1, name: "Ben", time: "21:33", text: "Intéressant ça Deena ! Hâte d'entendre ta réponse" },
  { id: 2, name: "Emma", time: "21:34", text: "Moi je ne pardonne pas l'infidélité." },
  { id: 3, name: "Kader", time: "21:35", text: "On a tous nos limites, et c'est OK." },
  { id: 4, name: "Nadia", time: "21:36", text: "L'argent change beaucoup de choses malheureusement." },
];

const REACTIONS = [
  { key: "heart", Icon: Heart, count: 12, tint: "oklch(0.65 0.2 20)" },
  { key: "flame", Icon: Flame, count: 8, tint: "oklch(0.75 0.17 55)" },
  { key: "clap", Icon: PartyPopper, count: 15, tint: "oklch(0.86 0.14 88)" },
  { key: "laugh", Icon: Laugh, count: 6, tint: "oklch(0.8 0.15 100)" },
  { key: "hundred", Icon: BadgeCheck, count: 5, tint: "oklch(0.7 0.16 150)" },
];

const SPECTATORS_23 = [
  "Ben", "Emma", "Kader", "Nadia", "Ibrahim", "Awa", "Fatou", "Moussa", "Karim", "Inès",
  "Salif", "Chloé", "Yasmine", "Diallo", "Mamadou", "Céline", "Ousmane", "Lina", "Bakary",
  "Amina", "Théo", "Rokia", "Samir",
];

const TABS = [
  { id: "chat", label: "Chat" },
  { id: "spectators", label: `Spectateurs (${SPECTATORS_23.length})` },
  { id: "queue", label: "En attente" },
] as const;

const EMOJIS = ["😊", "😂", "🔥", "❤️", "👏", "😮", "🙏", "💯", "👀", "🎉", "😍", "🤔"];

const GIFTS = [
  { name: "Rose", cost: 5, Icon: Flower2 },
  { name: "Cœur", cost: 10, Icon: Heart },
  { name: "Étoile", cost: 25, Icon: Star },
  { name: "Flamme", cost: 50, Icon: Flame },
  { name: "Couronne", cost: 99, Icon: Crown },
  { name: "Diamant", cost: 199, Icon: Gem },
];

const DICE_DOTS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [
    [30, 30],
    [70, 70],
  ],
  3: [
    [28, 28],
    [50, 50],
    [72, 72],
  ],
  4: [
    [30, 30],
    [70, 30],
    [30, 70],
    [70, 70],
  ],
  5: [
    [28, 28],
    [72, 28],
    [50, 50],
    [28, 72],
    [72, 72],
  ],
  6: [
    [30, 24],
    [70, 24],
    [30, 50],
    [70, 50],
    [30, 76],
    [70, 76],
  ],
};

type Phase = "roll" | "card" | "answers" | "vote" | "result" | "promote";

const STEPS: { key: Phase | "card"; Icon: typeof Dices; label: string }[] = [
  { key: "roll", Icon: Dices, label: "Dé" },
  { key: "card", Icon: Sparkles, label: "Carte" },
  { key: "answers", Icon: Mic, label: "Parole" },
  { key: "vote", Icon: Vote, label: "Vote" },
  { key: "result", Icon: ArrowDown, label: "Sortie" },
  { key: "promote", Icon: ArrowUp, label: "Montée" },
];

/** % de vote mock, attribués par rang aléatoire aux invités */
const VOTE_SHARES = [31, 24, 18, 14, 4];

function TableRoom() {
  const navigate = useNavigate();

  const [seats, setSeats] = useState<Seat[]>(SEATS0);
  const [queue, setQueue] = useState(QUEUE0);
  const [phase, setPhase] = useState<Phase>("roll");
  const [roller, setRoller] = useState(0); // index dans seats
  const [answerIdx, setAnswerIdx] = useState(0); // position dans l'ordre de parole
  const [seconds, setSeconds] = useState(45);
  const [voteSeconds, setVoteSeconds] = useState(15);
  const [spectatorView, setSpectatorView] = useState(false);
  const [myVote, setMyVote] = useState<number | null>(null);
  const [votes, setVotes] = useState<Record<number, number>>({});
  const [leaving, setLeaving] = useState<string | null>(null);

  const [mutedManual, setMutedManual] = useState<Record<number, boolean>>({});
  const [seatMenu, setSeatMenu] = useState<number | null>(null);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [cardOut, setCardOut] = useState(false);
  const [flip, setFlip] = useState(false);
  const [dice, setDice] = useState(4);
  const [rolling, setRolling] = useState(false);
  const [chat, setChat] = useState(CHAT0);
  const [draft, setDraft] = useState("");
  const [reactions, setReactions] = useState(REACTIONS.map((r) => r.count));
  const [floats, setFloats] = useState<{ id: number; i: number; x: number }[]>([]);
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("chat");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  /** ordre de parole : à partir du lanceur, puis sièges suivants (occupés) */
  const speakOrder = useMemo(() => {
    const order: number[] = [];
    for (let k = 0; k < seats.length; k++) {
      const i = (roller + k) % seats.length;
      if (seats[i]!.name) order.push(i);
    }
    return order;
  }, [seats, roller]);

  const activeIdx =
    phase === "answers" ? (speakOrder[answerIdx] ?? roller) : roller;
  const activeSeat = seats[activeIdx] ?? seats[0]!;
  const guests = seats.filter((s) => s.name && !s.host);

  const nextAnswer = useCallback(() => {
    setAnswerIdx((i) => {
      if (i + 1 >= speakOrder.length) {
        setPhase("vote");
        setVoteSeconds(15);
        setVotes({});
        setMyVote(null);
        return i;
      }
      setSeconds(45);
      return i + 1;
    });
  }, [speakOrder.length]);

  /** chrono de parole */
  useEffect(() => {
    if (phase !== "answers") return;
    const t = setTimeout(() => {
      if (seconds <= 1) nextAnswer();
      else setSeconds((s) => s - 1);
    }, 1000);
    return () => clearTimeout(t);
  }, [phase, seconds, nextAnswer]);

  /** chrono de vote + barres qui montent */
  useEffect(() => {
    if (phase !== "vote") return;
    const t = setTimeout(() => {
      if (voteSeconds <= 1) {
        const shares = guests.map((g, i) => [g.n, VOTE_SHARES[i] ?? 5] as const);
        setVotes(Object.fromEntries(shares));
        setPhase("result");
        const last = shares.reduce((a, b) => (b[1] < a[1] ? b : a));
        const seat = seats.find((s) => s.n === last[0]);
        setLeaving(seat?.name ?? null);
        return;
      }
      setVoteSeconds((s) => s - 1);
      setVotes((v) => {
        const next: Record<number, number> = { ...v };
        guests.forEach((g, i) => {
          const target = VOTE_SHARES[i] ?? 5;
          next[g.n] = Math.min(target, (v[g.n] ?? 0) + Math.ceil(target / 14));
        });
        return next;
      });
    }, 1000);
    return () => clearTimeout(t);
  }, [phase, voteSeconds, guests, seats]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [chat]);

  const mmss = `00:${String(seconds).padStart(2, "0")}`;

  const isMuted = (s: Seat) => {
    if (!s.name) return false;
    if (mutedManual[s.n]) return true;
    if (phase !== "answers") return true;
    return s.n !== activeSeat.n;
  };

  const roll = () => {
    if (rolling || phase !== "roll") return;
    navigator.vibrate?.(20);
    setRolling(true);
    setTimeout(() => {
      const face = 1 + Math.floor(Math.random() * 6);
      setDice(face);
      setRolling(false);
      setPhase("card");
      setCardOut(true);
      setFlip(true);
      setTimeout(() => {
        setQIndex((face - 1) % QUESTIONS.length);
        setFlip(false);
      }, 260);
      setTimeout(() => {
        setPhase("answers");
        setAnswerIdx(0);
        setSeconds(45);
      }, 1500);
    }, 800);
  };

  const skipToVote = () => {
    navigator.vibrate?.(10);
    setPhase("vote");
    setVoteSeconds(15);
    setVotes({});
    setMyVote(null);
  };

  const promote = (name: string) => {
    navigator.vibrate?.(15);
    setSeats((ss) => {
      const free = ss.findIndex((s) => !s.name);
      if (free < 0) return ss;
      const copy = [...ss];
      copy[free] = { n: copy[free]!.n, name, label: name };
      return copy;
    });
    setQueue((q) => q.filter((x) => x !== name));
    setTimeout(() => {
      setRoller((r) => (r + 1) % SEAT_SPOTS.length);
      setPhase("roll");
      setLeaving(null);
    }, 700);
  };

  const confirmLeave = () => {
    navigator.vibrate?.(15);
    setSeats((ss) => ss.map((s) => (s.name === leaving ? { ...s, name: null, label: "Place libre" } : s)));
    setPhase("promote");
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setChat((c) => [...c, { id: Date.now(), name: "Deena", time: "21:37", text }]);
    setDraft("");
    setEmojiOpen(false);
    setTab("chat");
  };

  const react = (i: number) => {
    navigator.vibrate?.(10);
    setReactions((r) => r.map((v, k) => (k === i ? v + 1 : v)));
    const id = Date.now() + i;
    setFloats((f) => [...f, { id, i, x: -20 + Math.random() * 40 }]);
    setTimeout(() => setFloats((f) => f.filter((x) => x.id !== id)), 1400);
  };

  const occupied = seats.filter((s) => s.name).length;
  const stepIndex = STEPS.findIndex((s) => s.key === phase);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[oklch(0.03_0_0)]">
      {/* ============ DÉCOR + ÉLÉMENTS VIVANTS ============ */}
      <div className="relative w-full shrink-0 select-none">
        <img src={stage} alt="Zembo Table — six joueurs autour de la table à questions" className="block w-full" />

        {/* Quitter la table */}
        <Pressable
          aria-label="Quitter la table"
          onClick={() => navigate({ to: "/live" })}
          className="absolute rounded-full"
          style={{ left: "75.2%", top: "1.9%", width: "16.2%", height: "5.2%" }}
        />
        {/* ⋮ haut droite */}
        <Pressable
          aria-label="Options de la table"
          onClick={() => setMenuOpen(true)}
          className="absolute rounded-full"
          style={{ left: "92.4%", top: "1.9%", width: "5%", height: "5.2%" }}
        />
        {/* Carte Règles / Plus d'infos */}
        <Pressable
          aria-label="Règles de la table"
          onClick={() => setRulesOpen(true)}
          className="absolute rounded-2xl"
          style={{ left: "67.8%", top: "6.2%", width: "29.8%", height: "12.6%" }}
        />

        {/* TOUR DE … + chrono réel */}
        <div
          className="absolute flex flex-col items-center justify-start"
          style={{
            left: "36%",
            top: "10.6%",
            width: "28%",
            height: "15.4%",
            background: "oklch(0.035 0.003 60)",
          }}
        >
          <span className="text-[8px] font-semibold tracking-[0.2em] text-gold/80">
            {phase === "answers" ? "PAROLE À" : "TOUR DE"}
          </span>
          <motion.span
            key={activeSeat.name ?? "libre"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[15px] leading-tight font-extrabold tracking-wide text-gold uppercase"
          >
            {activeSeat.name ?? "—"}
          </motion.span>
          <span className="mt-[2px] rounded-full border border-gold/60 px-2.5 py-[2px] text-[11px] font-bold text-gold tabular-nums">
            {phase === "answers" ? mmss : phase === "vote" ? `00:${String(voteSeconds).padStart(2, "0")}` : "—:—"}
          </span>
        </div>

        {/* Anneau or pulsant sur le joueur actif */}
        <motion.span
          className="pointer-events-none absolute rounded-full"
          animate={{
            left: `${SEAT_SPOTS[activeIdx]!.av[0] - 6.6}%`,
            top: `${SEAT_SPOTS[activeIdx]!.av[1] - 7.3}%`,
            opacity: activeSeat.name ? [0.55, 1, 0.55] : 0,
            scale: [1, 1.05, 1],
          }}
          transition={{
            left: { type: "spring", stiffness: 180, damping: 22 },
            top: { type: "spring", stiffness: 180, damping: 22 },
            opacity: { duration: 1.6, repeat: Infinity },
            scale: { duration: 1.6, repeat: Infinity },
          }}
          style={{
            width: "13.2%",
            aspectRatio: "1 / 1",
            border: "2px solid oklch(0.86 0.14 88)",
            boxShadow: "0 0 18px 2px oklch(0.86 0.14 88 / 55%)",
          }}
        />

        {/* Sièges : zone tappable + micro + ⋮ */}
        {seats.map((s, i) => {
          const spot = SEAT_SPOTS[i]!;
          return (
            <div key={s.n}>
              {!s.name && (
                <span
                  className="pointer-events-none absolute flex items-center justify-center rounded-full text-[8px] font-bold tracking-wide text-gold/80"
                  style={{
                    left: `${spot.av[0] - 6.6}%`,
                    top: `${spot.av[1] - 7.3}%`,
                    width: "13.2%",
                    aspectRatio: "1 / 1",
                    background: "oklch(0.05 0.004 60 / 96%)",
                    border: "1px dashed oklch(0.7 0.12 85 / 60%)",
                  }}
                >
                  PLACE
                  <br />
                  LIBRE
                </span>
              )}
              {s.name && leaving === s.name && phase === "result" && (
                <motion.span
                  className="pointer-events-none absolute rounded-full"
                  animate={{ y: [0, 10, 0], opacity: [1, 0.35, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  style={{
                    left: `${spot.av[0] - 6.6}%`,
                    top: `${spot.av[1] - 7.3}%`,
                    width: "13.2%",
                    aspectRatio: "1 / 1",
                    border: "2px solid oklch(0.7 0.18 25)",
                  }}
                />
              )}
              <Pressable
                aria-label={`Profil de ${s.label}`}
                onClick={() => s.name && setSeatMenu(s.n)}
                className="absolute rounded-full"
                style={{
                  left: `${spot.av[0] - 6.2}%`,
                  top: `${spot.av[1] - 6.9}%`,
                  width: "12.4%",
                  aspectRatio: "1 / 1",
                }}
              />
              <Pressable
                aria-label={`${isMuted(s) ? "Activer" : "Couper"} le micro de ${s.name ?? "la place"}`}
                onClick={() => {
                  if (!s.name) return;
                  navigator.vibrate?.(10);
                  setMutedManual((m) => ({ ...m, [s.n]: !m[s.n] }));
                }}
                className="absolute flex items-center justify-center rounded-full"
                style={{
                  left: `${spot.mic[0] - 3.4}%`,
                  top: `${spot.mic[1] - 3.8}%`,
                  width: "6.8%",
                  aspectRatio: "1 / 1",
                  background: isMuted(s) ? "oklch(0.12 0.02 30 / 94%)" : "transparent",
                }}
              >
                {isMuted(s) && <MicOff size={12} className="text-gold" />}
              </Pressable>
              <Pressable
                aria-label={`Options pour ${s.name ?? "la place"}`}
                onClick={() => s.name && setSeatMenu(s.n)}
                className="absolute rounded-md"
                style={{
                  left: `${spot.dots[0] - 2.4}%`,
                  top: `${spot.dots[1] - 2.7}%`,
                  width: "4.8%",
                  aspectRatio: "1 / 1.1",
                }}
              />
            </div>
          );
        })}

        {/* Paquet de cartes tappable */}
        <Pressable
          aria-label="Paquet Relations"
          onClick={() => setRulesOpen(true)}
          className="absolute rounded-xl"
          style={{ left: "35.2%", top: "48.6%", width: "10%", height: "14.4%" }}
        >
          <motion.span
            animate={cardOut ? { x: [0, 6, 0], rotate: [0, -6, 0] } : {}}
            transition={{ duration: 0.5 }}
            className="block h-full w-full rounded-xl"
          />
        </Pressable>

        {/* Texte de la carte question */}
        <motion.div
          animate={{ rotateY: flip ? 80 : 0, opacity: flip ? 0.25 : 1 }}
          transition={{ duration: 0.24 }}
          className="absolute flex flex-col items-center justify-center gap-[2px] px-1 text-center"
          style={{
            left: "48.2%",
            top: "55.4%",
            width: "19.4%",
            height: "18.6%",
            background: "oklch(0.055 0.004 60)",
          }}
        >
          <span className="text-[6.5px] font-bold tracking-[0.12em] text-gold">RELATIONS</span>
          <span className="text-[7.6px] leading-[1.3] font-medium text-white/90">{QUESTIONS[qIndex]}</span>
        </motion.div>

        {/* Vrai dé tappable */}
        <Pressable
          aria-label="Lancer le dé"
          onClick={roll}
          disabled={phase !== "roll"}
          className="absolute"
          style={{ left: "27.8%", top: "62.2%", width: "9%", aspectRatio: "1 / 1" }}
        >
          <motion.span
            animate={
              rolling
                ? { rotate: [0, -90, 120, -160, 0], scale: [1, 1.12, 0.95, 1.08, 1] }
                : { rotate: 0, scale: phase === "roll" ? [1, 1.06, 1] : 1 }
            }
            transition={
              rolling
                ? { duration: 0.8 }
                : phase === "roll"
                  ? { duration: 1.4, repeat: Infinity }
                  : { duration: 0.22 }
            }
            className="relative block h-full w-full rounded-[22%]"
            style={{
              background: "linear-gradient(150deg, oklch(0.16 0.01 60), oklch(0.07 0.005 60))",
              border: "1px solid oklch(0.7 0.12 85 / 60%)",
              boxShadow: "0 0 14px -2px oklch(0.86 0.14 88 / 45%)",
            }}
          >
            {DICE_DOTS[dice]!.map(([x, y], i) => (
              <span
                key={i}
                className="absolute rounded-full bg-gold"
                style={{ left: `${x}%`, top: `${y}%`, width: "17%", aspectRatio: "1/1", transform: "translate(-50%,-50%)" }}
              />
            ))}
          </motion.span>
        </Pressable>
      </div>

      {/* ============ PANNEAU LIVE ============ */}
      <div className="relative flex min-h-0 flex-1 flex-col bg-[oklch(0.03_0_0)]">
        {/* Onglets */}
        <div className="flex shrink-0 items-stretch gap-0.5 rounded-2xl bg-[oklch(0.07_0.005_60)] p-1 mx-3 mt-2">
          {TABS.map((t) => {
            const active = t.id === tab;
            return (
              <Pressable
                key={t.id}
                onClick={() => setTab(t.id)}
                whileTap={{ scale: 0.96 }}
                className="relative min-w-0 flex-1 rounded-xl px-1 py-1.5"
              >
                {active && (
                  <motion.span
                    layoutId="table-live-tab"
                    className="bg-gold-gradient absolute inset-0 rounded-xl"
                    transition={{ type: "spring", stiffness: 480, damping: 34 }}
                  />
                )}
                <span
                  className={`relative block truncate text-[11px] ${
                    active ? "font-extrabold text-[oklch(0.16_0.02_60)]" : "font-medium text-foreground/75"
                  }`}
                >
                  {t.id === "queue" ? `En attente (${queue.length})` : t.label}
                </span>
              </Pressable>
            );
          })}
        </div>

        {/* Contenu scrollable interne */}
        <div className="app-scroll min-h-0 flex-1 px-3 pt-2">
          {tab === "chat" && (
            <div className="flex flex-col gap-2.5 pb-2">
              {/* BARRE D'ÉTAPES */}
              <div className="flex items-center justify-between rounded-2xl border border-gold/20 bg-[oklch(0.06_0.004_60)] px-2.5 py-2">
                {STEPS.map((s, i) => (
                  <div key={s.key} className="flex items-center gap-1">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                        i === stepIndex
                          ? "border-gold bg-gold-gradient text-[oklch(0.16_0.02_60)]"
                          : i < stepIndex
                            ? "border-gold/50 text-gold"
                            : "border-border text-muted-foreground"
                      }`}
                    >
                      <s.Icon size={12} />
                    </span>
                    {i < STEPS.length - 1 && <span className="h-[1px] w-2 bg-border" />}
                  </div>
                ))}
                <span className="ml-1 flex items-center gap-1 rounded-full border border-gold/30 px-2 py-[2px] text-[11px] font-bold text-gold">
                  <Users size={11} /> {occupied}/6
                </span>
              </div>

              {/* ===== PANNEAU DE JEU ===== */}
              <AnimatePresence mode="wait">
                <motion.section
                  key={phase}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl border border-gold/25 bg-[oklch(0.07_0.005_60)] p-3"
                >
                  {phase === "roll" && (
                    <div className="flex flex-col items-center gap-2 text-center">
                      <p className="text-[11px] font-bold tracking-[0.18em] text-gold/80">
                        TOUR DE {activeSeat.name?.toUpperCase()}
                      </p>
                      <p className="text-[12px] text-muted-foreground">
                        Le dé choisit la carte du deck « Relations ».
                      </p>
                      <Pressable
                        onClick={roll}
                        className="mt-1 flex items-center justify-center gap-2 rounded-full bg-gold-gradient px-5 py-2.5 text-[13.5px] font-extrabold text-[oklch(0.16_0.02_60)]"
                      >
                        <Dices size={16} /> Lancer le dé
                      </Pressable>
                    </div>
                  )}

                  {phase === "card" && (
                    <div className="flex flex-col items-center gap-1.5 text-center">
                      <span className="flex items-center gap-1.5 text-[12px] font-extrabold tracking-[0.16em] text-gold">
                        <Sparkles size={13} /> RELATIONS
                      </span>
                      <p className="text-[13px] leading-snug font-semibold text-foreground/90">{QUESTIONS[qIndex]}</p>
                      <p className="text-[11px] text-muted-foreground">Dé : {dice} — la carte se retourne…</p>
                    </div>
                  )}

                  {phase === "answers" && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex min-w-0 items-center gap-1.5 text-[12.5px] font-bold text-gold">
                          <Mic size={13} className="shrink-0" />
                          <span className="truncate">{activeSeat.name} répond</span>
                        </span>
                        <span className="shrink-0 rounded-full border border-gold/50 px-2.5 py-[2px] text-[12px] font-bold text-gold tabular-nums">
                          {mmss}
                        </span>
                      </div>
                      <div className="h-[3px] overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          className="h-full bg-gold-gradient"
                          animate={{ width: `${(seconds / 45) * 100}%` }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                      <p className="text-[11.5px] text-muted-foreground">
                        Ordre de parole : {speakOrder.map((i) => seats[i]!.name).join(" · ")} ({answerIdx + 1}/
                        {speakOrder.length})
                      </p>
                      <div className="flex items-center gap-2">
                        <Pressable
                          onClick={() => {
                            navigator.vibrate?.(10);
                            nextAnswer();
                          }}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-gold/40 py-2 text-[12.5px] font-bold text-gold"
                        >
                          <SkipForward size={13} /> Passer
                        </Pressable>
                        <Pressable
                          onClick={skipToVote}
                          className="flex items-center justify-center gap-1.5 rounded-full border border-border px-3 py-2 text-[11.5px] font-semibold text-muted-foreground"
                        >
                          <FastForward size={12} /> Accélérer (démo)
                        </Pressable>
                      </div>
                    </div>
                  )}

                  {phase === "vote" && (
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h2 className="text-[12.5px] font-extrabold tracking-[0.1em] text-gold">
                            QUI MÉRITE DE RESTER À LA TABLE ?
                          </h2>
                          <p className="text-[11.5px] text-muted-foreground">
                            Votez pour votre intervention préférée
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full border border-gold/50 px-2.5 py-[2px] text-[12px] font-bold text-gold tabular-nums">
                          00:{String(voteSeconds).padStart(2, "0")}
                        </span>
                      </div>

                      <Pressable
                        onClick={() => setSpectatorView((v) => !v)}
                        className="flex items-center justify-center gap-1.5 self-start rounded-full border border-gold/40 px-3 py-1.5 text-[11.5px] font-bold text-gold"
                      >
                        {spectatorView ? <Eye size={12} /> : <Users size={12} />}
                        {spectatorView ? "Vue spectateur" : "Vue joueur"}
                      </Pressable>

                      <p className="text-[11px] text-muted-foreground">
                        {spectatorView
                          ? "Touche un invité pour voter."
                          : "Tu es à la table : tu ne votes pas, tu regardes les résultats en direct."}
                      </p>

                      <div className="flex flex-col gap-2">
                        {seats
                          .filter((s) => s.name)
                          .map((s) => {
                            const immune = !!s.host;
                            const pct = votes[s.n] ?? 0;
                            const picked = myVote === s.n;
                            return (
                              <Pressable
                                key={s.n}
                                disabled={immune || !spectatorView}
                                onClick={() => {
                                  navigator.vibrate?.(10);
                                  setMyVote(s.n);
                                }}
                                className={`flex w-full items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left ${
                                  picked ? "border-gold bg-gold/10" : "border-border bg-[oklch(0.09_0.004_60)]"
                                }`}
                              >
                                <img
                                  src={photoUrl(s.name!)}
                                  alt=""
                                  className={`h-8 w-8 shrink-0 rounded-full object-cover ${picked ? "ring-2 ring-gold" : ""}`}
                                />
                                <span className="min-w-0 flex-1">
                                  <span className="flex items-center justify-between gap-2">
                                    <span className="truncate text-[12.5px] font-bold text-white">{s.name}</span>
                                    {immune ? (
                                      <span className="flex shrink-0 items-center gap-1 text-[10.5px] font-bold text-gold/80">
                                        <Shield size={11} /> Immunisée
                                      </span>
                                    ) : (
                                      <span className="shrink-0 text-[12px] font-bold text-gold tabular-nums">
                                        {pct}%
                                      </span>
                                    )}
                                  </span>
                                  {!immune && (
                                    <span className="mt-1 block h-[4px] overflow-hidden rounded-full bg-white/10">
                                      <motion.span
                                        className="block h-full bg-gold-gradient"
                                        animate={{ width: `${pct * 2.5}%` }}
                                        transition={{ duration: 0.5 }}
                                      />
                                    </span>
                                  )}
                                </span>
                              </Pressable>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {phase === "result" && (
                    <div className="flex flex-col gap-2.5">
                      <h2 className="text-[12.5px] font-extrabold tracking-[0.12em] text-gold">RÉSULTAT DU VOTE</h2>
                      <div className="flex flex-col gap-1.5">
                        {seats
                          .filter((s) => s.name && !s.host)
                          .slice()
                          .sort((a, b) => (votes[b.n] ?? 0) - (votes[a.n] ?? 0))
                          .map((s, i) => (
                            <div key={s.n} className="flex items-center gap-2">
                              <span className="w-4 text-[11.5px] font-bold text-gold/70">{i + 1}</span>
                              <img src={photoUrl(s.name!)} alt="" className="h-7 w-7 rounded-full object-cover" />
                              <span className="min-w-0 flex-1 truncate text-[12.5px] font-semibold text-white">
                                {s.name}
                              </span>
                              <span className="text-[12px] font-bold text-gold tabular-nums">{votes[s.n] ?? 0}%</span>
                            </div>
                          ))}
                      </div>
                      <div className="rounded-xl border border-[oklch(0.7_0.18_25_/_45%)] bg-[oklch(0.1_0.02_25)] p-2.5">
                        <p className="flex items-center gap-1.5 text-[12.5px] font-extrabold text-[oklch(0.78_0.16_25)]">
                          <ArrowDown size={13} /> {leaving} quitte la table
                        </p>
                        <p className="mt-1 text-[11.5px] text-foreground/75">
                          Elle reste dans le Live et rejoint les spectateurs.
                        </p>
                      </div>
                      <Pressable
                        onClick={confirmLeave}
                        className="flex items-center justify-center gap-1.5 rounded-full bg-gold-gradient py-2.5 text-[13px] font-extrabold text-[oklch(0.16_0.02_60)]"
                      >
                        <ArrowDown size={14} /> Libérer la place
                      </Pressable>
                    </div>
                  )}

                  {phase === "promote" && (
                    <div className="flex flex-col gap-2.5">
                      <h2 className="flex items-center gap-1.5 text-[12.5px] font-extrabold tracking-[0.12em] text-gold">
                        <ArrowUp size={14} /> 1 PLACE DISPONIBLE
                      </h2>
                      <p className="text-[11.5px] text-muted-foreground">
                        File d'attente — l'hôte fait monter un spectateur.
                      </p>
                      {queue.map((name) => (
                        <div
                          key={name}
                          className="flex items-center gap-2.5 rounded-xl border border-border bg-[oklch(0.09_0.004_60)] px-2.5 py-2"
                        >
                          <img src={photoUrl(name)} alt="" className="h-8 w-8 rounded-full object-cover" />
                          <span className="min-w-0 flex-1 truncate text-[12.5px] font-bold text-white">{name}</span>
                          <Pressable
                            onClick={() => promote(name)}
                            className="shrink-0 rounded-full bg-gold-gradient px-3 py-1.5 text-[11.5px] font-extrabold text-[oklch(0.16_0.02_60)]"
                          >
                            Faire monter
                          </Pressable>
                        </div>
                      ))}
                      {queue.length === 0 && <p className="text-[12px] text-muted-foreground">File d'attente vide.</p>}
                    </div>
                  )}
                </motion.section>
              </AnimatePresence>

              {/* MESSAGES */}
              <div className="flex items-center justify-between">
                <h2 className="text-[12px] font-extrabold tracking-[0.16em] text-gold">CHAT</h2>
                <span className="flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[11px] text-foreground/80">
                  <Globe size={12} className="text-gold" /> Tout le monde ▾
                </span>
              </div>
              {chat.map((c) => (
                <div key={c.id} className="flex gap-2">
                  <img src={photoUrl(c.name)} alt="" className="h-7 w-7 shrink-0 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span
                        className={`truncate text-[12.5px] font-bold ${c.name === "Deena" ? "text-gold" : "text-white"}`}
                      >
                        {c.name}
                      </span>
                      <span className="shrink-0 text-[10.5px] text-muted-foreground">{c.time}</span>
                    </div>
                    <p className="text-[12.5px] leading-snug text-foreground/85">{c.text}</p>
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
          )}

          {tab === "spectators" && (
            <div className="pb-2">
              <p className="mb-2 text-[11.5px] text-muted-foreground">
                {SPECTATORS_23.length} personnes regardent la table.
              </p>
              <div className="grid grid-cols-5 gap-x-2 gap-y-3">
                {SPECTATORS_23.map((s) => (
                  <div key={s} className="flex min-w-0 flex-col items-center gap-1">
                    <PhotoAvatar name={s} size={44} />
                    <span className="w-full truncate text-center text-[10.5px] text-foreground/75">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "queue" && (
            <div className="flex flex-col gap-2 pb-2">
              <p className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
                <Clock size={12} className="text-gold" /> Un spectateur monte dès qu'une place se libère.
              </p>
              {queue.map((name) => (
                <div
                  key={name}
                  className="flex items-center gap-2.5 rounded-xl border border-border bg-[oklch(0.07_0.005_60)] px-2.5 py-2"
                >
                  <img src={photoUrl(name)} alt="" className="h-9 w-9 rounded-full object-cover" />
                  <span className="min-w-0 flex-1 truncate text-[12.5px] font-bold text-white">{name}</span>
                  <Pressable
                    onClick={() => promote(name)}
                    whileTap={{ scale: 0.96 }}
                    className="shrink-0 rounded-full bg-gold-gradient px-3 py-1.5 text-[11.5px] font-extrabold text-[oklch(0.16_0.02_60)]"
                  >
                    Faire monter
                  </Pressable>
                </div>
              ))}
              {queue.length === 0 && <p className="text-[12px] text-muted-foreground">File d'attente vide.</p>}
            </div>
          )}
        </div>

        {/* Emojis flottants (par-dessus tout) */}
        <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
          <AnimatePresence>
            {floats.map((f) => {
              const R = REACTIONS[f.i]!;
              return (
                <motion.span
                  key={f.id}
                  initial={{ opacity: 1, y: 0, scale: 0.6 }}
                  animate={{ opacity: 0, y: -220, scale: 1.2, x: f.x }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.4, ease: "easeOut" }}
                  className="absolute right-6 bottom-[92px]"
                >
                  <R.Icon size={22} style={{ color: R.tint }} />
                </motion.span>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Sélecteur d'emojis */}
        <AnimatePresence>
          {emojiOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute right-3 bottom-[142px] left-3 z-20 flex flex-wrap gap-1.5 rounded-2xl border border-gold/25 bg-[oklch(0.08_0.005_60)] p-2.5"
            >
              {EMOJIS.map((e) => (
                <Pressable
                  key={e}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setDraft((d) => d + e)}
                  className="rounded-xl px-2 py-1 text-[19px]"
                >
                  {e}
                </Pressable>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bouton réaction flottant */}
        <div className="pointer-events-none absolute right-3 bottom-[136px] z-20">
          <Pressable
            aria-label="Envoyer une réaction"
            onClick={() => react(Math.floor(Math.random() * 3))}
            whileTap={{ scale: 0.96 }}
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 bg-[oklch(0.09_0.006_60)/0.9] backdrop-blur-sm"
          >
            <Heart size={18} className="text-[oklch(0.65_0.2_20)]" />
          </Pressable>
        </div>

        {/* Barre de saisie */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="relative z-20 shrink-0 px-3 pt-2 pb-[94px]"
        >
          <div className="flex items-center gap-2 rounded-full border border-border bg-[oklch(0.08_0.004_60)] px-2 py-1.5">
            <Pressable
              type="button"
              aria-label="Emojis"
              whileTap={{ scale: 0.96 }}
              onClick={() => setEmojiOpen((v) => !v)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
            >
              <Smile size={18} className="text-muted-foreground" />
            </Pressable>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Écris ton message…"
              className="min-w-0 flex-1 bg-transparent px-1 text-[13px] outline-none placeholder:text-muted-foreground"
            />
            <Pressable
              type="button"
              aria-label="Envoyer un cadeau"
              whileTap={{ scale: 0.96 }}
              onClick={() => setGiftOpen(true)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
            >
              <Gift size={18} className="text-gold" />
            </Pressable>
            <Pressable
              type="submit"
              aria-label="Envoyer"
              whileTap={{ scale: 0.96 }}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-gradient"
            >
              <Send size={14} className="text-[oklch(0.16_0.02_60)]" />
            </Pressable>
          </div>
        </form>
      </div>


      {/* Feuilles */}
      <BottomSheet open={rulesOpen} onClose={() => setRulesOpen(false)}>
        <div className="px-5 pt-2 pb-4">
          <h2 className="text-[16px] font-extrabold tracking-wide text-gold">RÈGLES DE LA TABLE</h2>
          <ul className="mt-3 space-y-2 text-[13.5px] text-foreground/85">
            <li>Respect &amp; bienveillance</li>
            <li>Chacun son tour</li>
            <li>Pas d'attaque personnelle</li>
          </ul>
          <p className="mt-3 text-[12.5px] text-muted-foreground">
            Boucle : dé → carte → 45 s de parole par joueur → vote → le moins voté descend → un spectateur monte.
            L'hôte est immunisée.
          </p>
        </div>
      </BottomSheet>

      <BottomSheet open={menuOpen} onClose={() => setMenuOpen(false)}>
        <div className="px-4 pt-2 pb-4">
          <Pressable
            onClick={() => {
              setMenuOpen(false);
              setRulesOpen(true);
            }}
            className="w-full rounded-xl px-3 py-3 text-left text-[14px] font-semibold text-foreground/90"
          >
            Règles
          </Pressable>
          <Pressable
            onClick={() => navigate({ to: "/live" })}
            className="w-full rounded-xl px-3 py-3 text-left text-[14px] font-semibold text-[oklch(0.7_0.18_25)]"
          >
            Quitter la table
          </Pressable>
        </div>
      </BottomSheet>

      <BottomSheet open={giftOpen} onClose={() => setGiftOpen(false)}>
        <div className="px-5 pt-2 pb-4">
          <h2 className="text-[16px] font-extrabold tracking-wide text-gold">CADEAUX</h2>
          <p className="mt-1 text-[12px] text-muted-foreground">Offre un cadeau à la table (coût en Zems).</p>
          <div className="mt-3 grid grid-cols-3 gap-2.5">
            {GIFTS.map((g) => (
              <Pressable
                key={g.name}
                whileTap={{ scale: 0.96 }}
                onClick={() => setGiftOpen(false)}
                className="flex flex-col items-center gap-1 rounded-2xl border border-gold/25 bg-[oklch(0.08_0.005_60)] py-3"
              >
                <g.Icon size={22} className="text-gold" />
                <span className="text-[12px] font-bold text-white">{g.name}</span>
                <span className="text-[11px] font-semibold text-gold/80">{g.cost} Zems</span>
              </Pressable>
            ))}
          </div>
        </div>
      </BottomSheet>

      <BottomSheet open={seatMenu !== null} onClose={() => setSeatMenu(null)}>
        <div className="px-4 pt-2 pb-4">
          <p className="px-3 pb-2 text-[12px] font-bold tracking-[0.14em] text-gold uppercase">
            {seats.find((s) => s.n === seatMenu)?.label ?? ""}
          </p>
          {["Voir le profil", "Couper le son", "Signaler"].map((label) => (
            <Pressable
              key={label}
              onClick={() => {
                if (label === "Couper le son" && seatMenu)
                  setMutedManual((m) => ({ ...m, [seatMenu]: true }));
                setSeatMenu(null);
              }}
              className="w-full rounded-xl px-3 py-3 text-left text-[14px] font-semibold text-foreground/90"
            >
              {label}
            </Pressable>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
}

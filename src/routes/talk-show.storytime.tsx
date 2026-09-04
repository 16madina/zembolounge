import { useLiveConfig } from "@/lib/talk-show-config";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  Eye,
  Gift,
  Heart,
  MessageCircle,
  Send,
  Share2,
  Smile,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BottomSheet } from "@/components/zembo/Sheet";
import { Avatar, Pressable } from "@/components/zembo/ui";
import bg from "@/assets/storytime-live-bg.jpg";
import { LikeCount, LikePill, useTapToLike } from "@/components/zembo/TapToLike";

export const Route = createFileRoute("/talk-show/storytime")({
  head: () => ({
    meta: [
      { title: "Storytime en direct — Zembo" },
      {
        name: "description",
        content:
          "Storytime Zembo : écoute Deena raconter son histoire en direct, commente, like et envoie des cadeaux.",
      },
      { property: "og:title", content: "Storytime en direct — Zembo" },
      {
        property: "og:description",
        content: "L'hôte raconte, la communauté réagit. Live Storytime sur Zembo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StorytimeLive,
});

type Msg = { id: number; user: string; text: string; tint: string; me?: boolean };

const TINTS: string[] = [
  "text-[oklch(0.78_0.13_85)]",
  "text-[oklch(0.75_0.15_300)]",
  "text-[oklch(0.75_0.14_160)]",
  "text-[oklch(0.75_0.14_250)]",
  "text-[oklch(0.72_0.17_350)]",
];

const INITIAL: Msg[] = [
  { id: 1, user: "Fatou", text: "Ton histoire m'inspire 🙏", tint: TINTS[1]! },
  { id: 2, user: "Ben", text: "Continue Deena ! 🔥", tint: TINTS[2]! },
  { id: 3, user: "QueenVee", text: "Trop fort ce parcours 👏", tint: TINTS[4]! },
  { id: 4, user: "Momo", text: "Merci pour ce partage ✨", tint: TINTS[3]! },
];

const AUTO: Array<[string, string]> = [
  ["Kader", "Là je suis à fond 👀"],
  ["Emma", "Cette partie m'a touchée…"],
  ["Nadia", "Respect pour ton courage 💪"],
  ["Yann", "On t'écoute Deena !"],
  ["Leïla", "Tu vas motiver du monde ce soir ✨"],
  ["Moussa", "Grosse énergie 🔥"],
];

const GIFTS = [
  { id: "rose", label: "Rose", emoji: "🌹", cost: 5 },
  { id: "coeur", label: "Cœur", emoji: "💖", cost: 10 },
  { id: "etoile", label: "Étoile", emoji: "⭐", cost: 25 },
  { id: "couronne", label: "Couronne", emoji: "👑", cost: 99 },
  { id: "feu", label: "Feu", emoji: "🔥", cost: 15 },
  { id: "diamant", label: "Diamant", emoji: "💎", cost: 199 },
];

const tap = () => navigator.vibrate?.(15);

function StorytimeLive() {
  const navigate = useNavigate();
  const liveTitle =
    useLiveConfig().title || "Mon histoire : comment j'ai tout recommencé à zéro 🌟";
  const [msgs, setMsgs] = useState<Msg[]>(INITIAL);
  const [draft, setDraft] = useState("");
  const [follow, setFollow] = useState(false);
  const tapLike = useTapToLike(2400);
  const [viewers, setViewers] = useState(1247);
  const [floatGifts, setFloatGifts] = useState<{ id: number; emoji: string }[]>([]);
  const [giftsOpen, setGiftsOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const seq = useRef(100);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [msgs]);

  useEffect(() => {
    const t = setInterval(() => {
      setViewers((v) => Math.max(1100, v + Math.round((Math.random() - 0.45) * 14)));
    }, 2200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      const [user, text] = AUTO[Math.floor(Math.random() * AUTO.length)]!;
      seq.current += 1;
      const id = seq.current;
      setMsgs((m) => [
        ...m.slice(-24),
        { id, user, text, tint: TINTS[id % TINTS.length]! },
      ]);
    }, 3000);
    return () => clearInterval(t);
  }, []);


  const send = () => {
    const text = draft.trim();
    if (!text) return;
    tap();
    seq.current += 1;
    setMsgs((m) => [...m, { id: seq.current, user: "Deena", text, tint: TINTS[0]!, me: true }]);
    setDraft("");
    setEmojiOpen(false);
  };

  const sendGift = (g: (typeof GIFTS)[number]) => {
    tap();
    setGiftsOpen(false);
    const id = Date.now();
    setFloatGifts((f) => [...f, { id, emoji: g.emoji }]);
    setTimeout(() => setFloatGifts((f) => f.filter((x) => x.id !== id)), 2000);
    setNotice(`Deena a envoyé ${g.emoji} ${g.label}`);
    setTimeout(() => setNotice(null), 2600);
  };

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-black"
      onPointerDown={tapLike.onSceneTap}
    >
      {/* Décor plein écran */}
      <img
        src={bg}
        alt="Deena raconte son histoire en direct"
        width={896}
        height={1600}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {tapLike.layer}

      {/* Dégradés de lisibilité */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[26%] bg-gradient-to-b from-black/85 via-black/35 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-black/92 via-black/55 to-transparent" />

      {/* ── HAUT GAUCHE ── */}
      <div className="absolute top-[max(env(safe-area-inset-top),12px)] left-3 z-20 max-w-[62%]">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-live px-2 py-[3px] text-[10px] font-extrabold tracking-wide text-white">
            <motion.span
              animate={{ opacity: [1, 0.25, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-white"
            />
            LIVE
          </span>
          <span className="flex items-center gap-1 rounded-full bg-black/45 px-2 py-[3px] text-[10px] font-semibold text-white/90 backdrop-blur-md">
            <Eye size={11} />
            {(viewers / 1000).toFixed(1)}K
          </span>
          <LikePill likes={tapLike.likes} pop={tapLike.pop} />
        </div>

        <div className="mt-2 flex items-center gap-2 rounded-full bg-black/45 py-1 pr-1 pl-1 backdrop-blur-md">
          <Avatar name="Deena" size={28} />
          <span className="flex items-center gap-1 text-[12px] font-bold text-white">
            Deena
            <BadgeCheck size={13} className="text-gold" />
          </span>
          <Pressable
            onClick={() => {
              tap();
              setFollow((f) => !f);
            }}
            className={
              follow
                ? "rounded-full border border-white/25 px-2.5 py-1 text-[10.5px] font-bold text-white/80"
                : "rounded-full bg-gold px-2.5 py-1 text-[10.5px] font-extrabold text-black"
            }
          >
            {follow ? "Suivi ✓" : "+ Suivre"}
          </Pressable>
        </div>

        <h1 className="mt-2.5 max-w-[240px] line-clamp-2 text-[13.5px] leading-snug font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          {liveTitle}
        </h1>
      </div>

      {/* ── HAUT DROITE ── */}
      <div className="absolute top-[max(env(safe-area-inset-top),12px)] right-3 z-20 flex items-center gap-2">
        <Pressable
          aria-label="Partager"
          onClick={tap}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/45 backdrop-blur-md"
        >
          <Share2 size={16} className="text-white" />
        </Pressable>
        <Pressable
          aria-label="Fermer le live"
          onClick={() => navigate({ to: "/talk-show" })}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/45 backdrop-blur-md"
        >
          <X size={18} className="text-white" />
        </Pressable>
      </div>

      {/* ── COLONNE D'ACTIONS ── */}
      <div className="absolute right-3 bottom-[168px] z-20 flex flex-col items-center gap-3.5">
        <div className="relative flex flex-col items-center">
          <Pressable
            aria-label="J'aime"
            onClick={tapLike.likeFromButton}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-black/40 backdrop-blur-md"
          >
            <Heart size={22} className="text-[oklch(0.65_0.22_20)]" fill="currentColor" />
          </Pressable>
          <LikeCount
            likes={tapLike.likes}
            pop={tapLike.pop}
            className="mt-1 inline-block text-[10.5px] font-bold text-white/90"
          />
        </div>

        <div className="flex flex-col items-center">
          <Pressable
            aria-label="Commenter"
            onClick={() => {
              tap();
              inputRef.current?.focus();
            }}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-black/40 backdrop-blur-md"
          >
            <MessageCircle size={21} className="text-white" />
          </Pressable>
          <span className="mt-1 text-[10.5px] font-bold text-white/90">{msgs.length}</span>
        </div>

        <div className="flex flex-col items-center">
          <Pressable
            aria-label="Envoyer un cadeau"
            onClick={() => {
              tap();
              setGiftsOpen(true);
            }}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-black/40 backdrop-blur-md"
          >
            <Gift size={21} className="text-gold" />
          </Pressable>
          <span className="mt-1 text-[10.5px] font-bold text-white/90">Cadeau</span>
        </div>

        <Pressable
          aria-label="Partager le live"
          onClick={tap}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-black/40 backdrop-blur-md"
        >
          <Share2 size={20} className="text-white" />
        </Pressable>
      </div>

      {/* ── CADEAUX FLOTTANTS ── */}
      <div className="pointer-events-none absolute inset-0 z-30">
        <AnimatePresence>
          {floatGifts.map((g) => (
            <motion.span
              key={g.id}
              initial={{ opacity: 0, scale: 0.4, y: 40 }}
              animate={{ opacity: 1, scale: 1.4, y: -60 }}
              exit={{ opacity: 0, scale: 0.9, y: -120 }}
              transition={{ duration: 1.8, ease: "easeOut" }}
              className="absolute bottom-[38%] left-1/2 -translate-x-1/2 text-[56px] drop-shadow-[0_6px_20px_rgba(0,0,0,0.7)]"
            >
              {g.emoji}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      {/* ── NOTIFICATION CADEAU ── */}
      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="absolute bottom-[210px] left-3 z-20 rounded-full border border-gold/45 bg-black/60 px-3 py-1.5 text-[11.5px] font-semibold text-gold backdrop-blur-md"
          >
            {notice}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CHAT LIVE ── */}
      <div className="absolute inset-x-0 bottom-[60px] z-10 px-3">
        <div className="no-scrollbar max-h-[168px] w-[74%] overflow-y-auto">
          <div className="flex flex-col gap-1.5">
            <AnimatePresence initial={false}>
              {msgs.slice(-12).map((m) => (
                <motion.p
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[12.5px] leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]"
                >
                  <span className={`font-bold ${m.tint}`}>{m.user}</span>{" "}
                  <span className="text-white/95">{m.text}</span>
                </motion.p>
              ))}
            </AnimatePresence>
            <div ref={endRef} />
          </div>
        </div>
      </div>

      {/* ── BARRE DE SAISIE ── */}
      <div className="absolute inset-x-0 bottom-0 z-20 px-3 pt-2 pb-[max(env(safe-area-inset-bottom),10px)]">
        <AnimatePresence>
          {emojiOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mb-2 flex flex-wrap gap-1.5 rounded-2xl border border-white/12 bg-black/70 p-2 backdrop-blur-md"
            >
              {["❤️", "🔥", "👏", "😂", "🙏", "✨", "💯", "😮", "🌹", "👑"].map((e) => (
                <Pressable
                  key={e}
                  onClick={() => setDraft((d) => d + e)}
                  className="h-8 w-8 rounded-lg bg-white/8 text-[17px]"
                >
                  {e}
                </Pressable>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex items-center gap-2"
        >
          <Pressable
            type="button"
            aria-label="Emojis"
            onClick={() => setEmojiOpen((o) => !o)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/50 backdrop-blur-md"
          >
            <Smile size={17} className="text-white/85" />
          </Pressable>
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ajoute un commentaire…"
            className="min-w-0 flex-1 rounded-full border border-white/15 bg-black/50 px-3.5 py-2 text-[13px] text-white placeholder:text-white/45 outline-none backdrop-blur-md"
          />
          <Pressable
            type="button"
            aria-label="Cadeaux"
            onClick={() => {
              tap();
              setGiftsOpen(true);
            }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/50 backdrop-blur-md"
          >
            <Gift size={17} className="text-gold" />
          </Pressable>
          <Pressable
            type="submit"
            aria-label="Envoyer"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold"
          >
            <Send size={16} className="text-black" />
          </Pressable>
        </form>
      </div>

      {/* ── FEUILLE CADEAUX ── */}
      <BottomSheet open={giftsOpen} onClose={() => setGiftsOpen(false)}>
        <div className="px-4">
          <h2 className="text-[15px] font-extrabold text-foreground">Envoyer un cadeau</h2>
          <p className="mt-1 text-[11.5px] text-muted-foreground">
            Soutiens Deena pendant son Storytime · Solde : 1 250 Zems
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2.5">
            {GIFTS.map((g) => (
              <Pressable
                key={g.id}
                onClick={() => sendGift(g)}
                className="card-surface flex flex-col items-center gap-1 rounded-2xl py-3"
              >
                <span className="text-[26px]">{g.emoji}</span>
                <span className="text-[11.5px] font-semibold text-foreground">{g.label}</span>
                <span className="text-[10.5px] font-bold text-gold">{g.cost} Zems</span>
              </Pressable>
            ))}
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}

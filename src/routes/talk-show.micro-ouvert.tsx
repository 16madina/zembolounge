import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  CameraOff,
  Crown,
  Eye,
  Gift,
  Hand,
  Heart,
  LogOut,
  MessageCircle,
  Mic,
  MicOff,
  MoreHorizontal,
  Send,
  Share2,
  Smile,
  SmilePlus,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { BottomSheet } from "@/components/zembo/Sheet";
import { Avatar, Pressable } from "@/components/zembo/ui";
import stage from "@/assets/zembo-micro-ouvert-stage.png";

export const Route = createFileRoute("/talk-show/micro-ouvert")({
  head: () => ({
    meta: [
      { title: "Micro Ouvert en direct — Zembo" },
      {
        name: "description",
        content:
          "Micro Ouvert Zembo : Deena anime, 4 invités montent sur scène, demande la parole et échange en direct.",
      },
      { property: "og:title", content: "Micro Ouvert en direct — Zembo" },
      {
        property: "og:description",
        content: "Ta voix compte : lève la main, monte au micro et partage en direct sur Zembo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MicroOuvertLive,
});

const tap = () => navigator.vibrate?.(14);

type Guest = {
  slot: 1 | 2 | 3 | 4;
  name: string | null;
  mic: boolean;
  hand: boolean;
  speaking: boolean;
};

type Role = "host" | "guest" | "viewer";

const ROLE_LABEL: Record<Role, string> = {
  host: "👑 Hôte",
  guest: "🙋 Invité",
  viewer: "👁 Spectateur",
};

const NEXT_ROLE: Record<Role, Role> = { host: "guest", guest: "viewer", viewer: "host" };

const SLOT_POS: Record<1 | 2 | 3 | 4, { left: string; width: string }> = {
  1: { left: "4.25%", width: "23.2%" },
  2: { left: "27.6%", width: "22.3%" },
  3: { left: "50.5%", width: "21.8%" },
  4: { left: "72.8%", width: "22.3%" },
};

type Msg = { id: number; user: string; text: string; tint: string; me?: boolean };

const TINTS = [
  "text-[oklch(0.78_0.13_85)]",
  "text-[oklch(0.75_0.15_300)]",
  "text-[oklch(0.75_0.14_160)]",
  "text-[oklch(0.75_0.14_250)]",
  "text-[oklch(0.72_0.17_350)]",
];

const INITIAL: Msg[] = [
  { id: 1, user: "Sophie", text: "Tellement vrai ! 👏", tint: TINTS[4]! },
  { id: 2, user: "Kevin", text: "Je veux monter 🙏", tint: TINTS[3]! },
  { id: 3, user: "Lina", text: "Super débat 👌", tint: TINTS[1]! },
  { id: 4, user: "Djamal", text: "Ça fait réfléchir…", tint: TINTS[2]! },
  { id: 5, user: "Noura", text: "Respect à tous les intervenants ! ❤️", tint: TINTS[4]! },
  { id: 6, user: "Alex", text: "Open Mic toujours au top ! 🔥", tint: TINTS[3]! },
];

const AUTO: Array<[string, string]> = [
  ["Fatou", "Aïssatou a trop raison 💯"],
  ["Momo", "Passe le micro à Jordan 🎤"],
  ["Nadia", "Je lève la main aussi ✋"],
  ["Yann", "Ambiance parfaite ce soir ✨"],
  ["Emma", "Deena gère le débat 👑"],
  ["Karim", "L'argent ne fait pas tout…"],
];

const GIFTS = [
  { id: "rose", label: "Rose", emoji: "🌹", cost: 5 },
  { id: "coeur", label: "Cœur", emoji: "💖", cost: 10 },
  { id: "micro", label: "Micro d'or", emoji: "🎤", cost: 30 },
  { id: "etoile", label: "Étoile", emoji: "⭐", cost: 25 },
  { id: "feu", label: "Feu", emoji: "🔥", cost: 15 },
  { id: "couronne", label: "Couronne", emoji: "👑", cost: 99 },
];

function Wave({ color = "oklch(0.82 0.13 85)" }: { color?: string }) {
  return (
    <span className="flex items-end gap-[2px]">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          animate={{ scaleY: [0.35, 1, 0.5, 0.9, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.09 }}
          style={{ background: color }}
          className="h-[11px] w-[2px] origin-bottom rounded-full"
        />
      ))}
    </span>
  );
}

function fmt(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map((n) => String(n).padStart(2, "0")).join(":");
}

function MicroOuvertLive() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("host");
  const [guests, setGuests] = useState<Guest[]>([
    { slot: 1, name: "Malik", mic: true, hand: false, speaking: true },
    { slot: 2, name: "Aïssatou", mic: false, hand: true, speaking: false },
    { slot: 3, name: "Jordan", mic: false, hand: true, speaking: false },
    { slot: 4, name: null, mic: false, hand: false, speaking: false },
  ]);
  const [myHand, setMyHand] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [riseQueue, setRiseQueue] = useState<string[]>(["Kevin", "Nadia"]);
  const [riseAsked, setRiseAsked] = useState(false);
  const [riseOpen, setRiseOpen] = useState(false);
  const [placesOpen, setPlacesOpen] = useState(false);
  const [seconds, setSeconds] = useState(4356);
  const [viewers, setViewers] = useState(325);
  const [likes, setLikes] = useState(1800);
  const [follow, setFollow] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>(INITIAL);
  const [draft, setDraft] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [hearts, setHearts] = useState<number[]>([]);
  const [floats, setFloats] = useState<{ id: number; emoji: string }[]>([]);
  const [requestsOpen, setRequestsOpen] = useState(false);
  const [giftsOpen, setGiftsOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [reactOpen, setReactOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const seq = useRef(100);

  const hands = useMemo(() => guests.filter((g) => g.name && g.hand), [guests]);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(
      () => setViewers((v) => Math.max(280, v + Math.round((Math.random() - 0.45) * 8))),
      2400,
    );
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      const [user, text] = AUTO[Math.floor(Math.random() * AUTO.length)]!;
      seq.current += 1;
      const id = seq.current;
      setMsgs((m) => [...m.slice(-30), { id, user, text, tint: TINTS[id % TINTS.length]! }]);
    }, 3200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [msgs]);

  const flash = (t: string) => {
    setNotice(t);
    setTimeout(() => setNotice(null), 2400);
  };

  const like = () => {
    tap();
    setLikes((l) => l + 1);
    const id = Date.now() + Math.random();
    setHearts((h) => [...h, id]);
    setTimeout(() => setHearts((h) => h.filter((x) => x !== id)), 1600);
  };

  const floatEmoji = (emoji: string) => {
    const id = Date.now() + Math.random();
    setFloats((f) => [...f, { id, emoji }]);
    setTimeout(() => setFloats((f) => f.filter((x) => x.id !== id)), 2000);
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    tap();
    seq.current += 1;
    setMsgs((m) => [...m, { id: seq.current, user: "Deena", text, tint: TINTS[0]!, me: true }]);
    setDraft("");
    setEmojiOpen(false);
  };

  // Vue invité : je suis l'invité de la place 3 (Jordan)
  const toggleMyHand = () => {
    tap();
    const next = !myHand;
    setMyHand(next);
    setGuests((gs) => gs.map((g) => (g.slot === 3 ? { ...g, hand: next } : g)));
    flash(next ? "Ta main est levée ✋" : "Demande annulée");
  };

  const giveFloor = (slot: number) => {
    tap();
    setGuests((gs) =>
      gs.map((g) => (g.slot === slot ? { ...g, hand: false, mic: true, speaking: true } : g)),
    );
    const g = guests.find((x) => x.slot === slot);
    flash(`${g?.name} a la parole 🎤`);
    if (slot === 3) setMyHand(false);
  };

  const refuse = (slot: number) => {
    tap();
    setGuests((gs) => gs.map((g) => (g.slot === slot ? { ...g, hand: false } : g)));
    if (slot === 3) setMyHand(false);
  };

  const centerLabel = role === "host" ? "Donner la parole" : myHand ? "Main levée" : "Demander à parler";

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-black">
      {/* ══ DÉCOR + OVERLAYS ══ */}
      <div className="relative w-full shrink-0">
        <img
          src={stage}
          alt="Micro Ouvert : Deena anime le live avec quatre invités"
          width={941}
          height={785}
          className="block w-full"
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[34%] bg-gradient-to-b from-black/95 via-black/72 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[12%] bg-gradient-to-t from-black/80 to-transparent" />

        {/* 1) EN-TÊTE — 2 lignes */}
        <div className="absolute inset-x-0 top-[max(env(safe-area-inset-top),6px)] z-20 flex items-start justify-between gap-2 px-2.5">
          <div className="flex min-w-0 items-start gap-1.5">
            <span className="mt-[1px] flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/15 text-[13px] font-black text-gold">
              Z
            </span>
            <div className="min-w-0 leading-tight">
              <p className="text-[13px] font-black tracking-tight text-gold">MICRO OUVERT</p>
              <p className="mt-[2px] line-clamp-2 text-[9.5px] leading-snug font-semibold text-white/75">
                Sujet : Amour, amitié ou argent : qu'est-ce qui rend vraiment heureux ?
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <span className="flex items-center gap-1 rounded-full bg-black/55 px-2 py-[3px] text-[10px] font-bold text-white/90 backdrop-blur-md">
              <Eye size={11} className="text-gold" /> {viewers}
              <span className="font-medium text-white/55">en direct</span>
            </span>
            <Pressable
              onClick={() => {
                tap();
                setRole((r) => (r === "host" ? "guest" : "host"));
              }}
              className="rounded-full border border-white/20 bg-black/60 px-2 py-[3px] text-[10px] font-bold whitespace-nowrap text-white/85 backdrop-blur-md"
            >
              {role === "host" ? "👑 Vue" : "🙋 Vue"}
            </Pressable>
            <Pressable
              aria-label="Plus d'options"
              onClick={() => {
                tap();
                setMoreOpen(true);
              }}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-black/55 backdrop-blur-md"
            >
              <MoreHorizontal size={15} className="text-white" />
            </Pressable>
          </div>
        </div>

        {/* 2) LIVE + chrono, juste sous l'en-tête */}
        <div className="absolute top-[17%] left-2.5 z-20 flex items-center gap-1.5 rounded-full bg-black/50 p-[2px] pr-2 backdrop-blur-md">
          <span className="flex items-center gap-1 rounded-full bg-live px-1.5 py-[2px] text-[9px] font-black text-white">
            <motion.span
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="h-1 w-1 rounded-full bg-white"
            />
            LIVE
          </span>
          <span className="text-[10px] font-bold tabular-nums text-white/90">{fmt(seconds)}</span>
        </div>

        {/* 3) Pastille hôte */}
        <div className="absolute top-[24%] left-2.5 z-20 flex items-center gap-1.5 rounded-full bg-black/60 p-1 pr-2 backdrop-blur-md">
          <Avatar name="Deena" size={26} />
          <div className="leading-tight">
            <p className="flex items-center gap-1 text-[11px] font-extrabold text-white">
              Deena <Crown size={11} className="text-gold" fill="currentColor" />
            </p>
            <p className="text-[9px] font-semibold text-white/60">Hôte</p>
          </div>
          {role === "guest" && (
            <Pressable
              onClick={() => {
                tap();
                setFollow((f) => !f);
              }}
              className={
                follow
                  ? "ml-0.5 rounded-full border border-white/25 px-2 py-[2px] text-[9.5px] font-bold text-white/80"
                  : "ml-0.5 rounded-full bg-gold px-2 py-[2px] text-[9.5px] font-extrabold text-black"
              }
            >
              {follow ? "Suivi ✓" : "+ Suivre"}
            </Pressable>
          )}
        </div>


        {/* ══ 4 PLACES INVITÉS ══ */}
        {guests.map((g) => {
          const pos = SLOT_POS[g.slot];
          const isMe = role === "guest" && g.slot === 3;
          return (
            <div
              key={g.slot}
              className="absolute z-20"
              style={{ left: pos.left, width: pos.width, top: "74.9%", height: "24.5%" }}
            >
              {g.name ? (
                <Pressable
                  onClick={() => {
                    tap();
                    if (role === "host" && g.hand) giveFloor(g.slot);
                    else if (isMe) toggleMyHand();
                  }}
                  className={`relative block h-full w-full rounded-xl ${
                    g.hand
                      ? "ring-2 ring-gold shadow-[0_0_16px_oklch(0.82_0.13_85_/_0.55)]"
                      : g.speaking && g.mic
                        ? "ring-2 ring-[oklch(0.72_0.15_250)]"
                        : ""
                  }`}
                >
                  {/* main levée */}
                  <AnimatePresence>
                    {g.hand && (
                      <motion.span
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: [1, 1.14, 1], opacity: 1 }}
                        exit={{ scale: 0.4, opacity: 0 }}
                        transition={{ duration: 1.1, repeat: Infinity }}
                        className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-[12px] shadow-lg"
                      >
                        ✋
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {/* statut bas */}
                  <span className="absolute inset-x-0 bottom-0 flex items-center justify-between rounded-b-xl bg-black/70 px-1 py-[2px] backdrop-blur-sm">
                    <span className="flex items-center gap-[3px]">
                      {g.mic ? (
                        <Mic size={10} className="text-[oklch(0.72_0.15_250)]" />
                      ) : (
                        <MicOff size={10} className="text-white/50" />
                      )}
                      <span className="truncate text-[9px] font-bold text-white">{g.name}</span>
                    </span>
                    {g.mic && g.speaking ? <Wave /> : null}
                  </span>
                  {g.hand && (
                    <span className="absolute inset-x-1 top-1/2 -translate-y-1/2 rounded-md bg-black/65 px-1 py-[2px] text-center text-[8px] leading-tight font-black text-gold backdrop-blur-sm">
                      a demandé à parler
                    </span>
                  )}
                </Pressable>
              ) : (
                <Pressable
                  onClick={() => {
                    tap();
                    flash("Demande envoyée à l'hôte ✋");
                    setMyHand(true);
                  }}
                  className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-dashed border-gold/45 bg-black/45"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gold text-[13px] font-black text-gold">
                    +
                  </span>
                  <span className="mt-0.5 px-1 text-center text-[8.5px] leading-tight font-bold text-white/85">
                    Demander à monter
                  </span>
                </Pressable>
              )}
            </div>
          );
        })}

        {/* ══ COLONNE DROITE (démarre au niveau de la rangée des invités) ══ */}
        <div className="absolute top-[97%] right-1.5 z-40 flex flex-col items-center gap-2">

          <div className="relative flex flex-col items-center">
            <AnimatePresence>
              {hearts.map((h) => (
                <motion.span
                  key={h}
                  initial={{ opacity: 0.95, y: 0, scale: 0.6 }}
                  animate={{ opacity: 0, y: -150, x: (Math.random() - 0.5) * 50, scale: 1.3 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="pointer-events-none absolute bottom-7 text-[20px]"
                >
                  ❤️
                </motion.span>
              ))}
            </AnimatePresence>
            <Pressable
              aria-label="J'aime"
              onClick={like}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 backdrop-blur-md"
            >
              <Heart size={18} className="text-[oklch(0.65_0.22_20)]" fill="currentColor" />
            </Pressable>
            <span className="text-[9.5px] font-bold text-white/90">
              {(likes / 1000).toFixed(1)}K
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Pressable
              aria-label="Commenter"
              onClick={() => {
                tap();
                inputRef.current?.focus();
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 backdrop-blur-md"
            >
              <MessageCircle size={17} className="text-white" />
            </Pressable>
            <span className="text-[9.5px] font-bold text-white/90">246</span>
          </div>
          <div className="flex flex-col items-center">
            <Pressable
              aria-label="Partager"
              onClick={() => {
                tap();
                setInviteOpen(true);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 backdrop-blur-md"
            >
              <Share2 size={17} className="text-white" />
            </Pressable>
            
          </div>
          <div className="flex flex-col items-center">
            <Pressable
              aria-label="Cadeau"
              onClick={() => {
                tap();
                setGiftsOpen(true);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 backdrop-blur-md"
            >
              <Gift size={17} className="text-gold" />
            </Pressable>
            
          </div>
          <div className="flex flex-col items-center">
            <Pressable
              aria-label="Envoyer des Zems"
              onClick={() => {
                tap();
                setGiftsOpen(true);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gold bg-black/50 text-[13px] font-black text-gold backdrop-blur-md"
            >
              Z
            </Pressable>
            <span className="max-w-[52px] text-center text-[9px] leading-tight font-semibold text-white/80">
              Envoyer des Zems
            </span>
          </div>
        </div>

        {/* emojis flottants */}
        <div className="pointer-events-none absolute inset-0 z-30">
          <AnimatePresence>
            {floats.map((f) => (
              <motion.span
                key={f.id}
                initial={{ opacity: 0, scale: 0.4, y: 60 }}
                animate={{ opacity: 1, scale: 1.3, y: -60 }}
                exit={{ opacity: 0, y: -120 }}
                transition={{ duration: 1.8, ease: "easeOut" }}
                className="absolute bottom-[20%] left-1/2 -translate-x-1/2 text-[46px] drop-shadow-[0_6px_20px_rgba(0,0,0,0.7)]"
              >
                {f.emoji}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* ══ CHAT LIVE ══ */}
      <div className="no-scrollbar relative flex min-h-0 flex-1 flex-col justify-end overflow-y-auto pt-2 pr-[56px] pl-2.5">
        <div className="flex flex-col gap-1.5">
          <AnimatePresence initial={false}>
            {msgs.slice(-30).map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex max-w-[86%] items-center gap-1.5 rounded-full bg-black/45 px-1.5 py-[3px] backdrop-blur-sm"
              >
                <Avatar name={m.user} size={20} />
                <p className="min-w-0 text-[11.5px] leading-snug">
                  <span className={`font-bold ${m.tint}`}>{m.user}</span>{" "}
                  <span className="text-white/95">{m.text}</span>
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={endRef} />
        </div>
      </div>

      {/* ══ NOTIFICATION ══ */}
      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute bottom-[142px] left-2.5 z-40 rounded-full border border-gold/45 bg-black/70 px-3 py-1.5 text-[11px] font-bold text-gold backdrop-blur-md"
          >
            {notice}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ SAISIE ══ */}
      <div className="shrink-0 px-2.5 pt-1.5">
        <AnimatePresence>
          {emojiOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mb-1.5 flex flex-wrap gap-1.5 rounded-2xl border border-white/12 bg-black/70 p-2 backdrop-blur-md"
            >
              {["❤️", "🔥", "👏", "😂", "🙏", "✨", "💯", "🎤", "✋", "👑"].map((e) => (
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
          className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5"
        >
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Écris un message…"
            className="min-w-0 flex-1 bg-transparent text-[12.5px] text-white placeholder:text-white/45 outline-none"
          />
          <Pressable
            type="button"
            aria-label="Emojis"
            onClick={() => setEmojiOpen((o) => !o)}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10"
          >
            <Smile size={15} className="text-white/85" />
          </Pressable>
          <Pressable
            type="submit"
            aria-label="Envoyer"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold"
          >
            <Send size={14} className="text-black" />
          </Pressable>
        </form>
      </div>

      {/* ══ BARRE DU BAS — hôte & invité seulement ══ */}
      {role !== "viewer" && (
        <div className="shrink-0 px-2 pt-2 pb-[max(env(safe-area-inset-bottom),8px)]">
          <div className="flex items-end justify-between rounded-[26px] border border-white/10 bg-black/70 px-1.5 py-2 backdrop-blur-xl">
            <BarItem
              icon={<LogOut size={18} />}
              label={role === "host" ? "Quitter" : "Quitter la scène"}
              onClick={() => {
                if (role === "guest") leaveStage();
                else {
                  tap();
                  navigate({ to: "/talk-show" });
                }
              }}
            />
            <BarItem
              icon={micOn ? <Mic size={18} /> : <MicOff size={18} className="text-white/45" />}
              label="Mic"
              onClick={() => {
                tap();
                setMicOn((m) => !m);
                flash(micOn ? "Micro coupé" : "Micro ouvert");
              }}
            />
            <BarItem
              icon={camOn ? <Camera size={18} /> : <CameraOff size={18} className="text-white/45" />}
              label="Caméra"
              onClick={() => {
                tap();
                setCamOn((c) => !c);
              }}
            />

            {/* BOUTON CENTRAL */}
            <Pressable
              onClick={() => {
                if (role === "host") {
                  tap();
                  setRequestsOpen(true);
                } else toggleMyHand();
              }}
              className="relative -mt-4 flex h-[62px] w-[62px] shrink-0 flex-col items-center justify-center rounded-full bg-gold shadow-[0_6px_20px_oklch(0.82_0.13_85_/_0.45)]"
            >
              {role === "host" ? (
                <Mic size={18} className="text-black" />
              ) : (
                <Hand size={18} className={myHand ? "text-black/60" : "text-black"} />
              )}
              <span className="mt-[1px] max-w-[56px] text-center text-[8.5px] leading-[1.05] font-black text-black">
                {centerLabel}
              </span>
              {role === "host" && hands.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-live text-[10px] font-black text-white">
                  {hands.length}
                </span>
              )}
            </Pressable>

            <BarItem
              icon={<Users size={18} />}
              label="Inviter"
              onClick={() => {
                tap();
                setInviteOpen(true);
              }}
            />
            <BarItem
              icon={<SmilePlus size={18} />}
              label="Réactions"
              onClick={() => {
                tap();
                setReactOpen(true);
              }}
            />
            <BarItem
              icon={<MoreHorizontal size={18} />}
              label="Plus"
              onClick={() => {
                tap();
                setMoreOpen(true);
              }}
            />
          </div>
        </div>
      )}

      {/* ══ DEMANDES DE PAROLE (hôte) ══ */}
      <BottomSheet open={requestsOpen} onClose={() => setRequestsOpen(false)}>
        <div className="px-4">
          <h2 className="text-[15px] font-extrabold text-foreground">Demandes de parole</h2>
          <p className="mt-1 text-[11.5px] text-muted-foreground">
            {hands.length > 0
              ? `${hands.length} personne(s) ont levé la main. Max 4 invités sur scène.`
              : "Aucune main levée pour le moment."}
          </p>
          <div className="mt-3 space-y-2">
            {hands.map((g) => (
              <div key={g.slot} className="card-surface flex items-center gap-2.5 rounded-2xl p-2.5">
                <Avatar name={g.name!} size={38} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-foreground">{g.name}</p>
                  <p className="text-[11px] text-muted-foreground">Place {g.slot} · ✋ main levée</p>
                </div>
                <Pressable
                  onClick={() => giveFloor(g.slot)}
                  className="rounded-full bg-gold px-2.5 py-1.5 text-[10.5px] font-extrabold text-black"
                >
                  Donner la parole
                </Pressable>
                <Pressable
                  onClick={() => refuse(g.slot)}
                  className="rounded-full border border-white/18 px-2.5 py-1.5 text-[10.5px] font-bold text-muted-foreground"
                >
                  Refuser
                </Pressable>
              </div>
            ))}
          </div>
        </div>
      </BottomSheet>

      {/* ══ INVITER ══ */}
      <BottomSheet open={inviteOpen} onClose={() => setInviteOpen(false)}>
        <div className="px-4">
          <h2 className="text-[15px] font-extrabold text-foreground">Partager ce live</h2>
          <p className="mt-1 text-[11.5px] text-muted-foreground">
            Invite ta communauté à rejoindre le Micro Ouvert de Deena.
          </p>
          <div className="mt-3 grid grid-cols-4 gap-2.5">
            {[
              ["🔗", "Copier"],
              ["💬", "Message"],
              ["👥", "Amis"],
              ["📣", "Story"],
            ].map(([e, l]) => (
              <Pressable
                key={l}
                onClick={() => {
                  setInviteOpen(false);
                  flash("Invitation partagée ✅");
                }}
                className="card-surface flex flex-col items-center gap-1 rounded-2xl py-3"
              >
                <span className="text-[22px]">{e}</span>
                <span className="text-[10.5px] font-semibold text-foreground">{l}</span>
              </Pressable>
            ))}
          </div>
        </div>
      </BottomSheet>

      {/* ══ RÉACTIONS ══ */}
      <BottomSheet open={reactOpen} onClose={() => setReactOpen(false)}>
        <div className="px-4">
          <h2 className="text-[15px] font-extrabold text-foreground">Réactions</h2>
          <div className="mt-3 grid grid-cols-5 gap-2.5">
            {["❤️", "🔥", "👏", "😂", "🙏", "✨", "💯", "🎤", "😮", "👑"].map((e) => (
              <Pressable
                key={e}
                onClick={() => {
                  tap();
                  floatEmoji(e);
                }}
                className="card-surface flex items-center justify-center rounded-2xl py-3 text-[24px]"
              >
                {e}
              </Pressable>
            ))}
          </div>
        </div>
      </BottomSheet>

      {/* ══ CADEAUX ══ */}
      <BottomSheet open={giftsOpen} onClose={() => setGiftsOpen(false)}>
        <div className="px-4">
          <h2 className="text-[15px] font-extrabold text-foreground">Envoyer des Zems</h2>
          <p className="mt-1 text-[11.5px] text-muted-foreground">Solde : 1 250 Zems</p>
          <div className="mt-3 grid grid-cols-3 gap-2.5">
            {GIFTS.map((g) => (
              <Pressable
                key={g.id}
                onClick={() => {
                  tap();
                  setGiftsOpen(false);
                  floatEmoji(g.emoji);
                  flash(`Tu as envoyé ${g.emoji} ${g.label}`);
                }}
                className="card-surface flex flex-col items-center gap-1 rounded-2xl py-3"
              >
                <span className="text-[24px]">{g.emoji}</span>
                <span className="text-[11px] font-semibold text-foreground">{g.label}</span>
                <span className="text-[10.5px] font-bold text-gold">{g.cost} Zems</span>
              </Pressable>
            ))}
          </div>
        </div>
      </BottomSheet>

      {/* ══ PLUS — spécifique au rôle ══ */}
      <BottomSheet open={moreOpen} onClose={() => setMoreOpen(false)}>
        <div className="px-4">
          <h2 className="text-[15px] font-extrabold text-foreground">
            Options du live · {ROLE_LABEL[role]}
          </h2>
          <div className="mt-3 space-y-2">
            {moreItems.map((it) => (
              <Pressable
                key={it.title}
                onClick={() => {
                  tap();
                  setMoreOpen(false);
                  it.action();
                }}
                className="card-surface flex w-full items-center gap-3 rounded-2xl p-3 text-left"
              >
                <span className="text-[18px]">{it.emoji}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 text-[12.5px] font-bold text-foreground">
                    {it.title}
                    {it.badge ? (
                      <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-live px-1 text-[9.5px] font-black text-white">
                        {it.badge}
                      </span>
                    ) : null}
                  </span>
                  <span className="block text-[11px] text-muted-foreground">{it.sub}</span>
                </span>
              </Pressable>
            ))}
          </div>
        </div>
      </BottomSheet>

      {/* ══ GÉRER LES PLACES (hôte) ══ */}
      <BottomSheet open={placesOpen} onClose={() => setPlacesOpen(false)}>
        <div className="px-4">
          <h2 className="text-[15px] font-extrabold text-foreground">Gérer les places</h2>
          <p className="mt-1 text-[11.5px] text-muted-foreground">
            4 places maximum sur scène · {freeSlots} libre(s)
          </p>
          <div className="mt-3 space-y-2">
            {guests.map((g) => (
              <div key={g.slot} className="card-surface flex items-center gap-2.5 rounded-2xl p-2.5">
                {g.name ? <Avatar name={g.name} size={36} /> : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-dashed border-gold/50 text-[13px] font-black text-gold">
                    +
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-foreground">
                    {g.name ?? "Place libre"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">Place {g.slot}</p>
                </div>
                {g.name && (
                  <Pressable
                    onClick={() => kick(g.slot)}
                    className="rounded-full border border-white/18 px-2.5 py-1.5 text-[10.5px] font-bold text-muted-foreground"
                  >
                    Faire descendre
                  </Pressable>
                )}
              </div>
            ))}
          </div>
        </div>
      </BottomSheet>

      {/* ══ DEMANDES DE MONTÉE (hôte) ══ */}
      <BottomSheet open={riseOpen} onClose={() => setRiseOpen(false)}>
        <div className="px-4">
          <h2 className="text-[15px] font-extrabold text-foreground">Demandes de montée</h2>
          <p className="mt-1 text-[11.5px] text-muted-foreground">
            {freeSlots === 0
              ? "Table pleine — libère une place d'abord."
              : `${riseQueue.length} spectateur(s) veulent monter · ${freeSlots} place(s) libre(s)`}
          </p>
          <div className="mt-3 space-y-2">
            {riseQueue.map((n) => (
              <div key={n} className="card-surface flex items-center gap-2.5 rounded-2xl p-2.5">
                <Avatar name={n} size={36} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-foreground">{n}</p>
                  <p className="text-[11px] text-muted-foreground">Spectateur · ✋ veut monter</p>
                </div>
                <Pressable
                  onClick={() => promote(n)}
                  className="rounded-full bg-gold px-2.5 py-1.5 text-[10.5px] font-extrabold text-black"
                >
                  Faire monter
                </Pressable>
                <Pressable
                  onClick={() => refuseRise(n)}
                  className="rounded-full border border-white/18 px-2.5 py-1.5 text-[10.5px] font-bold text-muted-foreground"
                >
                  Refuser
                </Pressable>
              </div>
            ))}
            {riseQueue.length === 0 && (
              <p className="text-[11.5px] text-muted-foreground">Aucune demande pour le moment.</p>
            )}
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}

function BarItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Pressable
      onClick={onClick}
      className="flex min-w-0 flex-1 flex-col items-center gap-[3px] text-white"
    >
      {icon}
      <span className="text-[8.5px] font-semibold text-white/80">{label}</span>
    </Pressable>
  );
}

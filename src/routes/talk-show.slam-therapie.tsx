import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  Crown,
  Flag,
  Gift,
  LogOut,

  Heart,
  ListOrdered,
  MessageCircle,
  MoreHorizontal,
  Mic,
  Music2,
  Send,
  Share2,
  Shield,
  Smile,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Avatar, Pressable } from "@/components/zembo/ui";
import { ZemboIcon } from "@/components/zembo/ZemboMark";
import stage from "@/assets/zembo-slam-stage.png";

export const Route = createFileRoute("/talk-show/slam-therapie")({
  head: () => ({
    meta: [
      { title: "Slam Thérapie en direct — Zembo" },
      {
        name: "description",
        content:
          "Slam Thérapie sur Zembo : écoute Moussa slamer en direct, réagis, envoie des cadeaux et rejoins la scène ouverte.",
      },
      { property: "og:title", content: "Slam Thérapie en direct — Zembo" },
      {
        property: "og:description",
        content: "Des mots pour guérir : la scène ouverte de slam en direct sur Zembo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SlamTherapieLive,
});

type Msg = { id: number; user: string; text: string; tint: string; me?: boolean };

const TINTS = [
  "text-[oklch(0.78_0.13_85)]",
  "text-[oklch(0.75_0.15_300)]",
  "text-[oklch(0.75_0.14_160)]",
  "text-[oklch(0.75_0.14_250)]",
  "text-[oklch(0.72_0.17_350)]",
];

const INITIAL: Msg[] = [
  { id: 1, user: "Sarah", text: "Waaaw 😍 tellement puissant !", tint: TINTS[4]! },
  { id: 2, user: "Kevin", text: "Les mots touchent l'âme 🙏", tint: TINTS[3]! },
  { id: 3, user: "Aïssatou", text: "Tu as du talent ! 🔥", tint: TINTS[0]! },
  { id: 4, user: "Lina", text: "Ça me parle énormément… ❤️", tint: TINTS[1]! },
  { id: 5, user: "Yann", text: "Respect ! 👏", tint: TINTS[2]! },
  { id: 6, user: "Fatou", text: "Zembo c'est une vraie famille 🤍", tint: TINTS[1]! },
];

const AUTO: Array<[string, string]> = [
  ["Momo", "Cette strophe… 😮‍💨"],
  ["Nadia", "J'ai la chair de poule ✨"],
  ["Ben", "Vas-y Moussa 🔥"],
  ["Leïla", "Merci pour ces mots 🤍"],
  ["QueenVee", "On guérit en écoutant 🙏"],
];

const QUEUE = [
  { n: 1, name: "Sarah", title: "Je me suis choisie", music: "🎸 Guitare", time: "01:00" },
  { n: 2, name: "Kevin", title: "Père absent", music: "〰 Émotion", time: "03:00" },
  { n: 3, name: "Aïssatou", title: "Ma renaissance", music: "🥁 Afro douce", time: "01:00" },
];

const GIFTS = [
  { emoji: "🌹", name: "Rose", cost: 5 },
  { emoji: "👏", name: "Applaudissements", cost: 10 },
  { emoji: "🔥", name: "Flamme", cost: 20 },
  { emoji: "💎", name: "Diamant", cost: 50 },
  { emoji: "👑", name: "Couronne", cost: 100 },
  { emoji: "🎤", name: "Micro d'or", cost: 250 },
  { emoji: "🦋", name: "Papillon", cost: 30 },
  { emoji: "🤍", name: "Cœur pur", cost: 15 },
  { emoji: "🚀", name: "Fusée", cost: 500 },
];

const ZEM_AMOUNTS = [50, 100, 250, 500, 1000, 2500];

const TOTAL = 180;

const tap = () => navigator.vibrate?.(15);

function SlamTherapieLive() {
  const [msgs, setMsgs] = useState<Msg[]>(INITIAL);
  const [draft, setDraft] = useState("");
  const [left, setLeft] = useState(167);
  const [likes, setLikes] = useState(4200);
  const [hearts, setHearts] = useState<number[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [ended, setEnded] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [sheet, setSheet] = useState<"share" | "gift" | "zems" | "menu" | null>(null);
  const [giftFly, setGiftFly] = useState<{ id: number; emoji: string } | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const seq = useRef(100);


  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [msgs]);

  useEffect(() => {
    const t = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          setEnded(true);
          setTimeout(() => {
            setEnded(false);
            setLeft(TOTAL);
          }, 3200);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      const [user, text] = AUTO[Math.floor(Math.random() * AUTO.length)]!;
      seq.current += 1;
      const id = seq.current;
      setMsgs((m) => [...m.slice(-20), { id, user, text, tint: TINTS[id % TINTS.length]! }]);
    }, 3400);
    return () => clearInterval(t);
  }, []);

  const showToast = (t: string) => {
    setToast(t);
    setTimeout(() => setToast(null), 2000);
  };

  const like = () => {
    tap();
    setLikes((l) => l + 1);
    seq.current += 1;
    const id = seq.current;
    setHearts((h) => [...h.slice(-8), id]);
    setTimeout(() => setHearts((h) => h.filter((x) => x !== id)), 1700);
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    tap();
    seq.current += 1;
    setMsgs((m) => [
      ...m.slice(-20),
      { id: seq.current, user: "Deena", text, tint: "text-gold", me: true },
    ]);
    setDraft("");
  };

  const pushSystem = (text: string) => {
    seq.current += 1;
    setMsgs((m) => [
      ...m.slice(-20),
      { id: seq.current, user: "Deena", text, tint: "text-gold", me: true },
    ]);
  };

  const sendGift = (g: { emoji: string; name: string; cost: number }) => {
    tap();
    setSheet(null);
    const id = Date.now();
    setGiftFly({ id, emoji: g.emoji });
    setTimeout(() => setGiftFly(null), 1800);
    pushSystem(`a envoyé ${g.emoji} ${g.name}`);
    showToast(`${g.name} envoyé · ${g.cost} Zems`);
  };

  const sendZems = (amount: number) => {
    tap();
    setSheet(null);
    pushSystem(`a envoyé ${amount} Zems ✨`);
    showToast(`${amount} Zems envoyés à Moussa ✨`);
  };

  const focusChat = () => {
    tap();
    inputRef.current?.focus();
  };



  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  const ratio = left / TOTAL;
  const urgent = left <= 10;

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      {/* ── DÉCOR PLEIN ÉCRAN ── */}
      <img
        src={stage}
        alt="Moussa slame sur la scène Slam Thérapie de Zembo"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[34%] bg-gradient-to-b from-black/85 via-black/45 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* EN-TÊTE */}
      <div className="absolute inset-x-0 top-0 px-3 pt-[max(10px,env(safe-area-inset-top))]">
        <div className="flex items-start gap-2">
          <ZemboIcon size={26} />
          <div className="min-w-0 flex-1">
            <p
              className="truncate text-[19px] leading-none text-gold"
              style={{ fontFamily: "'Brush Script MT', cursive" }}
            >
              Slam Thérapie
            </p>
            <p className="mt-[3px] text-[8.5px] font-semibold tracking-[0.18em] text-white/70">
              DES MOTS POUR GUÉRIR
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 rounded-md bg-[oklch(0.55_0.22_25)] px-1.5 py-[2px] text-[9px] font-extrabold text-white">
                <span className="h-[5px] w-[5px] rounded-full bg-white" /> LIVE
              </span>
              <span className="flex items-center gap-1 rounded-md bg-black/50 px-1.5 py-[2px] text-[9px] font-bold text-white/90 backdrop-blur">
                <Users size={10} /> 1.2K
              </span>
              <Pressable
                onClick={() => {
                  tap();
                  setSheet("menu");
                }}

                className="grid h-7 w-7 place-items-center rounded-full bg-white/12 text-white/90 backdrop-blur"
                aria-label="Plus d'options"
              >
                <MoreHorizontal size={16} />
              </Pressable>
            </div>
            <Pressable
              onClick={() => {
                tap();
                setDrawer(true);
              }}
              className="flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[10.5px] font-bold text-white/90 ring-1 ring-gold/40 backdrop-blur"
              aria-label="Ouvrir la file d'attente"
            >
              <ListOrdered size={12} className="text-gold" /> File d'attente (3)
            </Pressable>
          </div>
        </div>

        {/* BLOC SUR SCÈNE */}
        <div className="mt-1.5 flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <span className="inline-block rounded-md bg-gold px-2 py-[2px] text-[8.5px] font-extrabold tracking-wide text-black">
              SUR SCÈNE
            </span>
            <p className="mt-1 text-[20px] leading-none font-extrabold text-white drop-shadow">
              Moussa
            </p>
            <p className="mt-[3px] text-[11px] italic text-white/85">Les blessures invisibles</p>
            <Pressable
              onClick={() => {
                tap();
                showToast("Musique : Renaissance (Piano)");
              }}
              className="mt-1.5 flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold text-white/90 backdrop-blur"
            >
              <Music2 size={11} className="text-gold" /> Renaissance (Piano)
              <ChevronRight size={12} className="text-white/60" />
            </Pressable>
          </div>

          {/* CHRONO */}
          <div className="relative grid h-[64px] w-[64px] shrink-0 place-items-center">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
              <circle cx="50" cy="50" r="44" fill="rgba(0,0,0,0.55)" />
              <circle cx="50" cy="50" r="44" stroke="rgba(255,255,255,0.16)" strokeWidth="6" fill="none" />
              <circle
                cx="50"
                cy="50"
                r="44"
                stroke={urgent ? "oklch(0.62 0.23 25)" : "oklch(0.82 0.15 85)"}
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={2 * Math.PI * 44}
                strokeDashoffset={2 * Math.PI * 44 * (1 - ratio)}
              />
            </svg>
            <div className={urgent ? "text-center animate-pulse" : "text-center"}>
              <p className="text-[16px] leading-none font-extrabold text-white">
                {mm}:{ss}
              </p>
              <p className="text-[8.5px] text-white/60">/ 03:00</p>
            </div>
          </div>

        </div>
      </div>

      {/* VIGNETTE HÔTE — CAMÉRA LIVE (picture-in-picture) */}
      <div className="absolute right-2 top-[150px] w-[100px] overflow-hidden rounded-2xl ring-1 ring-gold/60 shadow-[0_8px_24px_rgba(0,0,0,0.55)]">
        <div className="relative h-[130px] w-full bg-gradient-to-b from-[oklch(0.28_0.03_60)] to-[oklch(0.12_0.02_60)]">
          <div className="grid h-full w-full place-items-center">
            <Avatar name="Deena" size={54} ring />
          </div>
          <span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-md bg-[oklch(0.55_0.22_25)] px-1.5 py-[1px] text-[7.5px] font-extrabold text-white">
            <span className="h-[4px] w-[4px] rounded-full bg-white" /> CAM
          </span>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-1.5 pb-1.5 pt-3">
            <p className="flex items-center justify-center gap-1 text-[10px] font-bold text-white">
              <Crown size={9} className="text-gold" /> Deena
            </p>
            <p className="text-center text-[8.5px] text-white/65">Hôte</p>
          </div>
        </div>
      </div>


      {/* COLONNE D'ACTIONS */}
      <div className="absolute right-2 bottom-[112px] flex flex-col items-center gap-2">
        <Pressable onClick={like} className="flex flex-col items-center" aria-label="J'aime">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white/14 backdrop-blur">
            <Heart size={20} className="fill-[oklch(0.6_0.23_20)] text-[oklch(0.6_0.23_20)]" />
          </span>
          <span className="mt-[2px] text-[9.5px] font-bold text-white/90">
            {(likes / 1000).toFixed(1)}K
          </span>
        </Pressable>
        <Pressable
          onClick={focusChat}
          className="flex flex-col items-center"
          aria-label="Commentaires"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white/14 backdrop-blur">
            <MessageCircle size={19} className="text-white" />
          </span>
          <span className="mt-[2px] text-[9.5px] font-bold text-white/90">286</span>
        </Pressable>
        <Pressable
          onClick={() => {
            tap();
            setSheet("share");
          }}
          className="flex flex-col items-center"
          aria-label="Partager"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white/14 backdrop-blur">
            <Share2 size={18} className="text-white" />
          </span>
        </Pressable>
        <Pressable
          onClick={() => {
            tap();
            setSheet("gift");
          }}
          className="flex flex-col items-center"
          aria-label="Cadeau"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white/14 backdrop-blur">
            <Gift size={19} className="text-gold" />
          </span>
        </Pressable>
        <Pressable
          onClick={() => {
            tap();
            setSheet("zems");
          }}
          className="flex flex-col items-center"
          aria-label="Envoyer des Zems"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gold font-extrabold text-black">
            Z
          </span>
          <span className="mt-[2px] max-w-[46px] text-center text-[8.5px] leading-tight font-bold text-white/90">
            Zems
          </span>
        </Pressable>


        {/* cœurs animés */}
        <div className="pointer-events-none absolute right-3 bottom-[40px]">
          <AnimatePresence>
            {hearts.map((h) => (
              <motion.span
                key={h}
                initial={{ opacity: 0, y: 0, scale: 0.6 }}
                animate={{ opacity: [0, 1, 1, 0], y: -220, scale: 1, x: (h % 3) * 12 - 12 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.6, ease: "easeOut" }}
                className="absolute text-[22px]"
              >
                ❤️
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* CHAT EN SURIMPRESSION — monte jusqu'au milieu puis s'estompe */}
      <div
        className="absolute bottom-[62px] left-2 w-[62%]"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 16%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 16%, black 100%)",
        }}
      >
        <div className="app-scroll no-scrollbar flex max-h-[44vh] flex-col gap-1.5">
          {msgs.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-1.5 rounded-xl bg-black/35 px-2 py-1 backdrop-blur-sm"
            >
              <Avatar name={m.user} size={20} ring={m.me === true} />
              <p className="min-w-0 text-[11.5px] leading-snug text-white/90">
                <span className={`font-bold ${m.tint}`}>{m.user}</span>{" "}
                <span className="break-words">{m.text}</span>
              </p>
            </motion.div>
          ))}
          <div ref={endRef} />
        </div>
      </div>

      {/* SAISIE */}
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 px-3 pt-2 pb-[max(8px,env(safe-area-inset-bottom))]">
        <input
          ref={inputRef}

          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Écris un message…"
          className="min-w-0 flex-1 rounded-full bg-black/50 px-3 py-2 text-[13px] text-white ring-1 ring-white/15 backdrop-blur placeholder:text-white/50 outline-none"
        />
        <Pressable
          onClick={() => setDraft((d) => d + "😊")}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black/50 text-white/80 ring-1 ring-white/15 backdrop-blur"
          aria-label="Emoji"
        >
          <Smile size={17} />
        </Pressable>
        <Pressable
          onClick={send}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold text-black"
          aria-label="Envoyer"
        >
          <Send size={16} />
        </Pressable>
      </div>

      {/* FIN DE PERFORMANCE */}
      <AnimatePresence>
        {ended && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-x-6 top-[42%] rounded-2xl bg-black/80 px-4 py-3 text-center ring-1 ring-gold/50 backdrop-blur"
          >
            <p className="text-[15px] font-extrabold text-gold">👏 MERCI MOUSSA</p>
            <p className="mt-1 text-[12px] text-white/80">Ta performance est terminée</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TIROIR : SCÈNE OUVERTE ── */}
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawer(false)}
              className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              className="absolute inset-y-0 right-0 z-50 flex w-[88%] flex-col bg-[oklch(0.09_0.01_60)] ring-1 ring-white/10"
            >
              <div className="flex items-center gap-2 border-b border-white/8 px-3 py-3 pt-[max(12px,env(safe-area-inset-top))]">
                <Mic size={15} className="text-gold" />
                <p className="min-w-0 flex-1 truncate text-[13px] font-extrabold text-foreground">
                  Slam Thérapie — Scène ouverte
                </p>
                <Pressable
                  onClick={() => setDrawer(false)}
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/80"
                  aria-label="Fermer le tiroir"
                >
                  <X size={16} />
                </Pressable>
              </div>

              <div className="app-scroll no-scrollbar min-h-0 flex-1 px-3 pt-3 pb-[24px]">
                <p className="text-[10px] font-bold tracking-[0.14em] text-muted-foreground">
                  SUR SCÈNE
                </p>
                <div className="mt-1.5 flex items-center gap-2.5 rounded-2xl bg-white/[0.05] p-2.5 ring-1 ring-gold/30">
                  <Avatar name="Moussa" size={38} ring />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-bold text-foreground">Moussa</p>
                    <p className="truncate text-[11.5px] italic text-muted-foreground">
                      Les blessures invisibles
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[11px] text-muted-foreground">🎹 Piano</p>
                    <p className="text-[11px] font-bold text-gold">03:00</p>
                  </div>
                </div>

                <p className="mt-4 text-[10px] font-bold tracking-[0.14em] text-muted-foreground">
                  À SUIVRE (3)
                </p>
                <div className="mt-1.5 flex flex-col gap-1.5">
                  {QUEUE.map((q) => (
                    <div
                      key={q.n}
                      className="flex items-center gap-2.5 rounded-2xl bg-white/[0.035] p-2.5"
                    >
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold/15 text-[11px] font-extrabold text-gold">
                        {q.n}
                      </span>
                      <Avatar name={q.name} size={30} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12.5px] font-bold text-foreground">{q.name}</p>
                        <p className="truncate text-[11px] italic text-muted-foreground">
                          {q.title}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-[10.5px] text-muted-foreground">{q.music}</p>
                        {q.time && <p className="text-[10.5px] font-bold text-gold/80">{q.time}</p>}
                      </div>
                    </div>
                  ))}
                </div>
                <Pressable
                  onClick={() => {
                    tap();
                    showToast("Bientôt : toute la file d'attente");
                  }}
                  className="mt-2 flex w-full items-center justify-center gap-1 rounded-xl bg-white/[0.05] py-2 text-[12px] font-bold text-foreground"
                >
                  Voir toute la file (5) <ChevronRight size={14} />
                </Pressable>

                <div className="mt-4 rounded-2xl bg-gradient-to-br from-gold/15 to-transparent p-3 ring-1 ring-gold/25">
                  <p className="text-[13px] font-extrabold text-foreground">Envie de slamer ?</p>
                  <p className="mt-1 text-[11.5px] text-muted-foreground">
                    Partage ton texte avec la communauté.
                  </p>
                  <Pressable
                    onClick={() => {
                      tap();
                      showToast("Bientôt : configure ton passage");
                    }}
                    className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-gold py-2.5 text-[13px] font-extrabold text-black"
                  >
                    <Mic size={15} /> Demander à slamer
                  </Pressable>
                </div>

                <div className="mt-3 rounded-2xl bg-white/[0.035] p-3">
                  <p className="flex items-center gap-1.5 text-[12.5px] font-extrabold text-foreground">
                    <Shield size={14} className="text-gold" /> Règles de la scène
                  </p>
                  <ul className="mt-1.5 space-y-1 text-[11.5px] text-muted-foreground">
                    <li>✓ Respect</li>
                    <li>✓ Zéro jugement</li>
                    <li>✓ 1 ou 3 minutes uniquement</li>
                    <li>✓ Des mots pour guérir ✨</li>
                  </ul>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── CADEAU QUI S'ENVOLE ── */}
      <AnimatePresence>
        {giftFly && (
          <motion.div
            key={giftFly.id}
            initial={{ opacity: 0, scale: 0.4, y: 40 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.4, 1.6, 1.4, 1.2], y: -120 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.7, ease: "easeOut" }}
            className="pointer-events-none absolute bottom-[38%] left-1/2 z-[55] -translate-x-1/2 text-[64px]"
          >
            {giftFly.emoji}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FEUILLES ── */}
      <AnimatePresence>
        {sheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSheet(null)}
              className="absolute inset-0 z-[58] bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              className="absolute inset-x-0 bottom-0 z-[59] rounded-t-3xl bg-[oklch(0.09_0.01_60)] px-4 pt-3 pb-[max(16px,env(safe-area-inset-bottom))] ring-1 ring-white/10"
            >
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20" />

              {sheet === "share" && (
                <>
                  <p className="text-[15px] font-extrabold text-foreground">Partager le live</p>
                  <div className="mt-3 flex flex-col gap-1.5">
                    {[
                      { icon: "🔗", label: "Copier le lien", t: "Lien du live copié" },
                      { icon: "💬", label: "Envoyer en message", t: "Partagé en message" },
                      { icon: "📲", label: "Partager sur WhatsApp", t: "Partagé sur WhatsApp" },
                      { icon: "📸", label: "Ajouter à ma story", t: "Ajouté à ta story" },
                    ].map((o) => (
                      <Pressable
                        key={o.label}
                        onClick={() => {
                          tap();
                          setSheet(null);
                          showToast(o.t);
                        }}
                        className="flex items-center gap-3 rounded-2xl bg-white/[0.05] px-3 py-3 text-[13px] font-semibold text-foreground"
                      >
                        <span className="text-[18px]">{o.icon}</span> {o.label}
                      </Pressable>
                    ))}
                  </div>
                </>
              )}

              {sheet === "gift" && (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-[15px] font-extrabold text-foreground">Offrir un cadeau</p>
                    <p className="text-[12px] font-bold text-gold">Solde : 3 250 Z</p>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {GIFTS.map((g) => (
                      <Pressable
                        key={g.name}
                        onClick={() => sendGift(g)}
                        className="flex flex-col items-center gap-0.5 rounded-2xl bg-white/[0.05] py-2.5 ring-1 ring-white/8"
                      >
                        <span className="text-[26px]">{g.emoji}</span>
                        <span className="text-[10px] font-semibold text-foreground">{g.name}</span>
                        <span className="text-[10px] font-bold text-gold">{g.cost} Z</span>
                      </Pressable>
                    ))}
                  </div>
                </>
              )}

              {sheet === "zems" && (
                <>
                  <p className="text-[15px] font-extrabold text-foreground">
                    Envoyer des Zems à Moussa
                  </p>
                  <p className="mt-1 text-[11.5px] text-muted-foreground">
                    Soutiens sa performance — Solde : 3 250 Z
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {ZEM_AMOUNTS.map((a) => (
                      <Pressable
                        key={a}
                        onClick={() => sendZems(a)}
                        className="grid place-items-center rounded-2xl bg-gradient-to-br from-gold/25 to-transparent py-3 ring-1 ring-gold/30"
                      >
                        <span className="text-[15px] font-extrabold text-gold">{a} Z</span>
                      </Pressable>
                    ))}
                  </div>
                </>
              )}

              {sheet === "menu" && (
                <div className="flex flex-col gap-1.5">
                  {[
                    { icon: <Shield size={16} className="text-gold" />, label: "Règles de la scène", t: "Règles : respect, zéro jugement, 1 ou 3 minutes" },
                    { icon: <Flag size={16} className="text-white/80" />, label: "Signaler", t: "Signalement envoyé à la modération" },
                    { icon: <LogOut size={16} className="text-[oklch(0.65_0.2_25)]" />, label: "Quitter le live", t: "À bientôt sur Zembo 🤍" },
                  ].map((o) => (
                    <Pressable
                      key={o.label}
                      onClick={() => {
                        tap();
                        setSheet(null);
                        showToast(o.t);
                      }}
                      className="flex items-center gap-3 rounded-2xl bg-white/[0.05] px-3 py-3 text-[13px] font-semibold text-foreground"
                    >
                      {o.icon} {o.label}
                    </Pressable>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>



      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="pointer-events-none absolute bottom-[70px] left-1/2 z-[60] -translate-x-1/2 rounded-full bg-black/85 px-3.5 py-2 text-[12px] font-semibold text-white ring-1 ring-white/12"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  CheckCircle2,
  Crown,
  Eye,
  Flag,
  Gift,
  Heart,
  HelpCircle,
  Lock,
  MessageCircle,
  Mic,
  MoreHorizontal,
  Send,
  Share2,
  Smile,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Avatar, Pressable } from "@/components/zembo/ui";
import { ZemboIcon } from "@/components/zembo/ZemboMark";
import decor from "@/assets/zembo-stand-live.png.asset.json";

export const Route = createFileRoute("/talk-show/stand")({
  head: () => ({
    meta: [
      { title: "Stand en direct — Zembo" },
      {
        name: "description",
        content:
          "Stand sur Zembo : Deena partage ses conseils en direct et répond aux questions du public. Partage, apprends, évolue.",
      },
      { property: "og:title", content: "Stand en direct — Zembo" },
      {
        property: "og:description",
        content: "Une mini-masterclass en direct : l'hôte transmet et répond à vos questions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StandLive,
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
  { id: 1, user: "Sarah", text: "Tellement vrai ! Merci 🙏", tint: TINTS[4]! },
  { id: 2, user: "Kevin", text: "Tu expliques super bien 👏", tint: TINTS[3]! },
  { id: 3, user: "Aïssatou", text: "J'ai besoin de ce genre de conseil ❤️", tint: TINTS[0]! },
  { id: 4, user: "Lina", text: "Merci pour cette vidéo, ça m'aide beaucoup !", tint: TINTS[1]! },
  { id: 5, user: "Yann", text: "Hâte d'entendre les autres questions 👌", tint: TINTS[2]! },
  { id: 6, user: "Fatou", text: "Une vraie source d'inspiration ! ✨", tint: TINTS[1]! },
];

const AUTO: Array<[string, string]> = [
  ["Momo", "Je note tout 📝"],
  ["Nadia", "Ça me parle énormément…"],
  ["Ben", "Merci Deena 🙌"],
  ["Leïla", "Trop utile ce live ✨"],
  ["QueenVee", "On évolue ensemble 🤍"],
];

type Q = { id: number; name: string; ago: string; text: string };

const PENDING0: Q[] = [
  {
    id: 1,
    name: "Sarah",
    ago: "Il y a 2 min",
    text: "Comment faire pour reprendre confiance en soi après une relation toxique ?",
  },
  {
    id: 2,
    name: "Kevin",
    ago: "Il y a 5 min",
    text: "Quels sont tes conseils pour rester motivé quand on a l'impression de stagner ?",
  },
  { id: 3, name: "Aïssatou", ago: "Il y a 8 min", text: "Comment gérer la peur du regard des autres ?" },
  {
    id: 4,
    name: "Lina",
    ago: "Il y a 10 min",
    text: "Quels sont les signes qu'on manque de confiance en soi ?",
  },
  {
    id: 5,
    name: "Yann",
    ago: "Il y a 12 min",
    text: "As-tu une routine ou des exercices à conseiller pour se sentir mieux au quotidien ?",
  },
  { id: 6, name: "Fatou", ago: "Il y a 14 min", text: "Comment poser ses limites sans culpabiliser ?" },
  { id: 7, name: "Momo", ago: "Il y a 15 min", text: "Est-ce que la confiance ça se travaille vraiment ?" },
  { id: 8, name: "Nadia", ago: "Il y a 17 min", text: "Comment sortir de la comparaison sur les réseaux ?" },
  { id: 9, name: "Ben", ago: "Il y a 19 min", text: "Que faire quand la peur d'échouer paralyse ?" },
  { id: 10, name: "Leïla", ago: "Il y a 21 min", text: "Comment se relever après un gros échec ?" },
  { id: 11, name: "QueenVee", ago: "Il y a 24 min", text: "Un livre à conseiller pour avancer ?" },
  { id: 12, name: "Karim", ago: "Il y a 26 min", text: "Comment garder confiance quand l'entourage doute ?" },
];

const ANSWERED0: Q[] = [
  { id: 101, name: "Awa", ago: "Il y a 28 min", text: "Comment commencer quand on a peur ?" },
  { id: 102, name: "Idriss", ago: "Il y a 30 min", text: "La confiance vient-elle avant l'action ?" },
  { id: 103, name: "Chloé", ago: "Il y a 32 min", text: "Comment arrêter de tout remettre à demain ?" },
  { id: 104, name: "Samir", ago: "Il y a 34 min", text: "Comment gérer le syndrome de l'imposteur ?" },
  { id: 105, name: "Mariam", ago: "Il y a 36 min", text: "Faut-il tout pardonner pour avancer ?" },
  { id: 106, name: "Tom", ago: "Il y a 38 min", text: "Comment reprendre une routine de sport ?" },
  { id: 107, name: "Bintou", ago: "Il y a 41 min", text: "Comment mieux dire non au travail ?" },
  { id: 108, name: "Elias", ago: "Il y a 44 min", text: "Est-ce grave de recommencer à zéro ?" },
];

const IGNORED0: Q[] = [
  { id: 201, name: "Anonyme", ago: "Il y a 12 min", text: "Question hors sujet" },
  { id: 202, name: "Invité", ago: "Il y a 20 min", text: "Message répété plusieurs fois" },
];

const GIFTS = [
  { emoji: "🌹", name: "Rose", cost: 5 },
  { emoji: "👏", name: "Applaudissements", cost: 10 },
  { emoji: "🔥", name: "Flamme", cost: 20 },
  { emoji: "💎", name: "Diamant", cost: 50 },
  { emoji: "👑", name: "Couronne", cost: 100 },
  { emoji: "🎤", name: "Micro d'or", cost: 250 },
];

const ZEM_AMOUNTS = [50, 100, 250, 500, 1000, 2500];

const EMOJIS = ["😊", "🙏", "❤️", "🔥", "👏", "✨", "💡", "🤍"];

const tap = () => navigator.vibrate?.(15);

function StandLive() {
  const [host, setHost] = useState(true);
  const [msgs, setMsgs] = useState<Msg[]>(INITIAL);
  const [draft, setDraft] = useState("");
  const [likes, setLikes] = useState(4200);
  const [hearts, setHearts] = useState<number[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [sheet, setSheet] = useState<"share" | "gift" | "zems" | "menu" | null>(null);
  const [emojis, setEmojis] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [tab, setTab] = useState<"pending" | "answered" | "ignored">("pending");
  const [ask, setAsk] = useState(false);
  const [askText, setAskText] = useState("");
  const [pending, setPending] = useState<Q[]>(PENDING0);
  const [answered, setAnswered] = useState<Q[]>(ANSWERED0);
  const [ignored, setIgnored] = useState<Q[]>(IGNORED0);
  const [onAir, setOnAir] = useState<Q | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const seq = useRef(1000);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [msgs]);

  useEffect(() => {
    const t = setInterval(() => {
      const [user, text] = AUTO[Math.floor(Math.random() * AUTO.length)]!;
      seq.current += 1;
      const id = seq.current;
      setMsgs((m) => [...m.slice(-20), { id, user, text, tint: TINTS[id % TINTS.length]! }]);
    }, 3600);
    return () => clearInterval(t);
  }, []);

  const showToast = (t: string) => {
    setToast(t);
    setTimeout(() => setToast(null), 2200);
  };

  const showNotice = (t: string) => {
    setNotice(t);
    setTimeout(() => setNotice(null), 3200);
  };

  const like = () => {
    tap();
    setLikes((l) => l + 1);
    seq.current += 1;
    const id = seq.current;
    setHearts((h) => [...h.slice(-8), id]);
    setTimeout(() => setHearts((h) => h.filter((x) => x !== id)), 1700);
  };

  const push = (text: string, user = "Deena", me = true) => {
    seq.current += 1;
    setMsgs((m) => [
      ...m.slice(-20),
      { id: seq.current, user, text, tint: me ? "text-gold" : TINTS[0]!, me },
    ]);
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    tap();
    push(text);
    setDraft("");
    setEmojis(false);
  };

  const answerNow = (q: Q) => {
    tap();
    setDrawer(false);
    setPending((p) => p.filter((x) => x.id !== q.id));
    setOnAir(q);
    if (q.name === "Deena") showNotice("🎤 Deena répond à ta question");
  };

  const markAnswered = () => {
    if (!onAir) return;
    tap();
    setAnswered((a) => [onAir, ...a]);
    setOnAir(null);
    showToast("Question marquée comme répondue ✓");
  };

  const ignore = (q: Q) => {
    tap();
    setPending((p) => p.filter((x) => x.id !== q.id));
    setIgnored((i) => [q, ...i]);
  };

  const submitQuestion = () => {
    const text = askText.trim();
    if (!text) return;
    tap();
    seq.current += 1;
    setPending((p) => [
      { id: seq.current, name: "Deena", ago: "À l'instant", text },
      ...p,
    ]);
    setAskText("");
    setAsk(false);
    showToast("Ta question a été envoyée à Deena ✅");
  };

  const list = tab === "pending" ? pending : tab === "answered" ? answered : ignored;
  const tabIndex = tab === "pending" ? 0 : tab === "answered" ? 1 : 2;

  const counts = useMemo(
    () => ({ p: pending.length, a: answered.length, i: ignored.length }),
    [pending, answered, ignored],
  );

  return (
    <div className="relative h-full w-full overflow-hidden bg-black select-none">
      <img
        src={decor.url}
        alt="Deena partage ses conseils en direct sur la scène Stand de Zembo"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[34%] bg-gradient-to-b from-black/85 via-black/45 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-black/92 via-black/45 to-transparent" />

      {/* EN-TÊTE */}
      <div className="absolute inset-x-0 top-0 px-3 pt-[max(10px,env(safe-area-inset-top))]">
        <div className="flex items-start gap-2">
          <ZemboIcon size={26} />
          <div className="min-w-0 flex-1">
            <p
              className="truncate text-[20px] leading-none text-gold"
              style={{ fontFamily: "'Brush Script MT', cursive" }}
            >
              Stand
            </p>
            <p className="mt-[3px] text-[8.5px] font-semibold tracking-[0.18em] text-white/70">
              PARTAGE • APPRENDS • ÉVOLUE
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <Pressable
              onClick={() => {
                tap();
                setHost((h) => !h);
                setDrawer(false);
                setAsk(false);
              }}
              className="flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[9.5px] font-bold text-white/90 ring-1 ring-gold/40 backdrop-blur"
              aria-label="Changer de vue"
            >
              {host ? (
                <>
                  <Crown size={11} className="text-gold" /> Vue Hôte
                </>
              ) : (
                <>
                  <Eye size={11} className="text-gold" /> Vue Spectateur
                </>
              )}
            </Pressable>
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
        </div>

        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="flex items-center gap-1 rounded-md bg-[oklch(0.55_0.22_25)] px-1.5 py-[2px] text-[9px] font-extrabold text-white">
            <span className="h-[5px] w-[5px] rounded-full bg-white" /> LIVE
          </span>
          <span className="flex items-center gap-1 rounded-md bg-black/50 px-1.5 py-[2px] text-[9px] font-bold text-white/90 backdrop-blur">
            <Users size={10} /> 1.2K
          </span>
        </div>

        {/* BLOC TITRE */}
        <div className="mt-2 max-w-[74%]">
          <span className="inline-block rounded-md bg-gold px-2 py-[2px] text-[8.5px] font-extrabold tracking-wide text-black">
            STAND
          </span>
          <p className="mt-1 text-[21px] leading-[1.05] font-extrabold text-white drop-shadow">
            Reprendre confiance en soi
          </p>
          <p className="mt-[3px] text-[11px] italic text-white/85">
            Conseils, outils et vos questions
          </p>
          <div className="mt-2 flex items-center gap-2 rounded-full bg-black/55 px-2 py-1 backdrop-blur ring-1 ring-white/10">
            <Avatar name="Deena" size={26} ring />
            <div className="min-w-0">
              <p className="flex items-center gap-1 text-[11.5px] font-bold text-white">
                Deena <Crown size={10} className="text-gold" />
              </p>
              <p className="text-[9px] text-white/60">Hôte</p>
            </div>
            {!host && (
              <Pressable
                onClick={() => {
                  tap();
                  showToast("Tu suis Deena ✓");
                }}
                className="ml-1 rounded-full bg-gold px-2.5 py-1 text-[10px] font-extrabold text-black"
              >
                Suivre
              </Pressable>
            )}
          </div>
        </div>
      </div>

      {/* CARTE QUESTION EN DIRECT */}
      <AnimatePresence>
        {onAir && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="absolute left-3 right-3 z-30"
            style={{ top: "46%" }}
          >
            <div className="rounded-3xl bg-black/72 p-3 ring-1 ring-gold/50 backdrop-blur-md shadow-[0_12px_32px_rgba(0,0,0,0.55)]">
              <p className="flex items-center gap-1.5 text-[10px] font-extrabold tracking-[0.14em] text-gold">
                <HelpCircle size={12} /> {onAir.name.toUpperCase()} DEMANDE
              </p>
              <p className="mt-1.5 text-[13.5px] leading-snug font-semibold text-white">
                « {onAir.text} »
              </p>
              {host && (
                <Pressable
                  onClick={markAnswered}
                  className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-gold py-2.5 text-[12.5px] font-extrabold text-black"
                >
                  <Check size={14} /> Question répondue
                </Pressable>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* COLONNE D'ACTIONS */}
      <div className="absolute right-2 bottom-[150px] z-20 flex flex-col items-center gap-2">
        <Pressable onClick={like} className="flex flex-col items-center" aria-label="J'aime">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white/14 backdrop-blur">
            <Heart size={20} className="fill-[oklch(0.6_0.23_20)] text-[oklch(0.6_0.23_20)]" />
          </span>
          <span className="mt-[2px] text-[9.5px] font-bold text-white/90">
            {(likes / 1000).toFixed(1)}K
          </span>
        </Pressable>
        <Pressable
          onClick={() => {
            tap();
            inputRef.current?.focus();
          }}
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
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gold text-[13px] font-extrabold text-black">
            Z
          </span>
          <span className="mt-[2px] text-[8.5px] font-bold text-white/90">Zems</span>
        </Pressable>

        <div className="pointer-events-none absolute right-3 bottom-[36px]">
          <AnimatePresence>
            {hearts.map((h) => (
              <motion.span
                key={h}
                initial={{ opacity: 0, y: 0, scale: 0.6 }}
                animate={{ opacity: [0, 1, 1, 0], y: -210, scale: 1.1, x: (h % 5) * 8 - 16 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.6, ease: "easeOut" }}
                className="absolute text-[20px]"
              >
                ❤️
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* BOUTON QUESTIONS */}
      <div className="absolute left-3 z-20 bottom-[150px]">
        {host ? (
          <Pressable
            onClick={() => {
              tap();
              setDrawer(true);
              setTab("pending");
            }}
            className="flex items-center gap-1.5 rounded-full bg-gold px-3 py-2 text-[12px] font-extrabold text-black shadow-[0_8px_20px_rgba(0,0,0,0.45)]"
            aria-label="Gérer les questions"
          >
            <HelpCircle size={14} /> Questions
            <span className="grid min-w-[20px] place-items-center rounded-full bg-black px-1.5 py-[1px] text-[10px] font-extrabold text-gold">
              {counts.p}
            </span>
          </Pressable>
        ) : (
          <Pressable
            onClick={() => {
              tap();
              setAsk(true);
            }}
            className="flex items-center gap-1.5 rounded-full bg-gold px-3 py-2 text-[12px] font-extrabold text-black shadow-[0_8px_20px_rgba(0,0,0,0.45)]"
            aria-label="Poser une question"
          >
            <HelpCircle size={14} /> Poser une question
          </Pressable>
        )}
      </div>

      {/* CHAT LIVE */}
      <div className="absolute inset-x-0 bottom-[64px] z-10 px-3">
        <div className="no-scrollbar max-h-[132px] w-[70%] overflow-y-auto pr-1">
          <div className="flex flex-col gap-1">
            {msgs.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-fit max-w-full rounded-2xl bg-black/45 px-2 py-1 backdrop-blur-[2px]"
              >
                <p className="text-[11px] leading-snug text-white/95">
                  <span className={`font-bold ${m.tint}`}>{m.user}</span>{" "}
                  <span className="text-white/90">{m.text}</span>
                </p>
              </motion.div>
            ))}
            <div ref={endRef} />
          </div>
        </div>

        {/* SAISIE */}
        <div className="mt-1.5 flex items-center gap-1.5">
          <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-full bg-black/55 px-3 py-2 ring-1 ring-white/12 backdrop-blur">
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
              placeholder="Écris un message…"
              className="min-w-0 flex-1 bg-transparent text-[12px] text-white placeholder:text-white/45 focus:outline-none"
            />
            <Pressable
              onClick={() => {
                tap();
                setEmojis((v) => !v);
              }}
              aria-label="Émojis"
              className="text-white/70"
            >
              <Smile size={16} />
            </Pressable>
          </div>
          <Pressable
            onClick={send}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold text-black"
            aria-label="Envoyer"
          >
            <Send size={16} />
          </Pressable>
        </div>

        <AnimatePresence>
          {emojis && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="mt-1.5 flex flex-wrap gap-1 rounded-2xl bg-black/70 p-2 backdrop-blur"
            >
              {EMOJIS.map((e) => (
                <Pressable
                  key={e}
                  onClick={() => {
                    tap();
                    setDraft((d) => d + e);
                  }}
                  className="grid h-8 w-8 place-items-center rounded-xl bg-white/8 text-[16px]"
                >
                  {e}
                </Pressable>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BANNIÈRE BAS */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-2 bg-black/70 px-3 py-2 pb-[max(8px,env(safe-area-inset-bottom))] backdrop-blur">
        <Mic size={12} className="shrink-0 text-gold" />
        <p className="min-w-0 flex-1 truncate text-[9.5px] font-semibold text-white/80">
          Stand — Des discussions qui font avancer.
        </p>
        <span className="flex items-center gap-1 truncate text-[8.5px] text-white/55">
          <Lock size={9} /> Respect • Bienveillance • Impact
        </span>
        <Pressable
          onClick={() => {
            tap();
            showToast("Signalement envoyé à la modération");
          }}
          aria-label="Signaler"
          className="shrink-0 text-white/60"
        >
          <Flag size={12} />
        </Pressable>
      </div>

      {/* FENÊTRE : POSER UNE QUESTION */}
      <AnimatePresence>
        {ask && !host && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAsk(false)}
              className="absolute inset-0 z-[60] bg-black/75 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="absolute inset-x-4 top-1/2 z-[61] -translate-y-1/2 rounded-3xl bg-[oklch(0.09_0.01_60)] p-4 ring-1 ring-gold/45"
            >
              <div className="flex items-center gap-2">
                <HelpCircle size={16} className="text-gold" />
                <p className="min-w-0 flex-1 text-[14px] font-extrabold text-foreground">
                  Poser une question
                </p>
                <Pressable
                  onClick={() => setAsk(false)}
                  aria-label="Fermer"
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/80"
                >
                  <X size={15} />
                </Pressable>
              </div>
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                Ta question est envoyée en privé à Deena. Elle choisit d'y répondre à l'antenne.
              </p>
              <textarea
                value={askText}
                onChange={(e) => setAskText(e.target.value)}
                rows={3}
                placeholder="Écris ta question…"
                className="mt-2.5 w-full resize-none rounded-2xl bg-white/[0.06] px-3 py-2.5 text-[12.5px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-gold/50"
              />
              <Pressable
                onClick={submitQuestion}
                className="mt-2 w-full rounded-2xl bg-gold py-2.5 text-[13px] font-extrabold text-black"
              >
                Envoyer
              </Pressable>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* TIROIR : GESTION DES QUESTIONS (HÔTE) */}
      <AnimatePresence>
        {drawer && host && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawer(false)}
              className="absolute inset-0 z-40 bg-black/55 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34, mass: 0.9 }}
              drag="x"
              dragDirectionLock
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{ left: 0, right: 0.9 }}
              onDragEnd={(_, info) => {
                if (info.offset.x > 60 || info.velocity.x > 300) setDrawer(false);
              }}
              className="absolute inset-y-0 right-0 z-50 flex w-[88%] touch-pan-y flex-col bg-[oklch(0.09_0.01_60)] shadow-[-16px_0_40px_rgba(0,0,0,0.55)] ring-1 ring-white/10"
            >
              <span className="pointer-events-none absolute left-1 top-1/2 h-12 w-1 -translate-y-1/2 rounded-full bg-white/20" />
              <div className="flex items-center gap-2 border-b border-white/8 px-3 py-3 pt-[max(12px,env(safe-area-inset-top))]">
                <HelpCircle size={16} className="shrink-0 text-gold" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-extrabold text-foreground">Questions</p>
                  <p className="truncate text-[10.5px] text-muted-foreground">
                    Gère les questions de ton live
                  </p>
                </div>
                <Pressable
                  onClick={() => setDrawer(false)}
                  aria-label="Fermer le tiroir"
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/80"
                >
                  <X size={16} />
                </Pressable>
              </div>

              {/* ONGLETS */}
              <div className="relative mx-3 mt-3 grid grid-cols-3 rounded-2xl bg-white/[0.05] p-1">
                <motion.span
                  className="absolute inset-y-1 w-[calc((100%-8px)/3)] rounded-xl bg-gold/18 ring-1 ring-gold/40"
                  animate={{ left: `calc(4px + ${tabIndex} * ((100% - 8px) / 3))` }}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
                {(
                  [
                    ["pending", "En attente", counts.p],
                    ["answered", "Répondues", counts.a],
                    ["ignored", "Ignorées", counts.i],
                  ] as const
                ).map(([k, label, n]) => (
                  <Pressable
                    key={k}
                    onClick={() => {
                      tap();
                      setTab(k);
                    }}
                    className={`relative z-10 truncate py-1.5 text-[10.5px] font-bold ${
                      tab === k ? "text-gold" : "text-muted-foreground"
                    }`}
                  >
                    {label} ({n})
                  </Pressable>
                ))}
              </div>

              <div className="app-scroll no-scrollbar min-h-0 flex-1 px-3 pt-3 pb-4">
                {list.length === 0 ? (
                  <p className="mt-8 text-center text-[12px] text-muted-foreground">
                    Aucune question ici pour l'instant.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {list.map((q) => (
                      <motion.div
                        key={q.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl bg-white/[0.05] p-2.5 ring-1 ring-white/8"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar name={q.name} size={30} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[12.5px] font-bold text-foreground">
                              {q.name}
                            </p>
                            <p className="truncate text-[10px] text-muted-foreground">{q.ago}</p>
                          </div>
                          {tab === "answered" && (
                            <CheckCircle2
                              size={16}
                              className="shrink-0 text-[oklch(0.72_0.16_150)]"
                            />
                          )}
                        </div>
                        <p className="mt-1.5 text-[12px] leading-snug text-white/85">{q.text}</p>
                        {tab === "pending" && (
                          <div className="mt-2 flex gap-1.5">
                            <Pressable
                              onClick={() => ignore(q)}
                              className="flex-1 rounded-xl bg-white/[0.07] py-2 text-[11.5px] font-bold text-white/70"
                            >
                              Ignorer
                            </Pressable>
                            <Pressable
                              onClick={() => answerNow(q)}
                              className="flex-1 rounded-xl bg-gold py-2 text-[11.5px] font-extrabold text-black"
                            >
                              Répondre
                            </Pressable>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}

                {tab === "pending" && pending.length > 0 && (
                  <Pressable
                    onClick={() => {
                      tap();
                      setPending([]);
                      showToast("Toutes les questions en attente supprimées");
                    }}
                    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-[oklch(0.28_0.08_25)] py-2.5 text-[12px] font-bold text-[oklch(0.85_0.1_25)]"
                  >
                    <Trash2 size={14} /> Tout supprimer
                  </Pressable>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* FEUILLES */}
      <AnimatePresence>
        {sheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSheet(null)}
              className="absolute inset-0 z-[70] bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              className="absolute inset-x-0 bottom-0 z-[71] rounded-t-3xl bg-[oklch(0.09_0.01_60)] p-4 pb-[max(16px,env(safe-area-inset-bottom))] ring-1 ring-white/10"
            >
              <span className="mx-auto mb-3 block h-1 w-10 rounded-full bg-white/20" />
              {sheet === "gift" && (
                <>
                  <p className="text-[14px] font-extrabold text-foreground">Envoyer un cadeau</p>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {GIFTS.map((g) => (
                      <Pressable
                        key={g.name}
                        onClick={() => {
                          tap();
                          setSheet(null);
                          push(`a envoyé ${g.emoji} ${g.name}`);
                          showToast(`${g.name} envoyé · ${g.cost} Zems`);
                        }}
                        className="rounded-2xl bg-white/[0.05] py-2.5 text-center"
                      >
                        <span className="block text-[22px]">{g.emoji}</span>
                        <span className="mt-1 block truncate text-[10.5px] font-bold text-foreground">
                          {g.name}
                        </span>
                        <span className="block text-[9.5px] text-gold">{g.cost} Zems</span>
                      </Pressable>
                    ))}
                  </div>
                </>
              )}
              {sheet === "zems" && (
                <>
                  <p className="text-[14px] font-extrabold text-foreground">Envoyer des Zems</p>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {ZEM_AMOUNTS.map((a) => (
                      <Pressable
                        key={a}
                        onClick={() => {
                          tap();
                          setSheet(null);
                          push(`a envoyé ${a} Zems ✨`);
                          showToast(`${a} Zems envoyés à Deena ✨`);
                        }}
                        className="rounded-2xl bg-white/[0.05] py-3 text-center text-[13px] font-extrabold text-gold"
                      >
                        {a}
                      </Pressable>
                    ))}
                  </div>
                </>
              )}
              {sheet === "share" && (
                <>
                  <p className="text-[14px] font-extrabold text-foreground">Partager ce Stand</p>
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {["WhatsApp", "Instagram", "TikTok", "Copier"].map((s) => (
                      <Pressable
                        key={s}
                        onClick={() => {
                          tap();
                          setSheet(null);
                          showToast(s === "Copier" ? "Lien copié ✓" : `Partagé sur ${s}`);
                        }}
                        className="rounded-2xl bg-white/[0.05] py-3 text-center text-[10.5px] font-bold text-foreground"
                      >
                        {s}
                      </Pressable>
                    ))}
                  </div>
                </>
              )}
              {sheet === "menu" && (
                <div className="flex flex-col gap-1.5">
                  {["Qualité vidéo", "Signaler le live", "Ne plus recommander", "Quitter le Stand"].map(
                    (o) => (
                      <Pressable
                        key={o}
                        onClick={() => {
                          tap();
                          setSheet(null);
                          showToast(o);
                        }}
                        className="rounded-2xl bg-white/[0.05] px-3 py-3 text-left text-[12.5px] font-bold text-foreground"
                      >
                        {o}
                      </Pressable>
                    ),
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* NOTIFICATION SPECTATEUR */}
      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="absolute left-3 right-3 top-[42%] z-[80] rounded-2xl bg-gold px-3 py-2 text-center text-[12px] font-extrabold text-black"
          >
            {notice}
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute left-1/2 bottom-[210px] z-[90] -translate-x-1/2 rounded-full bg-black/85 px-3.5 py-2 text-[11.5px] font-semibold text-white ring-1 ring-white/12 backdrop-blur"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

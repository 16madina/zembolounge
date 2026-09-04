import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Send, Smile } from "lucide-react";
import stage from "@/assets/zembo-face-a-face-stage.png";
import { BottomSheet } from "@/components/zembo/Sheet";
import { Pressable } from "@/components/zembo/ui";

export const Route = createFileRoute("/play_/face-a-face")({
  head: () => ({
    meta: [
      { title: "Face à Face — Zembo" },
      {
        name: "description",
        content:
          "Face à Face : répondez aux mêmes 20 questions et découvrez votre compatibilité en temps réel.",
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

const BLUE = "oklch(0.66 0.19 250)";
const PINK = "oklch(0.68 0.22 350)";
const GOLD = "oklch(0.85 0.14 86)";
const PANEL = "rgb(6,6,7)";

const ANSWERS = [
  { k: "A", label: "La confiance", top: "64.7%" },
  { k: "B", label: "La communication", top: "68.5%" },
  { k: "C", label: "La stabilité financière", top: "72.5%" },
  { k: "D", label: "La passion", top: "76.5%" },
];

/** Réponse (mock) de l'adversaire, question après question */
const OPPONENT = ["B", "A", "B", "C", "A"];

type Msg = { id: number; name: string; text: string; time: string; bot?: boolean };

const INITIAL_CHAT: Msg[] = [
  {
    id: 1,
    name: "Zembo",
    text: "Répondez sincèrement et bonne chance !",
    time: "21:30",
    bot: true,
  },
];

function Ring({ value }: { value: number }) {
  const r = 44;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
      <circle cx="50" cy="50" r={r} fill="none" stroke="oklch(0.24 0.01 60)" strokeWidth="6" />
      <motion.circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke={GOLD}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={c}
        animate={{ strokeDashoffset: c * (1 - value / 15) }}
        transition={{ duration: 0.4, ease: "linear" }}
      />
    </svg>
  );
}

function AnswerBlock({
  title,
  color,
  answer,
  style,
}: {
  title: string;
  color: string;
  answer: string | null;
  style: React.CSSProperties;
}) {
  return (
    <div
      className="absolute flex flex-col justify-center gap-1 rounded-2xl border px-3"
      style={{
        ...style,
        background: PANEL,
        borderColor: `color-mix(in oklab, ${color} 45%, transparent)`,
      }}
    >
      <p
        className="font-extrabold tracking-[0.08em] whitespace-nowrap uppercase"
        style={{ color, fontSize: "2.1cqw" }}
      >
        {title}
      </p>
      <motion.p
        key={answer ?? "wait"}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="truncate font-bold"
        style={{ color, fontSize: "2.8cqw" }}
      >
        {answer ? `✓ ${answer}` : "🔒 En attente…"}
      </motion.p>
    </div>
  );
}

function FaceAFace() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState(1);
  const [picked, setPicked] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(15);
  const [revealed, setRevealed] = useState(false);
  const [compat, setCompat] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(18 * 60 + 25);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [chat, setChat] = useState<Msg[]>(INITIAL_CHAT);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const oppKey = OPPONENT[(question - 1) % OPPONENT.length]!;
  const oppLabel = ANSWERS.find((a) => a.k === oppKey)?.label ?? "";
  const myLabel = ANSWERS.find((a) => a.k === picked)?.label ?? "";

  /* chrono principal + boucle de démo */
  useEffect(() => {
    if (revealed) {
      const t = setTimeout(() => {
        setRevealed(false);
        setPicked(null);
        setSeconds(15);
        setQuestion((q) => (q >= 20 ? 1 : q + 1));
      }, 2000);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      if (seconds <= 1) {
        setSeconds(0);
        setRevealed(true);
        setCompat((c) => {
          const base = c ?? 40;
          const match = picked === oppKey;
          return Math.min(85, Math.round(base + (match ? 11 : 5)));
        });
      } else {
        setSeconds((s) => s - 1);
      }
    }, 1000);
    return () => clearTimeout(t);
  }, [seconds, revealed, picked, oppKey]);

  /* temps restant cosmétique */
  useEffect(() => {
    const i = setInterval(() => setRemaining((r) => (r > 0 ? r - 1 : 0)), 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [chat]);

  const pick = (k: string) => {
    if (revealed || picked) return;
    setPicked(k);
    navigator.vibrate?.(15);
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const now = new Date();
    setChat((c) => [
      ...c,
      {
        id: Date.now(),
        name: "Deena",
        text,
        time: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
      },
    ]);
    setDraft("");
  };

  const mmss = `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`;
  const compatText = compat === null ? "–– %" : `${compat} %`;

  return (
    <div className="flex min-h-full flex-col bg-[oklch(0.03_0_0)]">
      {/* ===== Décor + overlays vivants ===== */}
      <div
        className="relative w-full shrink-0 select-none"
        style={{ containerType: "inline-size" }}
      >
        <img
          src={stage}
          alt="Plateau Face à Face — Deena contre Moussa"
          className="block w-full"
          draggable={false}
        />

        {/* ‹ Quitter */}
        <Pressable
          aria-label="Quitter le Face à Face"
          onClick={() => navigate({ to: "/play" })}
          whileTap={{ scale: 0.96 }}
          className="absolute rounded-full"
          style={{ left: "2%", top: "2.1%", width: "12.5%", height: "3.3%" }}
        />
        {/* Règles */}
        <Pressable
          aria-label="Règles du Face à Face"
          onClick={() => setRulesOpen(true)}
          whileTap={{ scale: 0.96 }}
          className="absolute rounded-full"
          style={{ left: "74.5%", top: "2.1%", width: "12.5%", height: "3.3%" }}
        />
        {/* ⋮ */}
        <Pressable
          aria-label="Plus d'options"
          onClick={() => setRulesOpen(true)}
          whileTap={{ scale: 0.96 }}
          className="absolute rounded-full"
          style={{ left: "92%", top: "2.1%", width: "6.5%", height: "3.3%" }}
        />

        {/* QUESTION n / 20 */}
        <div
          className="absolute flex items-center justify-center rounded-full border font-extrabold tracking-[0.08em] whitespace-nowrap"
          style={{
            fontSize: "2.7cqw",
            left: "38%",
            top: "12.7%",
            width: "21.5%",
            height: "2.7%",
            background: "rgb(4,4,5)",
            borderColor: "oklch(0.6 0.11 86 / 75%)",
            color: GOLD,
          }}
        >
          QUESTION {question} / 20
        </div>

        {/* Compatibilité sous les vidéos */}
        <div
          className="absolute flex items-center font-extrabold tracking-[0.08em] whitespace-nowrap text-white"
          style={{
            fontSize: "3.2cqw",
            left: "17.4%",
            top: "44.3%",
            width: "14%",
            height: "1.9%",
            background: PANEL,
          }}
        >
          {compatText}
        </div>
        {/* Jauge or */}
        <div
          className="absolute overflow-hidden rounded-full"
          style={{
            left: "57.7%",
            top: "45%",
            width: "25.7%",
            height: "0.85%",
            background: "oklch(0.28 0.03 86)",
          }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, oklch(0.6 0.12 86), oklch(0.9 0.14 88))" }}
            animate={{ width: `${((compat ?? 0) / 85) * 100}%` }}
            transition={{ type: "spring", stiffness: 60, damping: 18 }}
          />
        </div>

        {/* Les 4 réponses */}
        {ANSWERS.map((a) => {
          const isPicked = picked === a.k;
          return (
            <Pressable
              key={a.k}
              aria-label={`Répondre ${a.k} — ${a.label}`}
              onClick={() => pick(a.k)}
              whileTap={{ scale: 0.97 }}
              className="absolute rounded-full border transition-colors duration-200"
              style={{
                left: "13.8%",
                width: "72.8%",
                top: a.top,
                height: "3.5%",
                borderColor: isPicked ? GOLD : "transparent",
                background: isPicked ? "oklch(0.85 0.14 86 / 12%)" : "transparent",
                boxShadow: isPicked ? "0 0 16px -2px oklch(0.85 0.14 86 / 75%)" : undefined,
              }}
            />
          );
        })}

        {/* Blocs réponses */}
        <AnswerBlock
          title="Votre réponse"
          color={BLUE}
          answer={picked ? myLabel : null}
          style={{ left: "6.9%", top: "83%", width: "33.8%", height: "7.3%" }}
        />
        <AnswerBlock
          title="Réponse adversaire"
          color={PINK}
          answer={revealed ? oppLabel : null}
          style={{ left: "59%", top: "83%", width: "34.3%", height: "7.3%" }}
        />

        {/* Chrono 15 s */}
        <div
          className="absolute flex items-center justify-center rounded-full"
          style={{ left: "44%", top: "83.2%", width: "11%", height: "6.9%", background: PANEL }}
        >
          <Ring value={seconds} />
          <span className="absolute text-center leading-none">
            <span className="block font-extrabold text-white" style={{ fontSize: "5cqw" }}>
              {seconds}
            </span>
            <span className="block font-bold text-white/70" style={{ fontSize: "2cqw" }}>
              S
            </span>
          </span>
        </div>

        {/* Stats du bas : compatibilité + temps restant */}
        <div
          className="absolute flex items-center font-extrabold tracking-[0.06em] whitespace-nowrap text-white"
          style={{
            fontSize: "3.2cqw",
            left: "15.3%",
            top: "96.6%",
            width: "14%",
            height: "1.9%",
            background: PANEL,
          }}
        >
          {compatText}
        </div>
        <div
          className="absolute flex items-center font-extrabold whitespace-nowrap text-white"
          style={{
            fontSize: "3.7cqw",
            left: "79.5%",
            top: "94.9%",
            width: "14%",
            height: "2.1%",
            background: PANEL,
          }}
        >
          {mmss}
        </div>
      </div>

      {/* ===== Chat ===== */}
      <div className="flex flex-1 flex-col bg-[oklch(0.03_0_0)] px-3 pt-2">
        <div className="space-y-2.5">
          {chat.map((m) => (
            <div
              key={m.id}
              className="rounded-2xl border border-white/8 bg-[oklch(0.07_0.005_280)] px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <span
                  className="text-[12.5px] font-extrabold"
                  style={{ color: m.bot ? "oklch(0.68 0.2 285)" : GOLD }}
                >
                  {m.name}
                </span>
                {m.bot && (
                  <span className="rounded-md bg-[oklch(0.45_0.18_285)] px-1.5 py-[1px] text-[9px] font-extrabold text-white">
                    BOT
                  </span>
                )}
                <span className="ml-auto text-[10.5px] text-muted-foreground">{m.time}</span>
              </div>
              <p className="mt-1 text-[13px] leading-snug text-foreground/90">{m.text}</p>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="sticky bottom-0 z-10 mt-auto flex items-center gap-2 bg-[oklch(0.03_0_0)] py-3 pb-[max(env(safe-area-inset-bottom),12px)]"
        >
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-border bg-surface-2/60 px-3 py-2">
            <Smile size={16} className="shrink-0 text-muted-foreground" />
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Écrire un message…"
              className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-muted-foreground"
            />
          </div>
          <Pressable
            type="submit"
            aria-label="Envoyer"
            whileTap={{ scale: 0.96 }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/60 bg-gold-gradient"
          >
            <Send size={16} className="text-[oklch(0.16_0.02_60)]" />
          </Pressable>
        </form>
      </div>

      <BottomSheet open={rulesOpen} onClose={() => setRulesOpen(false)}>
        <div className="px-5 pt-2 pb-4">
          <h2 className="text-[16px] font-extrabold tracking-wide text-gold">
            RÈGLES DU FACE À FACE
          </h2>
          <p className="mt-3 text-[13.5px] leading-relaxed text-foreground/85">
            Répondez chacun aux mêmes 20 questions. Plus vos réponses se ressemblent, plus la
            compatibilité monte. À 85%+, vous pouvez choisir de vous connecter.
          </p>
        </div>
      </BottomSheet>
    </div>
  );
}

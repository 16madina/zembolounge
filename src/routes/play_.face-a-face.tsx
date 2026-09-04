import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CheckCircle2, Heart, HeartCrack, Lock, Sparkles } from "lucide-react";
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
const FINAL_SCORE = 87;

const ANSWERS = [
  { k: "A", label: "La confiance", top: "64.7%" },
  { k: "B", label: "La communication", top: "68.5%" },
  { k: "C", label: "La stabilité financière", top: "72.5%" },
  { k: "D", label: "La passion", top: "76.5%" },
];

/** Réponse (mock) de l'adversaire, question après question */
const OPPONENT = ["B", "A", "B", "C", "A"];


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
        className="flex items-center gap-1 truncate font-bold"
        style={{ color, fontSize: "2.8cqw" }}
      >
        {answer ? (
          <>
            <CheckCircle2 size={11} style={{ color }} />
            <span className="truncate">{answer}</span>
          </>
        ) : (
          <>
            <Lock size={10} style={{ color }} />
            <span>En attente…</span>
          </>
        )}
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [finished, setFinished] = useState(false);

  const oppKey = OPPONENT[(question - 1) % OPPONENT.length]!;
  const oppLabel = ANSWERS.find((a) => a.k === oppKey)?.label ?? "";
  const myLabel = ANSWERS.find((a) => a.k === picked)?.label ?? "";

  /* chrono principal + boucle de démo */
  useEffect(() => {
    if (finished) return;
    if (revealed) {
      const t = setTimeout(() => {
        if (question >= 20) {
          setCompat(FINAL_SCORE);
          setFinished(true);
          return;
        }
        setRevealed(false);
        setPicked(null);
        setSeconds(15);
        setQuestion((q) => q + 1);
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
          return Math.min(FINAL_SCORE, Math.round(base + (match ? 11 : 5)));
        });
      } else {
        setSeconds((s) => s - 1);
      }
    }, 1000);
    return () => clearTimeout(t);
  }, [seconds, revealed, picked, oppKey, question, finished]);

  /* temps restant cosmétique */
  useEffect(() => {
    if (finished) return;
    const i = setInterval(() => setRemaining((r) => (r > 0 ? r - 1 : 0)), 1000);
    return () => clearInterval(i);
  }, [finished]);

  const pick = (k: string) => {
    if (revealed || picked) return;
    setPicked(k);
    navigator.vibrate?.(15);
  };

  const mmss = `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`;
  const compatText = compat === null ? "–– %" : `${compat} %`;

  if (finished) {
    return (
      <ResultScreen
        score={compat ?? FINAL_SCORE}
        onQuit={() => navigate({ to: "/play" })}
        onRetry={() => navigate({ to: "/face-a-face" })}
      />
    );
  }

  return (
    <div className="flex min-h-full flex-col overflow-x-hidden bg-[oklch(0.03_0_0)]">
      {/* ===== Décor + overlays vivants ===== */}
      <div
        className="relative w-full max-w-full shrink-0 overflow-hidden select-none"
        style={{ containerType: "inline-size" }}
      >
        <img
          src={stage}
          alt="Plateau Face à Face — Deena contre Moussa"
          className="block w-full max-w-full"
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
          onClick={() => setMenuOpen(true)}
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

      <BottomSheet open={menuOpen} onClose={() => setMenuOpen(false)}>
        <div className="px-4 pt-2 pb-4">
          <Pressable
            onClick={() => {
              setMenuOpen(false);
              setCompat(FINAL_SCORE);
              setFinished(true);
            }}
            className="w-full rounded-2xl border border-gold/50 bg-gold/10 px-4 py-3 text-left text-[14px] font-bold text-gold"
          >
            Voir le résultat (démo)
          </Pressable>
          <Pressable
            onClick={() => {
              setMenuOpen(false);
              setRulesOpen(true);
            }}
            className="mt-2 w-full rounded-2xl border border-border bg-surface-2/60 px-4 py-3 text-left text-[14px] font-semibold text-foreground/90"
          >
            Règles du jeu
          </Pressable>
          <Pressable
            onClick={() => navigate({ to: "/play" })}
            className="mt-2 w-full rounded-2xl border border-border px-4 py-3 text-left text-[14px] font-semibold text-muted-foreground"
          >
            Quitter la partie
          </Pressable>
        </div>
      </BottomSheet>
    </div>
  );
}

function ResultScreen({
  score,
  onQuit,
  onRetry,
}: {
  score: number;
  onQuit: () => void;
  onRetry: () => void;
}) {
  const [step, setStep] = useState<"idle" | "waiting" | "done">("idle");
  const matched = score >= 85;

  useEffect(() => {
    if (step !== "waiting") return;
    const t = setTimeout(() => setStep("done"), 1500);
    return () => clearTimeout(t);
  }, [step]);

  if (!matched) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center overflow-x-hidden bg-[oklch(0.03_0_0)] px-7 text-center">
        <HeartCrack size={40} className="text-[oklch(0.6_0.16_20)]" />
        <h1 className="mt-4 text-[21px] leading-snug font-extrabold text-foreground">
          Malheureusement, vous n'êtes pas compatibles.
        </h1>
        <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
          La salle se ferme. Aucun accès au profil privé ni à la messagerie n'est créé.
        </p>
        <Pressable
          onClick={onRetry}
          className="mt-8 w-full rounded-full bg-gold-gradient py-3.5 text-[15px] font-extrabold text-[oklch(0.16_0.02_60)]"
        >
          Relancer
        </Pressable>
        <Pressable
          onClick={onQuit}
          className="mt-3 w-full rounded-full border border-border py-3 text-[14px] font-semibold text-muted-foreground"
        >
          Quitter
        </Pressable>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-full flex-col items-center justify-center overflow-hidden bg-[oklch(0.04_0.02_320)] px-6 text-center">
      {/* cœurs qui montent */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute"
          style={{ left: i % 2 ? `${86 + (i % 3) * 4}%` : `${3 + (i % 3) * 4}%`, bottom: -30, zIndex: 0 }}
          animate={{ y: [-0, -620], opacity: [0, 1, 0], scale: [0.7, 1.1] }}
          transition={{ duration: 6 + (i % 4), repeat: Infinity, delay: i * 0.6, ease: "easeOut" }}
        >
          <Heart size={16 + (i % 3) * 6} style={{ color: i % 2 ? PINK : GOLD }} fill="currentColor" />
        </motion.span>
      ))}
      <div
        className="pointer-events-none absolute h-72 w-72 rounded-full blur-[70px]"
        style={{ background: "oklch(0.6 0.2 340 / 35%)" }}
      />

      <motion.h1
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 16 }}
        className="relative z-10 flex items-center gap-2 text-[46px] leading-none font-extrabold tracking-tight"
      >
        <Sparkles size={30} className="text-gold" />
        <span className="text-gold-gradient">MATCH</span>
      </motion.h1>
      <p className="relative z-10 mt-3 text-[16px] font-bold text-foreground">
        Vous êtes compatibles à {score} % !
      </p>

      <div className="relative z-10 mt-8 flex items-end justify-center gap-6">
        {[
          { name: "Deena", tint: "oklch(0.65 0.18 320)" },
          { name: "Moussa", tint: BLUE },
        ].map((p) => (
          <div key={p.name} className="flex flex-col items-center">
            <motion.div
              animate={{ boxShadow: [`0 0 0 2px ${p.tint}`, `0 0 26px 4px ${p.tint}`] }}
              transition={{ duration: 1.6, repeat: Infinity, repeatType: "reverse" }}
              className="flex h-24 w-24 items-center justify-center rounded-full border border-white/15"
              style={{
                background: `linear-gradient(160deg, ${p.tint}, oklch(0.2 0.05 300))`,
              }}
            >
              <span className="text-[30px] font-extrabold text-white/90">{p.name.charAt(0)}</span>
            </motion.div>
            <span className="mt-2 text-[13.5px] font-extrabold text-foreground">{p.name}</span>
          </div>
        ))}
      </div>

      <div className="relative z-10 mt-9 w-full">
        {step === "idle" && (
          <Pressable
            onClick={() => {
              navigator.vibrate?.(15);
              setStep("waiting");
            }}
            className="w-full rounded-full bg-gold-gradient py-3.5 text-[15px] font-extrabold text-[oklch(0.16_0.02_60)]"
          >
            Se connecter
          </Pressable>
        )}
        <AnimatePresence>
          {step === "waiting" && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-full border border-gold/40 bg-gold/10 py-3.5 text-[14px] font-bold text-gold"
            >
              En attente de la réponse de Moussa…
            </motion.p>
          )}
          {step === "done" && (
            <motion.p
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 rounded-2xl border border-emerald/40 bg-emerald/10 px-4 py-3.5 text-left text-[13.5px] leading-relaxed font-bold text-emerald"
            >
              <CheckCircle2 size={18} className="shrink-0" />
              Connexion établie ! Retrouve Moussa dans Messages › Mes matchs
            </motion.p>
          )}
        </AnimatePresence>
        <Pressable
          onClick={onQuit}
          className="mt-3 w-full rounded-full border border-border py-3 text-[14px] font-semibold text-muted-foreground"
        >
          Quitter
        </Pressable>
      </div>
    </div>
  );
}


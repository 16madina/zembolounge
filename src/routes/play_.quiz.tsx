import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import stage from "@/assets/zembo-quiz-stage.png";
import { BottomSheet } from "@/components/zembo/Sheet";
import { Pressable } from "@/components/zembo/ui";

export const Route = createFileRoute("/play_/quiz")({
  head: () => ({
    meta: [
      { title: "Zembo Quiz en direct — Zembo" },
      {
        name: "description",
        content:
          "Zembo Quiz : séries de 5 questions, réponses secrètes, éliminations et classement en direct avec les spectateurs.",
      },
      { property: "og:title", content: "Zembo Quiz en direct — Zembo" },
      {
        property: "og:description",
        content: "Réponds avant la fin du chrono, reste en jeu et grimpe au classement.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Quiz,
});

/** Vraies réponses (boutons DOM, plus des zones devinées sur l'image) */
const ANSWERS = [
  { k: "A", label: "Accra", tint: "oklch(0.55 0.2 262)" },
  { k: "B", label: "Lagos", tint: "oklch(0.82 0.15 85)" },
  { k: "C", label: "Nairobi", tint: "oklch(0.62 0.22 305)" },
];
const CORRECT = "A";


const INITIAL_CHAT = [
  { id: 1, name: "Fatou", text: "Allez Deena ! 🔥", color: "oklch(0.72 0.2 320)" },
  { id: 2, name: "Momo", text: "Je pense que c'est Accra 🤔", color: "oklch(0.7 0.17 250)" },
  { id: 3, name: "Emma", text: "Bonne chance à tous ! 🎉", color: "oklch(0.75 0.15 155)" },
  { id: 4, name: "Koffi", text: "Zembo Quiz le meilleur ! 💪", color: "oklch(0.85 0.13 85)" },
];

function Countdown({ value }: { value: number }) {
  const r = 44;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
      <circle cx="50" cy="50" r={r} fill="none" stroke="oklch(0.22 0.01 60)" strokeWidth="7" />
      <motion.circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="oklch(0.84 0.14 85)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={c}
        animate={{ strokeDashoffset: c * (1 - value / 10) }}
        transition={{ duration: 0.4, ease: "linear" }}
      />
    </svg>
  );
}

function Quiz() {
  const [picked, setPicked] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(10);
  const [revealed, setRevealed] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [chat, setChat] = useState(INITIAL_CHAT);
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (revealed) {
      const t = setTimeout(() => {
        setRevealed(false);
        setPicked(null);
        setSeconds(10);
      }, 2000);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      if (seconds <= 1) {
        setSeconds(0);
        setRevealed(true);
      } else {
        setSeconds((s) => s - 1);
      }
    }, 1000);
    return () => clearTimeout(t);
  }, [seconds, revealed]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [chat]);

  const pick = (k: string) => {
    if (revealed) return;
    setPicked(k);
    navigator.vibrate?.(15);
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setChat((c) => [...c, { id: Date.now(), name: "Deena", text, color: "oklch(0.85 0.13 85)" }]);
    setDraft("");
  };

  return (
    <div className="flex h-full flex-col bg-[oklch(0.03_0_0)]">
      {/* Décor du plateau + overlays interactifs */}
      <div className="relative shrink-0 select-none">
        <img src={stage} alt="Plateau Zembo Quiz — 8 joueurs derrière leurs pupitres" className="block w-full" />
        {/* fondu vers le noir en bas pour une jointure invisible */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[6%] bg-[linear-gradient(180deg,transparent,oklch(0.03_0_0))]" />

        {/* ⋯ */}
        <Pressable
          aria-label="Plus d'options"
          onClick={() => setRulesOpen(true)}
          className="absolute rounded-full"
          style={{ left: "90.9%", width: "6.9%", top: "2.4%", height: "4.8%" }}
        />
        {/* RÈGLES */}
        <Pressable
          aria-label="Règles du Zembo Quiz"
          onClick={() => setRulesOpen(true)}
          className="absolute rounded-full active:bg-gold/10"
          style={{ left: "82.9%", width: "13.3%", top: "10.7%", height: "4%" }}
        />

        {/* Chrono par-dessus l'anneau dessiné */}
        <div
          className="pointer-events-none absolute flex items-center justify-center rounded-full bg-[oklch(0.04_0_0)]"
          style={{ left: "2.1%", width: "14.9%", top: "56.2%", aspectRatio: "1 / 1" }}
        >
          <Countdown value={seconds} />
          <span className="absolute text-center leading-[1] font-extrabold text-gold">
            <span className="block text-[22px]">{seconds}</span>
            <span className="block text-[6px] tracking-[0.08em]">SECONDES</span>
          </span>
        </div>

        {/* Réponses A / B / C */}
        {ANSWER_ZONES.map((a) => {
          const isPicked = picked === a.k;
          const dim = picked && !isPicked && !revealed;
          const good = revealed && a.k === CORRECT;
          const bad = revealed && a.k !== CORRECT;
          return (
            <Pressable
              key={a.k}
              aria-label={`Répondre ${a.k} — ${a.label}`}
              onClick={() => pick(a.k)}
              whileTap={{ scale: 0.97 }}
              className="absolute rounded-2xl border-2 transition-colors duration-200"
              style={{
                left: `${a.left}%`,
                width: `${a.width}%`,
                top: `${ANSWER_TOP}%`,
                height: `${ANSWER_HEIGHT}%`,
                borderColor: good
                  ? "oklch(0.72 0.18 150)"
                  : bad
                    ? "oklch(0.55 0.16 25 / 70%)"
                    : isPicked
                      ? "oklch(0.86 0.14 88)"
                      : "transparent",
                background: good
                  ? "oklch(0.72 0.18 150 / 22%)"
                  : bad
                    ? "oklch(0.5 0.16 25 / 16%)"
                    : isPicked
                      ? "oklch(0.86 0.14 88 / 16%)"
                      : "transparent",
                boxShadow: isPicked && !revealed ? "0 0 14px -2px oklch(0.86 0.14 88 / 70%)" : undefined,
                opacity: dim ? 0.45 : 1,
              }}
            />
          );
        })}

        {/* Ligne d'état sous les réponses */}
        <div
          className="pointer-events-none absolute flex items-center justify-center bg-[oklch(0.045_0.002_280)]"
          style={{ left: "20%", width: "72%", top: "68.6%", height: "3.4%" }}
        >
          <span
            className="text-[11px] font-semibold"
            style={{ color: revealed ? "oklch(0.75 0.16 152)" : "oklch(0.85 0.13 85)" }}
          >
            {revealed ? "Réponse : Accra ✅" : "ⓘ 7 / 8 joueurs ont répondu"}
          </span>
        </div>
      </div>

      {/* Chat spectateurs */}
      <div className="flex min-h-0 flex-1 flex-col border-t border-violet/25 bg-[oklch(0.03_0_0)] px-4 pt-3">
        <p className="text-[12px] font-extrabold tracking-[0.14em] text-violet uppercase">
          Chat spectateurs
        </p>
        <div ref={listRef} className="app-scroll mt-2 min-h-0 flex-1 space-y-2 pr-1">
          {chat.map((c) => (
            <p key={c.id} className="text-[12.5px] leading-snug">
              <span className="font-semibold" style={{ color: c.color }}>
                {c.name} :
              </span>{" "}
              <span className="text-foreground/90">{c.text}</span>
            </p>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex items-center gap-2 py-3 pb-[max(env(safe-area-inset-bottom),12px)]"
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Écrire un message…"
            className="min-w-0 flex-1 rounded-full border border-border bg-surface-2/60 px-3.5 py-2.5 text-[13px] outline-none placeholder:text-muted-foreground"
          />
          <Pressable
            type="submit"
            aria-label="Envoyer"
            whileTap={{ scale: 0.96 }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-gradient"
          >
            <Send size={16} className="text-[oklch(0.16_0.02_60)]" />
          </Pressable>
        </form>
      </div>

      <BottomSheet open={rulesOpen} onClose={() => setRulesOpen(false)}>
        <div className="px-5 pt-2 pb-4">
          <h2 className="text-[16px] font-extrabold tracking-wide text-gold">RÈGLES DU ZEMBO QUIZ</h2>
          <p className="mt-3 text-[13.5px] leading-relaxed text-foreground/85">
            Série de 5 questions. À la fin de chaque série, les 2 moins bons sont éliminés. Les
            spectateurs réagissent et envoient des cadeaux.
          </p>
        </div>
      </BottomSheet>
    </div>
  );
}

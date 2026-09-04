import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import stageBottom from "@/assets/zembo-quiz-bottom.png";
import stageTop from "@/assets/zembo-quiz-top.png";

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
      {/* Décor du plateau (haut) + rangée de réponses réelle + décor (bas) */}
      <div className="flex max-h-[60%] shrink-0 flex-col overflow-hidden bg-[oklch(0.03_0_0)] select-none">
        <div className="relative">
          <img
            src={stageTop}
            alt="Plateau Zembo Quiz — candidats derrière leurs pupitres"
            className="block w-full"
          />
          {/* ⋯ */}
          <Pressable
            aria-label="Plus d'options"
            onClick={() => setRulesOpen(true)}
            className="absolute rounded-full"
            style={{ left: "90.9%", width: "6.9%", top: "4.1%", height: "8.1%" }}
          />
          {/* RÈGLES */}
          <Pressable
            aria-label="Règles du Zembo Quiz"
            onClick={() => setRulesOpen(true)}
            className="absolute rounded-full active:bg-gold/10"
            style={{ left: "82.9%", width: "13.3%", top: "18.1%", height: "6.8%" }}
          />
        </div>

        {/* Bande interactive : chrono réel + vrais boutons A/B/C + état */}
        <div className="relative flex items-stretch">
          <div className="relative w-[21.5%]">
            <div
              className="absolute top-1/2 left-[2.7%] flex w-[17%] -translate-y-1/2 items-center justify-center"
              style={{ aspectRatio: "1 / 1", width: "78%" }}
            >
              <Countdown value={seconds} />
              <span className="absolute text-center leading-[1] font-extrabold text-gold">
                <span className="block text-[21px]">{seconds}</span>
                <span className="block text-[6px] tracking-[0.08em]">SECONDES</span>
              </span>
            </div>
          </div>

          <div
            className="min-w-0 flex-1 px-[1.5%] pb-1"
            style={{
              background: "oklch(0.045 0.004 280)",
              borderLeft: "1px solid oklch(0.5 0.09 85 / 55%)",
              borderRight: "1px solid oklch(0.5 0.09 85 / 55%)",
            }}
          >
            <div className="flex items-stretch gap-[2%]">
              {ANSWERS.map((a) => {
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
                    className="flex min-w-0 flex-1 items-center gap-1.5 rounded-2xl border px-1.5 py-1.5 text-left transition-colors duration-200"
                    style={{
                      borderColor: good
                        ? "oklch(0.72 0.18 150)"
                        : bad
                          ? "oklch(0.55 0.16 25 / 70%)"
                          : isPicked
                            ? "oklch(0.86 0.14 88)"
                            : "oklch(1 0 0 / 12%)",
                      background: good
                        ? "oklch(0.72 0.18 150 / 20%)"
                        : bad
                          ? "oklch(0.5 0.16 25 / 14%)"
                          : isPicked
                            ? "oklch(0.86 0.14 88 / 14%)"
                            : "oklch(0.08 0 0)",
                      boxShadow:
                        isPicked && !revealed ? "0 0 14px -2px oklch(0.86 0.14 88 / 70%)" : undefined,
                      opacity: dim ? 0.45 : 1,
                    }}
                  >
                    <span
                      className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold text-white"
                      style={{ background: a.tint }}
                    >
                      {a.k}
                    </span>
                    <span className="min-w-0 truncate text-[11.5px] font-semibold text-white">
                      {a.label}
                    </span>
                  </Pressable>
                );
              })}
            </div>
            <p
              className="mt-1 text-center text-[10.5px] font-semibold"
              style={{ color: revealed ? "oklch(0.75 0.16 152)" : "oklch(0.85 0.13 85)" }}
            >
              {revealed ? "Réponse : Accra ✅" : "ⓘ 7 / 8 joueurs ont répondu"}
            </p>
          </div>
          <div className="w-[4.1%]" />
        </div>

        <img src={stageBottom} alt="" className="block w-full" />

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

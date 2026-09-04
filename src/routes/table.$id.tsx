import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ChevronRight, Clock, Globe, MicOff, Send, Smile } from "lucide-react";
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
          "Zembo Table : 6 joueurs autour d'une table à questions, dé, tour de parole, chat et spectateurs en file d'attente.",
      },
      { property: "og:title", content: "Zembo Table — discussion à 6 places" },
      {
        property: "og:description",
        content: "Cartes à questions, tour de parole chronométré, chat live et réactions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TableRoom,
});

/** Sièges dessinés sur le décor — coordonnées en % du conteneur de l'image */
const SEATS = [
  { n: 1, name: "Deena", label: "Deena (Toi)", you: true, av: [50, 33], mic: [58.3, 36.6], dots: [55.4, 41.5] },
  { n: 2, name: "Sarah", label: "Sarah", host: true, av: [79, 40.8], mic: [86.9, 45.3], dots: [83.8, 49.2] },
  { n: 3, name: "Leila", label: "Leila", av: [85, 75.6], mic: [90.5, 80], dots: [88.6, 84.5] },
  { n: 4, name: "Yann", label: "Yann", av: [50.1, 86.8], mic: [58.5, 90.7], dots: [55.3, 95.7] },
  { n: 5, name: "Aïcha", label: "Aïcha", av: [15.1, 75.6], mic: [22.8, 80], dots: [20, 84.5] },
  { n: 6, name: "Marc", label: "Marc", av: [15.1, 46.6], mic: [22.6, 52.3], dots: [20, 57.4] },
] as const;

const QUESTIONS = [
  "Quelle est la chose que tu as déjà pardonnée en amour et que tu ne pardonnerais plus jamais ?",
  "Peux-tu aimer sans confiance ?",
  "L'argent a-t-il déjà changé une de tes relations ?",
  "Quel est le pardon le plus difficile que tu aies accordé ?",
];

const CHAT0 = [
  { id: 1, name: "Ben", time: "21:33", text: "Intéressant ça Deena ! Hâte d'entendre ta réponse 👀" },
  { id: 2, name: "Emma", time: "21:34", text: "Moi je ne pardonne pas l'infidélité." },
  { id: 3, name: "Kader", time: "21:35", text: "On a tous nos limites, et c'est OK." },
  { id: 4, name: "Nadia", time: "21:36", text: "L'argent change beaucoup de choses malheureusement." },
];

const REACTIONS = [
  { emoji: "❤️", count: 12 },
  { emoji: "🔥", count: 8 },
  { emoji: "👏", count: 15 },
  { emoji: "😂", count: 6 },
  { emoji: "💯", count: 5 },
];

const SPECTATORS = ["Ben", "Emma", "Kader", "Nadia", "Ibrahim", "Awa"];

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

function TableRoom() {
  const navigate = useNavigate();

  const [turn, setTurn] = useState(0);
  const [seconds, setSeconds] = useState(45);
  const [muted, setMuted] = useState<Record<number, boolean>>({});
  const [seatMenu, setSeatMenu] = useState<number | null>(null);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [flip, setFlip] = useState(false);
  const [dice, setDice] = useState(4);
  const [rolling, setRolling] = useState(false);
  const [chat, setChat] = useState(CHAT0);
  const [draft, setDraft] = useState("");
  const [reactions, setReactions] = useState(REACTIONS.map((r) => r.count));
  const [floats, setFloats] = useState<{ id: number; emoji: string; x: number }[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      if (seconds <= 1) {
        setSeconds(45);
        setTurn((v) => (v + 1) % SEATS.length);
      } else setSeconds((s) => s - 1);
    }, 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [chat]);

  const active = SEATS[turn]!;
  const mmss = `00:${String(seconds).padStart(2, "0")}`;

  const roll = () => {
    if (rolling) return;
    navigator.vibrate?.(20);
    setRolling(true);
    setTimeout(() => {
      setDice(1 + Math.floor(Math.random() * 6));
      setRolling(false);
    }, 800);
  };

  const drawCard = () => {
    navigator.vibrate?.(15);
    setFlip(true);
    setTimeout(() => {
      setQIndex((i) => (i + 1) % QUESTIONS.length);
      setFlip(false);
    }, 220);
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setChat((c) => [...c, { id: Date.now(), name: "Deena", time: "21:37", text }]);
    setDraft("");
  };

  const react = (i: number) => {
    navigator.vibrate?.(10);
    setReactions((r) => r.map((v, k) => (k === i ? v + 1 : v)));
    const id = Date.now() + i;
    setFloats((f) => [...f, { id, emoji: REACTIONS[i]!.emoji, x: 8 + i * 20 }]);
    setTimeout(() => setFloats((f) => f.filter((x) => x.id !== id)), 1100);
  };

  return (
    <div className="flex min-h-full flex-col overflow-x-hidden bg-[oklch(0.03_0_0)]">
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

        {/* TOUR DE … + chrono réel (on recouvre la zone dessinée) */}
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
          <span className="text-[8px] font-semibold tracking-[0.2em] text-gold/80">TOUR DE</span>
          <motion.span
            key={active.name}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[17px] leading-tight font-extrabold tracking-wide text-gold uppercase"
          >
            {active.name}
          </motion.span>
          <span className="mt-[2px] rounded-full border border-gold/60 px-2.5 py-[2px] text-[11px] font-bold text-gold tabular-nums">
            {mmss}
          </span>
        </div>

        {/* Anneau or pulsant sur le joueur actif */}
        <motion.span
          className="pointer-events-none absolute rounded-full"
          animate={{
            left: `${active.av[0] - 6.6}%`,
            top: `${active.av[1] - 7.3}%`,
            opacity: [0.55, 1, 0.55],
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
        {SEATS.map((s) => (
          <div key={s.n}>
            <Pressable
              aria-label={`Profil de ${s.label}`}
              onClick={() => setSeatMenu(s.n)}
              className="absolute rounded-full"
              style={{
                left: `${s.av[0] - 6.2}%`,
                top: `${s.av[1] - 6.9}%`,
                width: "12.4%",
                aspectRatio: "1 / 1",
              }}
            />
            <Pressable
              aria-label={`${muted[s.n] ? "Activer" : "Couper"} le micro de ${s.name}`}
              onClick={() => {
                navigator.vibrate?.(10);
                setMuted((m) => ({ ...m, [s.n]: !m[s.n] }));
              }}
              className="absolute flex items-center justify-center rounded-full"
              style={{
                left: `${s.mic[0] - 3.4}%`,
                top: `${s.mic[1] - 3.8}%`,
                width: "6.8%",
                aspectRatio: "1 / 1",
                background: muted[s.n] ? "oklch(0.12 0.02 30 / 92%)" : "transparent",
              }}
            >
              {muted[s.n] && <MicOff size={12} className="text-gold" />}
            </Pressable>
            <Pressable
              aria-label={`Options pour ${s.name}`}
              onClick={() => setSeatMenu(s.n)}
              className="absolute rounded-md"
              style={{
                left: `${s.dots[0] - 2.4}%`,
                top: `${s.dots[1] - 2.7}%`,
                width: "4.8%",
                aspectRatio: "1 / 1.1",
              }}
            />
          </div>
        ))}

        {/* Paquet de cartes tappable */}
        <Pressable
          aria-label="Tirer une nouvelle carte question"
          onClick={drawCard}
          className="absolute rounded-xl"
          style={{ left: "35.2%", top: "48.6%", width: "10%", height: "14.4%" }}
        />

        {/* Texte de la carte question (vrai bloc, remplaçable) */}
        <motion.div
          animate={{ rotateY: flip ? 80 : 0, opacity: flip ? 0.25 : 1 }}
          transition={{ duration: 0.22 }}
          className="absolute flex items-center justify-center px-1 text-center"
          style={{
            left: "47.4%",
            top: "54.8%",
            width: "21.8%",
            height: "20%",
            background: "oklch(0.055 0.004 60)",
          }}
        >
          <span className="text-[8.5px] leading-[1.35] font-medium text-white/90">
            {QUESTIONS[qIndex]}
          </span>
        </motion.div>

        {/* Vrai dé tappable */}
        <Pressable
          aria-label="Lancer le dé"
          onClick={roll}
          className="absolute"
          style={{ left: "27.8%", top: "62.2%", width: "9%", aspectRatio: "1 / 1" }}
        >
          <motion.span
            animate={
              rolling
                ? { rotate: [0, -90, 120, -160, 0], scale: [1, 1.12, 0.95, 1.08, 1] }
                : { rotate: 0, scale: [1.14, 1] }
            }
            transition={{ duration: rolling ? 0.8 : 0.22 }}
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

      {/* ============ BAS VIVANT ============ */}
      <div className="relative flex flex-1 flex-col gap-3 bg-[oklch(0.03_0_0)] px-3 pt-3">
        {/* CHAT */}
        <section className="rounded-2xl border border-gold/20 bg-[oklch(0.06_0.004_60)] p-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[12px] font-extrabold tracking-[0.16em] text-gold">CHAT</h2>
            <span className="flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[11px] text-foreground/80">
              <Globe size={12} className="text-gold" /> Tout le monde ▾
            </span>
          </div>
          <div className="mt-2.5 space-y-2.5">
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
        </section>

        {/* SPECTATEURS */}
        <section className="rounded-2xl border border-gold/20 bg-[oklch(0.06_0.004_60)] p-3">
          <h2 className="text-[12px] font-extrabold tracking-[0.16em] text-gold">SPECTATEURS (23)</h2>
          <div className="mt-2.5 flex items-center gap-1.5">
            {SPECTATORS.map((s) => (
              <PhotoAvatar key={s} name={s} size={34} />
            ))}
            <span className="ml-auto flex items-center gap-1 text-[12px] font-bold text-gold">
              +17 <ChevronRight size={14} />
            </span>
          </div>
          <p className="mt-2.5 flex items-center gap-1.5 text-[12px] font-semibold text-gold/90">
            <Clock size={12} /> En attente de monter : 3
          </p>
          <p className="mt-1 text-[11.5px] text-muted-foreground">
            Un spectateur monte dès qu'une place se libère.
          </p>
        </section>

        {/* RÉAGIR */}
        <section className="relative rounded-2xl border border-gold/20 bg-[oklch(0.06_0.004_60)] p-3">
          <h2 className="text-[12px] font-extrabold tracking-[0.16em] text-gold">RÉAGIR</h2>
          <div className="mt-2.5 flex items-center gap-2">
            {REACTIONS.map((r, i) => (
              <Pressable
                key={r.emoji}
                aria-label={`Réagir ${r.emoji}`}
                onClick={() => react(i)}
                whileTap={{ scale: 0.96 }}
                className="flex flex-1 items-center justify-center gap-1 rounded-full border border-border bg-[oklch(0.09_0.004_60)] py-1.5 text-[12px] font-bold text-foreground/90"
              >
                <span>{r.emoji}</span>
                <span className="tabular-nums">{reactions[i]}</span>
              </Pressable>
            ))}
          </div>
          <AnimatePresence>
            {floats.map((f) => (
              <motion.span
                key={f.id}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -70 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1 }}
                className="pointer-events-none absolute bottom-8 text-[20px]"
                style={{ left: `${f.x}%` }}
              >
                {f.emoji}
              </motion.span>
            ))}
          </AnimatePresence>
        </section>

        {/* Barre de saisie collée en bas, au-dessus du dock */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="sticky bottom-[86px] z-10 mt-auto flex items-center gap-2 rounded-full border border-border bg-[oklch(0.08_0.004_60)] px-2 py-1.5"
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Écris ton message…"
            className="min-w-0 flex-1 bg-transparent px-2 text-[13px] outline-none placeholder:text-muted-foreground"
          />
          <Smile size={18} className="shrink-0 text-muted-foreground" />
          <Pressable
            type="submit"
            aria-label="Envoyer"
            whileTap={{ scale: 0.96 }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-gradient"
          >
            <Send size={14} className="text-[oklch(0.16_0.02_60)]" />
          </Pressable>
        </form>
        <div className="h-[100px] shrink-0" />
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

      <BottomSheet open={seatMenu !== null} onClose={() => setSeatMenu(null)}>
        <div className="px-4 pt-2 pb-4">
          <p className="px-3 pb-2 text-[12px] font-bold tracking-[0.14em] text-gold uppercase">
            {SEATS.find((s) => s.n === seatMenu)?.label ?? ""}
          </p>
          {["Voir le profil", "Couper le son", "Signaler"].map((label) => (
            <Pressable
              key={label}
              onClick={() => {
                if (label === "Couper le son" && seatMenu)
                  setMuted((m) => ({ ...m, [seatMenu]: true }));
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

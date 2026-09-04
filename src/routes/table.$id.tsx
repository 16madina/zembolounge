import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, Dices, Globe, Info, Mic, MicOff, MoreVertical, Send, Smile, Users } from "lucide-react";
import { AvatarStack, Pressable } from "@/components/zembo/ui";
import { PhotoAvatar } from "@/components/zembo/PhotoAvatar";
import { BottomSheet } from "@/components/zembo/Sheet";
import { ZemboIcon } from "@/components/zembo/ZemboMark";

export const Route = createFileRoute("/table/$id")({
  head: () => ({
    meta: [
      { title: "Zembo Table — discussion en groupe" },
      {
        name: "description",
        content: "Une table interactive Zembo : cartes à questions, tour de parole, chat et réactions.",
      },
      { property: "og:title", content: "Zembo Table — discussion en groupe" },
      {
        property: "og:description",
        content: "Réunis 4 à 10 personnes autour d'une table de discussion interactive.",
      },
    ],
  }),
  component: TableRoom,
});

const POOL = [
  { n: 1, name: "Deena", you: true },
  { n: 2, name: "Sarah", host: true },
  { n: 3, name: "Leila" },
  { n: 4, name: "Yann" },
  { n: 5, name: "Aïcha" },
  { n: 6, name: "Marc" },
  { n: 7, name: "Kader" },
  { n: 8, name: "Nadia" },
  { n: 9, name: "Ben" },
  { n: 10, name: "Emma" },
] as { n: number; name: string; you?: boolean; host?: boolean }[];

const QUESTIONS = [
  "Quelle est la chose que tu as déjà pardonnée en amour et que tu ne pardonnerais plus jamais ?",
  "Parle-t-on assez d'argent dans un couple ? Où mets-tu la limite ?",
  "Est-ce qu'un compte commun est une preuve de confiance ou un risque ?",
  "As-tu déjà renoncé à un rêve pour quelqu'un ? Le referais-tu ?",
  "Qu'est-ce qui te ferait quitter une relation confortable ?",
];

const REACTIONS = [
  { emoji: "❤️", count: 12 },
  { emoji: "🔥", count: 8 },
  { emoji: "👏", count: 15 },
  { emoji: "😂", count: 6 },
  { emoji: "💯", count: 5 },
];

const CHAT0 = [
  { id: "c1", name: "Ben", time: "21:33", text: "Intéressant ça Deena ! Hâte d'entendre ta réponse 👀" },
  { id: "c2", name: "Emma", time: "21:34", text: "Moi je ne pardonne pas l'infidélité." },
  { id: "c3", name: "Kader", time: "21:35", text: "On a tous nos limites, et c'est OK." },
  { id: "c4", name: "Nadia", time: "21:36", text: "L'argent change beaucoup de choses malheureusement." },
];

const SIZES = [4, 6, 8, 10];

function TableRoom() {
  const navigate = useNavigate();
  const [tableSize, setTableSize] = useState(10);
  const [occupied, setOccupied] = useState(6);
  const [turn, setTurn] = useState(0);
  const [seconds, setSeconds] = useState(45);
  const [qIndex, setQIndex] = useState(0);
  const [muted, setMuted] = useState<Record<number, boolean>>({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [chat, setChat] = useState(CHAT0);
  const [draft, setDraft] = useState("");
  const [counts, setCounts] = useState(REACTIONS.map((r) => r.count));
  const [floats, setFloats] = useState<{ id: number; emoji: string; x: number }[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  const players = useMemo(() => POOL.slice(0, Math.min(occupied, tableSize)), [occupied, tableSize]);
  const seatCount = tableSize;
  const avatarSize = seatCount <= 4 ? 64 : seatCount <= 6 ? 56 : seatCount <= 8 ? 50 : 44;

  useEffect(() => {
    const t = setInterval(() => {
      setSeconds((s) => {
        if (s > 0) return s - 1;
        setTurn((k) => (k + 1) % Math.max(players.length, 1));
        setQIndex((q) => (q + 1) % QUESTIONS.length);
        return 45;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [players.length]);

  useEffect(() => {
    if (turn >= players.length) setTurn(0);
  }, [players.length, turn]);

  const turnName = players[turn]?.name ?? "—";
  const mmss = `00:${String(seconds).padStart(2, "0")}`;

  function send(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setChat((c) => [...c, { id: `me-${Date.now()}`, name: "Deena", time: "21:37", text }]);
    setDraft("");
    requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
  }

  function react(i: number) {
    navigator.vibrate?.(12);
    setCounts((c) => c.map((v, k) => (k === i ? v + 1 : v)));
    const id = Date.now() + i;
    setFloats((f) => [...f, { id, emoji: REACTIONS[i].emoji, x: i * 20 - 40 }]);
    setTimeout(() => setFloats((f) => f.filter((x) => x.id !== id)), 1000);
  }

  function drawCard() {
    navigator.vibrate?.(14);
    setQIndex((q) => (q + 1) % QUESTIONS.length);
  }

  return (
    <div className="overflow-x-hidden pb-[110px]">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border/50 bg-background/85 px-3 pt-[max(env(safe-area-inset-top),12px)] pb-2.5 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="flex shrink-0 items-center gap-1.5">
            <ZemboIcon size={20} />
            <span className="text-[11px] font-bold tracking-[0.18em] text-gold">ZEMBO</span>
          </div>
          <div className="min-w-0 flex-1 text-center">
            <p className="truncate text-[12px] font-bold tracking-[0.16em] text-foreground uppercase">Zembo Table</p>
            <p className="flex items-center justify-center gap-1 text-[10.5px] text-muted-foreground">
              <Users size={11} /> {players.length} / {tableSize}
            </p>
          </div>
          <Pressable
            onClick={() => navigate({ to: "/live" })}
            className="shrink-0 rounded-full border border-gold/60 px-2.5 py-1.5 text-[10.5px] font-semibold whitespace-nowrap text-gold"
          >
            Quitter la table
          </Pressable>
          <Pressable onClick={() => setMenuOpen(true)} aria-label="Plus d'options" className="shrink-0">
            <MoreVertical size={18} className="text-muted-foreground" />
          </Pressable>
        </div>

        <div className="mt-2.5 flex items-center gap-2">
          <span className="shrink-0 rounded-full border border-border bg-surface-2/60 px-2.5 py-1 text-[10.5px] text-foreground/80">
            🎴 Deck : Relations ❤️
          </span>
          <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
            <span className="truncate text-[10px] font-bold tracking-[0.14em] text-muted-foreground uppercase">
              Tour de {turnName}
            </span>
            <span className="shrink-0 rounded-full border border-gold/60 bg-gold/10 px-2 py-0.5 text-[11.5px] font-bold text-gold tabular-nums">
              {mmss}
            </span>
          </div>
        </div>
        <p className="mt-1.5 truncate text-[10.5px] text-muted-foreground">
          L'amour et l'argent : peut-on tout partager ?
        </p>
      </header>

      {/* Table */}
      <div className="relative mx-3 mt-3" style={{ aspectRatio: "1 / 1.16" }}>
        <div className="absolute inset-0">
          {/* wooden ring */}
          <div
            className="absolute inset-[9%] rounded-[50%]"
            style={{
              background: "linear-gradient(160deg, #3A2A1E 0%, #241811 55%, #1A120B 100%)",
              border: "1px solid oklch(0.82 0.13 85 / 0.55)",
              boxShadow:
                "0 0 22px oklch(0.82 0.13 85 / 0.18), inset 0 1px 0 oklch(0.9 0.1 90 / 0.25), 0 18px 40px rgba(0,0,0,0.6)",
            }}
          />
          {/* felt */}
          <div
            className="absolute inset-[15%] rounded-[50%]"
            style={{
              background: "radial-gradient(circle at 50% 40%, #1E1E1E 0%, #131313 55%, #0C0C0C 100%)",
              border: "1px solid oklch(0.82 0.13 85 / 0.28)",
              boxShadow: "inset 0 0 30px rgba(0,0,0,0.8)",
            }}
          />

          {/* center: deck + dice + question card */}
          <div className="absolute inset-[15%] flex flex-col items-center justify-center gap-2 px-3">
            <div className="flex items-center gap-3">
              <Pressable onClick={drawCard} aria-label="Tirer une carte" className="relative h-[38px] w-[28px]">
                {[2, 1, 0].map((k) => (
                  <span
                    key={k}
                    className="absolute inset-0 flex items-center justify-center rounded-[6px] border border-gold/45 bg-[#0B0B0B]"
                    style={{ transform: `translate(${k * 2.5}px, ${-k * 2.5}px) rotate(${k * -4}deg)` }}
                  >
                    {k === 0 && <ZemboIcon size={13} />}
                  </span>
                ))}
              </Pressable>
              <span className="flex h-[26px] w-[26px] items-center justify-center rounded-[7px] border border-gold/40 bg-[#0B0B0B] text-gold">
                <Dices size={15} />
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={qIndex}
                initial={{ rotateY: -90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: 90, opacity: 0 }}
                transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
                className="w-full max-w-[150px] rounded-xl border border-gold/55 bg-black/85 px-2 py-2 text-center"
                style={{ boxShadow: "0 0 18px oklch(0.82 0.13 85 / 0.15)" }}
              >
                <p className="text-[8.5px] font-bold tracking-[0.2em] text-gold uppercase">Question</p>
                <p className="text-[13px] leading-none font-bold text-gold/80">?</p>
                <p className="mt-1 text-[9.5px] leading-snug text-white/85">{QUESTIONS[qIndex]}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* seats */}
          {Array.from({ length: seatCount }).map((_, i) => {
            const angle = (-90 + i * (360 / seatCount)) * (Math.PI / 180);
            const left = 50 + Math.cos(angle) * 39;
            const top = 50 + Math.sin(angle) * 41;
            const p = players[i];
            const active = p && i === turn;
            return (
              <div
                key={i}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
                style={{ left: `${left}%`, top: `${top}%`, width: avatarSize + 26 }}
              >
                {p ? (
                  <>
                    <div className="relative" style={{ width: avatarSize, height: avatarSize }}>
                      {active && (
                        <motion.span
                          animate={{ opacity: [0.35, 1, 0.35], scale: [1, 1.06, 1] }}
                          transition={{ duration: 1.8, repeat: Infinity }}
                          className="absolute -inset-[5px] rounded-full border-2 border-gold"
                          style={{ boxShadow: "0 0 16px oklch(0.82 0.13 85 / 0.6)" }}
                        />
                      )}
                      <PhotoAvatar name={p.name} size={avatarSize} ring={!active} />
                      <span className="absolute -top-1 -left-1 flex h-[15px] w-[15px] items-center justify-center rounded-full border border-gold/50 bg-black text-[8.5px] font-bold text-gold">
                        {p.n}
                      </span>
                      <Pressable
                        aria-label={`Micro de ${p.name}`}
                        onClick={() => setMuted((m) => ({ ...m, [p.n]: !m[p.n] }))}
                        className="absolute -right-1 -bottom-1 flex h-[19px] w-[19px] items-center justify-center rounded-full border border-border bg-black"
                      >
                        {muted[p.n] ? (
                          <MicOff size={10} className="text-live" />
                        ) : (
                          <Mic size={10} className="text-emerald" />
                        )}
                      </Pressable>
                    </div>
                    <span
                      className={`flex max-w-full items-center gap-0.5 rounded-full border px-1.5 py-[2px] text-[9px] font-semibold whitespace-nowrap ${
                        active ? "border-gold bg-gold/15 text-gold" : "border-gold/35 bg-black/80 text-white/85"
                      }`}
                    >
                      <span className="truncate">
                        {p.name}
                        {p.you ? " (Toi)" : ""}
                      </span>
                      <MoreVertical size={9} className="shrink-0 text-white/40" />
                    </span>
                    {p.host && (
                      <span className="rounded-md bg-violet px-1 py-[1px] text-[7.5px] font-bold text-white">
                        ★ HÔTE
                      </span>
                    )}
                  </>
                ) : (
                  <Pressable
                    className="flex flex-col items-center justify-center rounded-full border border-dashed border-white/25 text-[7.5px] leading-tight font-semibold text-white/45"
                    style={{ width: avatarSize, height: avatarSize }}
                  >
                    <span className="text-[12px]">+</span>
                    Place
                    <span>libre</span>
                  </Pressable>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat */}
      <div className="card-surface mx-3 mt-3 rounded-2xl p-3">
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-bold tracking-wide text-foreground/85 uppercase">Chat</p>
          <span className="flex items-center gap-1 rounded-full border border-border px-2 py-1 text-[10.5px] text-muted-foreground">
            <Globe size={11} /> Tout le monde ▾
          </span>
        </div>
        <div className="mt-2.5 space-y-2.5">
          {chat.map((m) => (
            <div key={m.id} className="flex items-start gap-2">
              <PhotoAvatar name={m.name} size={26} ring={false} />
              <div className="min-w-0 flex-1">
                <p className="flex justify-between text-[11px] font-semibold text-gold/85">
                  {m.name} <span className="text-muted-foreground">{m.time}</span>
                </p>
                <p className="text-[12.5px] break-words text-foreground/85">{m.text}</p>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <form onSubmit={send} className="mt-3 flex items-center gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-full border border-border bg-surface-2/70 px-3 py-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Écris ton message…"
              className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-muted-foreground"
            />
            <Smile size={16} className="shrink-0 text-muted-foreground" />
          </div>
          <Pressable
            type="submit"
            aria-label="Envoyer"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-gradient text-[oklch(0.16_0.02_60)]"
          >
            <Send size={16} />
          </Pressable>
        </form>
      </div>

      {/* Spectateurs */}
      <Pressable className="card-surface mx-3 mt-3 flex w-[calc(100%-24px)] items-center justify-between rounded-2xl p-3">
        <div className="min-w-0">
          <p className="text-left text-[12px] font-bold tracking-wide text-foreground/85 uppercase">
            Spectateurs (23)
          </p>
          <div className="mt-2">
            <AvatarStack names={["Ben", "Emma", "Kader", "Nadia", "Inès", "Marc"]} extra={17} size={26} />
          </div>
        </div>
        <ChevronRight size={18} className="shrink-0 text-muted-foreground" />
      </Pressable>

      {/* Réagir */}
      <div className="card-surface relative mx-3 mt-3 rounded-2xl p-3">
        <p className="text-[12px] font-bold tracking-wide text-foreground/85 uppercase">Réagir</p>
        <div className="mt-2 flex gap-2">
          {REACTIONS.map((r, i) => (
            <Pressable
              key={r.emoji}
              onClick={() => react(i)}
              className="flex flex-1 flex-col items-center rounded-xl border border-border bg-surface-2/60 py-2"
            >
              <span className="text-[16px]">{r.emoji}</span>
              <span className="text-[10.5px] text-muted-foreground tabular-nums">{counts[i]}</span>
            </Pressable>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
          <AnimatePresence>
            {floats.map((f) => (
              <motion.span
                key={f.id}
                initial={{ opacity: 1, y: 0, x: f.x }}
                animate={{ opacity: 0, y: -70 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9 }}
                className="absolute text-[20px]"
              >
                {f.emoji}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Menu ⋮ */}
      <BottomSheet open={menuOpen} onClose={() => setMenuOpen(false)}>
        <div className="px-5 pt-1">
          <p className="text-[12px] font-bold tracking-[0.16em] text-muted-foreground uppercase">Options</p>
          <Pressable
            onClick={() => {
              setMenuOpen(false);
              setRulesOpen(true);
            }}
            className="mt-3 flex w-full items-center gap-2 rounded-2xl border border-border bg-surface-2/60 px-4 py-3 text-[14px] font-semibold"
          >
            <Info size={16} className="text-gold" /> Règles
          </Pressable>

          <p className="mt-5 text-[12px] font-bold tracking-[0.16em] text-muted-foreground uppercase">
            Taille de la table (démo)
          </p>
          <div className="mt-2 flex gap-2">
            {SIZES.map((s) => (
              <Pressable
                key={s}
                onClick={() => {
                  setTableSize(s);
                  setOccupied(Math.min(occupied, s));
                  setTurn(0);
                }}
                className={`flex-1 rounded-xl border py-2.5 text-[14px] font-bold ${
                  tableSize === s
                    ? "border-transparent bg-gold-gradient text-[oklch(0.16_0.02_60)]"
                    : "border-border bg-surface-2/60 text-foreground/75"
                }`}
              >
                {s}
              </Pressable>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <Pressable
              onClick={() => setOccupied((o) => Math.max(1, o - 1))}
              className="flex-1 rounded-xl border border-border py-2 text-[12.5px] font-semibold text-foreground/75"
            >
              − un participant
            </Pressable>
            <Pressable
              onClick={() => setOccupied((o) => Math.min(tableSize, o + 1))}
              className="flex-1 rounded-xl border border-border py-2 text-[12.5px] font-semibold text-foreground/75"
            >
              + un participant
            </Pressable>
          </div>
        </div>
      </BottomSheet>

      <BottomSheet open={rulesOpen} onClose={() => setRulesOpen(false)}>
        <div className="px-5 pt-1 pb-2">
          <p className="text-[16px] font-extrabold text-gold">Règles de la table</p>
          <ul className="mt-3 space-y-2 text-[13.5px] text-foreground/85">
            <li>· Respect &amp; bienveillance</li>
            <li>· Chacun son tour</li>
            <li>· Pas d'attaque personnelle</li>
          </ul>
        </div>
      </BottomSheet>
    </div>
  );
}

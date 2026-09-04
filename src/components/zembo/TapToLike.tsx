import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";

/* ───────────────────────────────────────────────
   TAP-TO-LIKE (façon TikTok Live)
   Réutilisable sur tous les écrans live Zembo.
   ─────────────────────────────────────────────── */

type FlyHeart = {
  id: number;
  x: number;
  y: number;
  size: number;
  drift: number;
  rot: number;
  hue: string;
  rise: number;
};

const MAX_HEARTS = 25;
const HUES = [
  "oklch(0.62 0.24 18)",
  "oklch(0.68 0.22 12)",
  "oklch(0.72 0.20 5)",
  "oklch(0.66 0.23 25)",
  "oklch(0.75 0.18 350)",
];

export function formatLikes(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

/** Un tap sur un élément interactif ne doit PAS envoyer de cœur. */
function isInteractive(target: EventTarget | null) {
  if (!(target instanceof Element)) return true;
  return !!target.closest(
    'button, a, input, textarea, select, label, [role="button"], [role="tab"], [role="dialog"], [data-no-like]',
  );
}

export function useTapToLike(initialLikes = 0) {
  const [likes, setLikes] = useState(initialLikes);
  const [hearts, setHearts] = useState<FlyHeart[]>([]);
  const [pop, setPop] = useState(0);
  const seq = useRef(0);
  const lastTap = useRef(0);

  const spawn = useCallback((x: number, y: number, count = 1) => {
    const created: FlyHeart[] = [];
    for (let i = 0; i < count; i++) {
      seq.current += 1;
      created.push({
        id: seq.current,
        x: x + (Math.random() - 0.5) * 26,
        y: y + (Math.random() - 0.5) * 18,
        size: 22 + Math.random() * 20,
        drift: (Math.random() - 0.5) * 110,
        rot: (Math.random() - 0.5) * 60,
        hue: HUES[Math.floor(Math.random() * HUES.length)]!,
        rise: 180 + Math.random() * 140,
      });
    }
    setHearts((h) => [...h, ...created].slice(-MAX_HEARTS));
    setLikes((l) => l + count);
    setPop((p) => p + 1);
    navigator.vibrate?.(8);
    const ids = created.map((c) => c.id);
    window.setTimeout(
      () => setHearts((h) => h.filter((x2) => !ids.includes(x2.id))),
      1400,
    );
  }, []);

  /** À brancher sur le conteneur du live (fond/scène). */
  const onSceneTap = useCallback(
    (e: React.PointerEvent) => {
      if (isInteractive(e.target)) return;
      const now = Date.now();
      const fast = now - lastTap.current < 260;
      lastTap.current = now;
      spawn(e.clientX, e.clientY, fast ? 2 + Math.floor(Math.random() * 3) : 1);
    },
    [spawn],
  );

  /** Le bouton ❤️ de la colonne d'actions → même effet. */
  const likeFromButton = useCallback(
    (e?: React.MouseEvent) => {
      const el = e?.currentTarget as HTMLElement | undefined;
      const r = el?.getBoundingClientRect();
      const x = r ? r.left + r.width / 2 : window.innerWidth - 40;
      const y = r ? r.top + r.height / 2 : window.innerHeight * 0.6;
      const now = Date.now();
      const fast = now - lastTap.current < 260;
      lastTap.current = now;
      spawn(x, y, fast ? 3 : 1);
    },
    [spawn],
  );

  return {
    likes,
    pop,
    spawn,
    onSceneTap,
    likeFromButton,
    sceneProps: { onPointerDown: onSceneTap } as {
      onPointerDown: (e: React.PointerEvent) => void;
    },
    layer: <HeartsLayer hearts={hearts} />,
  };
}

function HeartsLayer({ hearts }: { hearts: FlyHeart[] }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[45] overflow-hidden">
      <AnimatePresence>
        {hearts.map((h) => (
          <motion.div
            key={h.id}
            initial={{ opacity: 0, scale: 0.4, x: h.x, y: h.y, rotate: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.4, 1.15, 1, 0.9],
              x: h.x + h.drift,
              y: h.y - h.rise,
              rotate: h.rot,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            style={{ position: "absolute", left: 0, top: 0 }}
          >
            <Heart
              size={h.size}
              style={{ color: h.hue, marginLeft: -h.size / 2, marginTop: -h.size / 2 }}
              fill="currentColor"
              className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/** Compteur animé (petit pop à chaque incrément). */
export function LikeCount({
  likes,
  pop,
  className = "",
}: {
  likes: number;
  pop: number;
  className?: string;
}) {
  return (
    <motion.span
      key={pop}
      initial={{ scale: 1.35 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 18 }}
      className={className}
    >
      {formatLikes(likes)}
    </motion.span>
  );
}

/** Pastille « ❤️ 4.3K » à placer près du nombre de spectateurs. */
export function LikePill({ likes, pop }: { likes: number; pop: number }) {
  return (
    <span className="flex items-center gap-1 rounded-full bg-black/45 px-2 py-[3px] text-[10px] font-semibold text-white/90 backdrop-blur-md">
      <Heart size={10} className="text-[oklch(0.65_0.22_20)]" fill="currentColor" />
      <LikeCount likes={likes} pop={pop} />
    </span>
  );
}

import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import { MessageCircle, Sparkles, Video } from "lucide-react";
import { Pressable } from "@/components/zembo/ui";

export type HelloMatchPerson = {
  name: string;
  age: number;
  flag: string;
  city: string;
  country: string;
  photo: string;
};

const CONFETTI_COLORS = [
  "oklch(0.85 0.15 85)",
  "oklch(0.72 0.13 60)",
  "oklch(0.95 0.06 95)",
  "oklch(0.68 0.19 350)",
];

export function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 42 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.6,
        duration: 2.6 + Math.random() * 2.2,
        size: 5 + Math.random() * 7,
        rotate: Math.random() * 360,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        round: i % 5 === 0,
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute top-[-8%]"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.round ? p.size : p.size * 1.8,
            background: p.color,
            borderRadius: p.round ? 9999 : 2,
          }}
          initial={{ y: -40, opacity: 0, rotate: p.rotate }}
          animate={{ y: "115vh", opacity: [0, 1, 1, 0], rotate: p.rotate + 420 }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

function MatchPhoto({ person, delay }: { person: HelloMatchPerson; delay: number }) {
  return (
    <motion.div
      initial={{ scale: 0.6, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 220, damping: 16 }}
      className="flex min-w-0 flex-1 flex-col items-center"
    >
      <span className="relative flex h-[128px] w-[128px] items-center justify-center rounded-full border-[3px] border-gold shadow-[0_0_40px_-6px_oklch(0.85_0.15_85/70%)]">
        <img
          src={person.photo}
          alt={person.name}
          className="h-full w-full rounded-full object-cover"
        />
      </span>
      <p className="mt-2 truncate text-[15px] font-black text-white">
        {person.name}, {person.age}
      </p>
      <p className="truncate text-[11px] text-white/70">
        {person.flag} {person.city}, {person.country}
      </p>
    </motion.div>
  );
}

export function WorldHelloMatch({
  open,
  me,
  other,
  onStartVideo,
  onLater,
  onMessage,
}: {
  open: boolean;
  me: HelloMatchPerson;
  other: HelloMatchPerson;
  onStartVideo: () => void;
  onLater: () => void;
  onMessage?: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 overflow-hidden bg-[oklch(0.12_0.02_60)]"
        >
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(120% 60% at 50% 15%, oklch(0.28 0.06 250 / 80%), transparent 70%), radial-gradient(90% 50% at 50% 55%, oklch(0.45 0.1 85 / 25%), transparent 70%)",
            }}
          />
          <Confetti />

          <div className="relative flex h-full flex-col items-center px-5 pt-[7%] pb-[6%]">
            <h1 className="text-[15px] leading-none font-black tracking-[0.2em] text-white">
              W<span className="tracking-normal">🌍</span>RLD{" "}
              <span className="text-gold-gradient">ROOM</span>
            </h1>
            <p className="mt-1 text-[11px] text-white/60">Le monde est à un Hello.</p>

            <motion.p
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mt-[6%] text-center font-serif text-[26px] leading-tight text-gold italic"
            >
              Vous vous êtes dit
            </motion.p>
            <motion.p
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 12 }}
              className="text-gold-gradient text-[46px] leading-none font-black tracking-tight"
            >
              HELLO !
            </motion.p>
            <p className="mt-2 text-center text-[13px] leading-snug text-white/80">
              Une belle connexion commence
              <br />
              peut-être ici…
            </p>

            <span className="mt-3 h-[2px] w-14 rounded-full bg-gold/70" />

            <div className="relative mt-[5%] flex w-full items-start gap-2">
              <MatchPhoto person={me} delay={0.25} />
              <MatchPhoto person={other} delay={0.35} />
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ delay: 0.5, duration: 1.6, repeat: Infinity }}
                className="absolute top-[38px] left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-br from-[oklch(0.62_0.2_25)] to-[oklch(0.85_0.15_85)] text-[26px] shadow-[0_0_36px_-4px_oklch(0.85_0.15_85/80%)]"
              >
                ❤️
              </motion.span>
            </div>

            <div className="mt-auto w-full">
              <div className="flex items-start justify-between gap-2 px-1 text-center">
                {[
                  { icon: <MessageCircle size={18} />, text: "Découvrez une nouvelle personne" },
                  { icon: <Video size={18} />, text: "Une rencontre vidéo de 60 secondes" },
                  { icon: <Sparkles size={18} />, text: "Et laissez la conversation suivre son cours…" },
                ].map((it, i) => (
                  <div key={i} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                    <span className="text-gold">{it.icon}</span>
                    <p className="text-[10px] leading-tight text-white/75">{it.text}</p>
                  </div>
                ))}
              </div>

              <Pressable
                onClick={onStartVideo}
                className="mt-4 flex h-13 w-full items-center justify-center gap-2 rounded-full bg-gold-gradient py-3.5 text-[15px] font-black text-[oklch(0.16_0.02_60)] shadow-[0_10px_30px_-8px_oklch(0.85_0.15_85/70%)]"
              >
                📸 Lancer la rencontre 60 secondes
              </Pressable>
              <Pressable
                onClick={onMessage ?? onLater}
                className="mt-2 flex w-full items-center justify-center rounded-full border border-gold/45 py-3 text-[14px] font-semibold text-white/90"
              >
                Plus tard
              </Pressable>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

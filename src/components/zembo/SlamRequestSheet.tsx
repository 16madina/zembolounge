import { motion } from "framer-motion";
import { Mic, Pause, Play, X } from "lucide-react";
import { useState } from "react";
import { Pressable } from "@/components/zembo/ui";
import { MOODS, type SlamDuration, type Sound, moodOf, soundsFor } from "@/lib/zembo-sounds";

export type SlamRequest = {
  title: string;
  duration: SlamDuration;
  mood: string;
  sound: Sound | null;
};

export function SlamRequestSheet({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (r: SlamRequest) => void;
}) {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState<SlamDuration | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [sound, setSound] = useState<Sound | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);

  const tracks = soundsFor(mood, duration);
  const noMusic = mood === "aucune";
  const ready = title.trim().length > 1 && duration !== null && mood !== null;

  const preview = (s: Sound) => {
    navigator.vibrate?.(15);
    setPlaying(s.id);
    setTimeout(() => setPlaying((p) => (p === s.id ? null : p)), 1800);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 z-[64] bg-black/70 backdrop-blur-sm"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        className="absolute inset-x-0 bottom-0 z-[65] flex h-[92%] flex-col rounded-t-3xl bg-[oklch(0.09_0.01_60)] ring-1 ring-white/10"
      >
        <div className="flex items-center gap-2 border-b border-white/8 px-3 py-3">
          <Pressable
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/80"
            aria-label="Fermer"
          >
            <X size={16} />
          </Pressable>
          <p className="flex-1 text-[15px] font-extrabold text-foreground">Demander à slamer</p>
        </div>

        <div className="app-scroll no-scrollbar min-h-0 flex-1 px-3 pt-3 pb-4">
          {/* TITRE */}
          <p className="text-[10px] font-bold tracking-[0.14em] text-muted-foreground">
            TITRE DE TON SLAM
          </p>
          <input
            value={title}
            maxLength={48}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex. : J'ai appris à me choisir"
            className="mt-1.5 w-full rounded-2xl bg-white/[0.05] px-3 py-2.5 text-[13.5px] text-foreground ring-1 ring-white/10 placeholder:text-white/35 outline-none focus:ring-gold/50"
          />
          <p className="mt-1 text-right text-[10px] text-muted-foreground">{title.length}/48</p>

          {/* DURÉE */}
          <p className="mt-3 text-[10px] font-bold tracking-[0.14em] text-muted-foreground">
            DURÉE
          </p>
          <div className="mt-1.5 grid grid-cols-2 gap-2">
            {([1, 3] as SlamDuration[]).map((d) => {
              const on = duration === d;
              return (
                <Pressable
                  key={d}
                  onClick={() => {
                    navigator.vibrate?.(15);
                    setDuration(d);
                    setSound(null);
                  }}
                  className={`rounded-2xl py-4 text-center ring-1 ${
                    on
                      ? "bg-gold text-black ring-gold"
                      : "bg-white/[0.05] text-foreground ring-white/10"
                  }`}
                >
                  <span className="text-[19px] font-extrabold">{d} MIN</span>
                </Pressable>
              );
            })}
          </div>
          <p className="mt-1.5 text-[10.5px] text-muted-foreground">
            Uniquement 1 ou 3 minutes — c'est la règle de la scène.
          </p>

          {/* AMBIANCE */}
          <p className="mt-3 text-[10px] font-bold tracking-[0.14em] text-muted-foreground">
            AMBIANCE MUSICALE
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {MOODS.map((m) => {
              const on = mood === m.id;
              return (
                <Pressable
                  key={m.id}
                  onClick={() => {
                    navigator.vibrate?.(15);
                    setMood(m.id);
                    setSound(null);
                  }}
                  className={`rounded-full px-3 py-1.5 text-[11.5px] font-bold ring-1 ${
                    on
                      ? "bg-gold text-black ring-gold"
                      : "bg-white/[0.05] text-foreground ring-white/10"
                  }`}
                >
                  {m.emoji} {m.label}
                </Pressable>
              );
            })}
          </div>

          {/* MÉLODIES */}
          {!noMusic && tracks.length > 0 && (
            <>
              <p className="mt-4 text-[10px] font-bold tracking-[0.14em] text-muted-foreground">
                INSTRUMENTALES {moodOf(mood!).label.toUpperCase()} · {duration} MIN
              </p>
              <div className="mt-1.5 flex flex-col gap-1.5">
                {tracks.map((s) => {
                  const on = sound?.id === s.id;
                  const isPlaying = playing === s.id;
                  return (
                    <div
                      key={s.id}
                      className={`flex items-center gap-2 rounded-2xl p-2.5 ring-1 ${
                        on ? "bg-gold/15 ring-gold/60" : "bg-white/[0.035] ring-white/8"
                      }`}
                    >
                      <Pressable
                        onClick={() => {
                          navigator.vibrate?.(15);
                          setSound(s);
                        }}
                        className="min-w-0 flex-1 text-left"
                      >
                        <p className="truncate text-[13px] font-bold text-foreground">{s.name}</p>
                        <p className="text-[10.5px] text-muted-foreground">
                          {moodOf(s.mood).emoji} {moodOf(s.mood).label} ·{" "}
                          {s.duration === 1 ? "1:00" : "3:00"}
                        </p>
                      </Pressable>
                      <Pressable
                        onClick={() => preview(s)}
                        className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1.5 text-[10.5px] font-bold ${
                          isPlaying ? "bg-gold text-black" : "bg-white/10 text-white/85"
                        }`}
                        aria-label={`Aperçu de ${s.name}`}
                      >
                        {isPlaying ? (
                          <>
                            <Pause size={12} /> lecture…
                          </>
                        ) : (
                          <>
                            <Play size={12} /> Aperçu
                          </>
                        )}
                      </Pressable>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {noMusic && (
            <p className="mt-3 rounded-2xl bg-white/[0.035] p-3 text-[11.5px] text-muted-foreground">
              Tu slameras a cappella — aucune mélodie ne sera lancée.
            </p>
          )}
        </div>

        <div className="border-t border-white/8 bg-gradient-to-t from-black/60 to-transparent px-3 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
          <Pressable
            disabled={!ready}
            onClick={() => {
              if (!ready) return;
              navigator.vibrate?.(15);
              onSubmit({ title: title.trim(), duration: duration!, mood: mood!, sound });
            }}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-[14px] font-extrabold ${
              ready ? "bg-gold text-black" : "bg-white/[0.06] text-white/35"
            }`}
          >
            <Mic size={16} /> Envoyer ma demande
          </Pressable>
        </div>
      </motion.div>
    </>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Music2,
  Pause,
  Pencil,
  Play,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Pressable } from "@/components/zembo/ui";
import { useSoundPreview } from "@/lib/use-sound-preview";
import { MOODS, ZEMBO_SOUNDS, moodOf, type SlamDuration } from "@/lib/zembo-sounds";

export const Route = createFileRoute("/admin/sounds")({
  head: () => ({
    meta: [
      { title: "Zembo Sounds — Bibliothèque musicale (admin)" },
      {
        name: "description",
        content:
          "Aperçu du panneau admin Zembo Sounds : bibliothèque des instrumentales de Slam Thérapie, par ambiance et durée.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Zembo Sounds — Bibliothèque musicale (admin)" },
      {
        property: "og:description",
        content: "Maquette du back-office musical de Zembo — non fonctionnel.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminSounds,
});

function AdminSounds() {
  const [filter, setFilter] = useState<string | null>(null);
  const [form, setForm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const pv = useSoundPreview();

  const show = (t: string) => {
    navigator.vibrate?.(12);
    setToast(t);
    setTimeout(() => setToast(null), 1600);
  };

  const list = useMemo(
    () => (filter ? ZEMBO_SOUNDS.filter((s) => s.mood === filter) : ZEMBO_SOUNDS),
    [filter],
  );

  const chips = MOODS.filter((m) => m.id !== "aucune");

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[oklch(0.07_0.006_60)]">
      {/* EN-TÊTE */}
      <header className="border-b border-white/8 px-3 pt-[max(10px,env(safe-area-inset-top))] pb-2.5">
        <div className="flex items-center gap-2">
          <Link
            to="/talk-show/slam-therapie"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/[0.07] text-white/75"
            aria-label="Retour"
          >
            <ArrowLeft size={16} />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="flex items-center gap-1.5 truncate text-[14.5px] font-extrabold text-foreground">
              <Music2 size={14} className="shrink-0 text-gold" />
              Zembo Sounds — Bibliothèque
            </h1>
            <p className="text-[9.5px] text-muted-foreground">
              Aperçu du panneau admin — non fonctionnel
            </p>
          </div>
          <span className="shrink-0 rounded-md bg-white/[0.07] px-1.5 py-[2px] text-[9px] font-bold tracking-wider text-white/60">
            ADMIN
          </span>
        </div>

        <Pressable
          onClick={() => {
            navigator.vibrate?.(12);
            setForm(true);
          }}
          className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-gold/90 py-2.5 text-[12.5px] font-extrabold text-black"
        >
          <Plus size={15} /> Ajouter une musique
        </Pressable>

        {/* FILTRES */}
        <div className="no-scrollbar mt-2.5 -mx-3 flex gap-1.5 overflow-x-auto px-3">
          <Pressable
            onClick={() => setFilter(null)}
            className={`shrink-0 rounded-full px-2.5 py-1 text-[10.5px] font-bold ring-1 ${
              filter === null
                ? "bg-gold text-black ring-gold"
                : "bg-white/[0.05] text-white/70 ring-white/10"
            }`}
          >
            Toutes ({ZEMBO_SOUNDS.length})
          </Pressable>
          {chips.map((m) => (
            <Pressable
              key={m.id}
              onClick={() => setFilter(m.id)}
              className={`shrink-0 rounded-full px-2.5 py-1 text-[10.5px] font-bold ring-1 ${
                filter === m.id
                  ? "bg-gold text-black ring-gold"
                  : "bg-white/[0.05] text-white/70 ring-white/10"
              }`}
            >
              {m.emoji} {m.label}
            </Pressable>
          ))}
        </div>
      </header>

      {/* TABLEAU */}
      <div className="app-scroll min-h-0 flex-1 px-3 py-2.5">
        <div className="flex items-center gap-2 px-1 pb-1.5 text-[9px] font-bold tracking-[0.12em] text-white/40">
          <span className="flex-1">MORCEAU</span>
          <span className="w-[42px] text-center">DURÉE</span>
          <span className="w-[86px] text-right">ACTIONS</span>
        </div>

        <div className="overflow-hidden rounded-xl ring-1 ring-white/8">
          {list.map((s, i) => {
            const isCurrent = pv.id === s.id;
            return (
              <div
                key={s.id}
                className={`px-2.5 py-2 ${i % 2 ? "bg-white/[0.02]" : "bg-white/[0.045]"}`}
              >
                <div className="flex items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12.5px] font-bold text-foreground">{s.name}</p>
                    <p className="truncate text-[10px] text-muted-foreground">
                      {moodOf(s.mood).emoji} {moodOf(s.mood).label}
                    </p>
                  </div>
                  <span className="w-[42px] shrink-0 text-center text-[10.5px] font-bold text-gold">
                    {s.duration === 1 ? "1:00" : "3:00"}
                  </span>
                  <div className="flex w-[86px] shrink-0 items-center justify-end gap-1">
                    <Pressable
                      onClick={() => pv.toggle(s.id, s.duration)}
                      className={`grid h-7 w-7 place-items-center rounded-lg ${
                        isCurrent ? "bg-gold text-black" : "bg-white/10 text-white/80"
                      }`}
                      aria-label={`Aperçu de ${s.name}`}
                    >
                      {isCurrent && pv.playing ? <Pause size={13} /> : <Play size={13} />}
                    </Pressable>
                    <Pressable
                      onClick={() => show("Modification — bientôt disponible")}
                      className="grid h-7 w-7 place-items-center rounded-lg bg-white/10 text-white/70"
                      aria-label="Modifier"
                    >
                      <Pencil size={13} />
                    </Pressable>
                    <Pressable
                      onClick={() => show("Suppression — bientôt disponible")}
                      className="grid h-7 w-7 place-items-center rounded-lg bg-white/10 text-[oklch(0.68_0.19_25)]"
                      aria-label="Supprimer"
                    >
                      <Trash2 size={13} />
                    </Pressable>
                  </div>
                </div>
                {isCurrent && (
                  <div className="mt-1.5 h-[3px] overflow-hidden rounded-full bg-white/12">
                    <div
                      className="h-full rounded-full bg-gold transition-[width] duration-150 ease-linear"
                      style={{ width: `${pv.progress * 100}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-2.5 px-1 text-[10px] text-muted-foreground">
          {list.length} morceau{list.length > 1 ? "x" : ""} · versions 1:00 et 3:00 · aperçus simulés
          (aucun son)
        </p>
        <div className="h-6" />
      </div>

      {/* FORMULAIRE MAQUETTE */}
      <AnimatePresence>
        {form && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setForm(false)}
              className="absolute inset-0 z-40 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="absolute inset-x-0 bottom-0 z-50 rounded-t-3xl bg-[oklch(0.1_0.008_60)] px-3 pt-3 pb-[max(14px,env(safe-area-inset-bottom))] ring-1 ring-white/10"
            >
              <div className="flex items-center gap-2">
                <p className="flex-1 text-[14px] font-extrabold text-foreground">
                  Ajouter une musique
                </p>
                <Pressable
                  onClick={() => setForm(false)}
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/75"
                  aria-label="Fermer"
                >
                  <X size={15} />
                </Pressable>
              </div>

              <p className="mt-2.5 text-[9.5px] font-bold tracking-[0.14em] text-muted-foreground">
                NOM DU MORCEAU
              </p>
              <div className="mt-1 rounded-xl bg-white/[0.05] px-3 py-2.5 text-[12.5px] text-white/35 ring-1 ring-white/10">
                Ex. : Renaissance
              </div>

              <p className="mt-2.5 text-[9.5px] font-bold tracking-[0.14em] text-muted-foreground">
                AMBIANCE
              </p>
              <div className="mt-1 flex items-center justify-between rounded-xl bg-white/[0.05] px-3 py-2.5 text-[12.5px] text-white/55 ring-1 ring-white/10">
                Piano <span className="text-white/35">▾</span>
              </div>

              <p className="mt-2.5 text-[9.5px] font-bold tracking-[0.14em] text-muted-foreground">
                DURÉE
              </p>
              <div className="mt-1 grid grid-cols-2 gap-2">
                {([1, 3] as SlamDuration[]).map((d) => (
                  <div
                    key={d}
                    className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-[12.5px] font-bold ring-1 ${
                      d === 1
                        ? "bg-gold/15 text-gold ring-gold/50"
                        : "bg-white/[0.05] text-white/55 ring-white/10"
                    }`}
                  >
                    {d === 1 && <Check size={13} />} {d === 1 ? "1:00" : "3:00"}
                  </div>
                ))}
              </div>

              <div className="mt-3 grid place-items-center gap-1 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-3 py-5 opacity-60">
                <Upload size={18} className="text-white/45" />
                <p className="text-[12px] font-bold text-white/55">Déposer le fichier audio</p>
                <p className="text-[10px] text-muted-foreground">
                  Upload disponible dans l'app — bientôt
                </p>
              </div>

              <Pressable
                onClick={() => {
                  setForm(false);
                  show("Maquette — enregistrement non disponible");
                }}
                className="mt-3 w-full rounded-xl bg-white/[0.07] py-2.5 text-[12.5px] font-extrabold text-white/45"
              >
                Enregistrer le morceau
              </Pressable>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="pointer-events-none absolute bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-black/85 px-3.5 py-2 text-[11.5px] font-semibold text-white ring-1 ring-white/12"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

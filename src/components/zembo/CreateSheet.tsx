import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, ChevronRight, X } from "lucide-react";
import { BottomSheet } from "./Sheet";
import { Pressable } from "./ui";
import { ZemboWordmark } from "./ZemboMark";
import { IMG } from "@/lib/zembo-data";

const OPTIONS = [
  {
    id: "talk",
    title: "Talk Show",
    desc: "Lance un débat, une discussion ou ton émission en direct.",
    chips: ["Débat", "Storytime", "Open Mic"],
    image: IMG.mic,
    accent: "oklch(0.82 0.13 85)",
    to: "/talk-show/$id",
  },
  {
    id: "table",
    title: "Zembo Table",
    desc: "Réunis 4 à 10 personnes autour d'une table interactive.",
    chips: ["Discussions", "Jeux", "Cartes"],
    image: IMG.table,
    accent: "oklch(0.62 0.24 300)",
    to: "/table/$id",
  },
  {
    id: "play",
    title: "Play & Fun",
    desc: "Lance un jeu et défie ta communauté.",
    chips: ["Quiz", "Hot Seat", "Face à Face"],
    image: IMG.play,
    accent: "oklch(0.68 0.16 158)",
    to: "/play",
  },

  {
    id: "world",
    title: "World Room",
    desc: "Crée un espace communautaire autour d'un thème ou d'une ville.",
    chips: ["Culture", "Ville", "Communauté"],
    image: IMG.world,
    accent: "oklch(0.65 0.19 250)",
    to: "/table/$id",
  },
] as const;

export function CreateSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="px-4 pb-2 text-center">
        <ZemboWordmark className="text-[16px]" />
        <h1 className="mt-3 text-[26px] leading-tight font-extrabold">
          Que veux-tu
          <br />
          <span className="text-gold-gradient">créer aujourd'hui ?</span>
        </h1>
        <p className="mt-2 text-[13px] text-muted-foreground">
          Partage, joue, débat, connecte-toi avec ta communauté ✨
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 px-4">
        {OPTIONS.map((o) => (
          <Pressable
            key={o.id}
            onClick={() => {
              onClose();
              navigate({ to: o.to, params: { id: o.id } });
            }}
            className="card-surface relative overflow-hidden rounded-2xl p-2.5 text-left"
            style={{ borderColor: `color-mix(in oklab, ${o.accent} 40%, transparent)` }}
          >
            <div
              className="absolute inset-x-0 top-0 h-24 opacity-25 blur-xl"
              style={{ background: o.accent }}
            />
            <img
              src={o.image}
              alt=""
              loading="lazy"
              className="relative h-[86px] w-full rounded-xl object-cover"
            />
            <h3 className="relative mt-2 text-[15px] font-bold">{o.title}</h3>
            <p className="relative mt-1 text-[11px] leading-snug text-muted-foreground">{o.desc}</p>
            <div className="relative mt-2 flex flex-wrap gap-1">
              {o.chips.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-white/8 px-2 py-0.5 text-[10px] text-foreground/75"
                >
                  {c}
                </span>
              ))}
            </div>
            <span
              className="relative mt-2.5 ml-auto flex h-7 w-7 items-center justify-center rounded-full"
              style={{ background: o.accent }}
            >
              <ArrowRight size={15} className="text-black/80" />
            </span>
          </Pressable>
        ))}
      </div>

      <div className="mt-3 px-4">
        <div className="card-surface flex items-center gap-3 rounded-2xl px-3 py-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[oklch(0.65_0.18_45)]/15">
            <CalendarDays size={19} className="text-[oklch(0.75_0.16_50)]" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 text-sm font-semibold">
              Planifier un événement
              <span className="rounded-full border border-border px-1.5 py-0.5 text-[9px] text-muted-foreground">
                Bientôt
              </span>
            </p>
            <p className="truncate text-[11px] text-muted-foreground">Programme un Live pour plus tard</p>
          </div>
          <ChevronRight size={17} className="text-muted-foreground" />
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <Pressable
          onClick={onClose}
          aria-label="Fermer"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface/70"
        >
          <X size={19} className="text-foreground/80" />
        </Pressable>
      </div>
    </BottomSheet>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronDown, Info, Mic, MoreVertical, Users } from "lucide-react";
import { IMG, tableChat, tableSeats } from "@/lib/zembo-data";
import { Avatar, AvatarStack, Pressable } from "@/components/zembo/ui";
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

const REACTIONS = [
  { emoji: "❤️", count: 12 },
  { emoji: "🔥", count: 8 },
  { emoji: "👏", count: 15 },
  { emoji: "😄", count: 6 },
  { emoji: "💯", count: 5 },
];

function TableRoom() {
  const navigate = useNavigate();

  return (
    <div className="pb-4">
      <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-border/50 bg-background/85 px-4 pt-[max(env(safe-area-inset-top),12px)] pb-3 backdrop-blur-xl">
        <Pressable onClick={() => navigate({ to: "/" })} aria-label="Fermer">
          <ChevronDown size={22} className="text-foreground/80" />
        </Pressable>
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <ZemboIcon size={20} />
          <div className="min-w-0">
            <p className="truncate text-[12px] font-bold tracking-[0.15em] text-gold uppercase">Zembo Table</p>
            <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Users size={11} /> 6 / 10
            </p>
          </div>
        </div>
        <Pressable className="shrink-0 rounded-full border border-gold/60 px-3 py-1.5 text-[11.5px] font-semibold text-gold">
          Quitter
        </Pressable>
        <MoreVertical size={18} className="text-muted-foreground" />
      </header>

      <div className="mt-3 grid grid-cols-2 gap-3 px-4">
        <div className="card-surface rounded-2xl p-3">
          <p className="text-[10.5px] text-muted-foreground">Thème de la table</p>
          <p className="mt-1 text-[12.5px] leading-snug font-semibold">
            L'amour et l'argent : peut-on tout partager ?
          </p>
          <p className="mt-2 rounded-full border border-border px-2 py-1 text-[11px] text-foreground/70">
            Deck : Relations ❤️
          </p>
        </div>
        <div className="card-surface rounded-2xl p-3">
          <p className="flex items-center justify-between text-[10.5px] text-muted-foreground">
            Règles <Info size={12} />
          </p>
          <ul className="mt-1 space-y-0.5 text-[11.5px] text-foreground/75">
            <li>Respect & bienveillance</li>
            <li>Chacun son tour</li>
            <li>Pas d'attaque personnelle</li>
          </ul>
          <p className="mt-1.5 text-[11px] font-semibold text-gold">Plus d'infos</p>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase">Tour de</p>
        <p className="text-[22px] font-extrabold text-gold">DEENA</p>
        <span className="mt-1 inline-block rounded-full border border-gold/60 px-3 py-1 text-[12.5px] font-bold text-gold">
          00:45
        </span>
      </div>

      {/* Table */}
      <div className="relative mx-4 mt-4 overflow-hidden rounded-3xl border border-gold/25">
        <img src={IMG.table} alt="Table Zembo" loading="lazy" className="h-[280px] w-full object-cover" />
        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute inset-0 p-3">
          <div className="relative h-full w-full">
            {tableSeats.map((s, i) => {
              const angle = (i / tableSeats.length) * Math.PI * 2 - Math.PI / 2;
              const left = 50 + Math.cos(angle) * 36;
              const top = 50 + Math.sin(angle) * 36;
              return (
                <div
                  key={s.n}
                  className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
                  style={{ left: `${left}%`, top: `${top}%` }}
                >
                  <span className={`relative rounded-full p-[2px] ${s.you ? "bg-gold-gradient" : "bg-white/25"}`}>
                    <Avatar name={s.name} size={44} />
                    <span className="absolute -top-1 -left-1 flex h-4 w-4 items-center justify-center rounded-full bg-black/80 text-[9px] font-bold text-gold">
                      {s.n}
                    </span>
                    <span className="absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/80">
                      <Mic size={10} className="text-white/80" />
                    </span>
                  </span>
                  <span className="rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold whitespace-nowrap text-white">
                    {s.name}
                  </span>
                  {s.host && (
                    <span className="rounded-md bg-violet px-1.5 py-0.5 text-[8.5px] font-bold text-white">
                      ★ HÔTE
                    </span>
                  )}
                </div>
              );
            })}

            <div className="absolute top-1/2 left-1/2 w-[132px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gold/50 bg-black/80 p-2.5 text-center">
              <p className="text-[9px] tracking-widest text-gold uppercase">Question</p>
              <p className="mt-1.5 text-[11px] leading-snug text-white/90">
                Quelle est la chose que tu as déjà pardonnée en amour et que tu ne pardonnerais plus jamais ?
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Spectateurs + réactions */}
      <div className="card-surface mx-4 mt-3 rounded-2xl p-3">
        <p className="text-[12px] font-bold tracking-wide text-foreground/85 uppercase">Spectateurs (23)</p>
        <div className="mt-2">
          <AvatarStack names={["Ben", "Emma", "Kader", "Nadia", "Inès", "Marc"]} extra={17} size={28} />
        </div>
        <p className="mt-3 text-[12px] font-bold tracking-wide text-foreground/85 uppercase">Réagir</p>
        <div className="mt-2 flex gap-2">
          {REACTIONS.map((r) => (
            <Pressable
              key={r.emoji}
              className="flex flex-1 flex-col items-center rounded-xl border border-border bg-surface-2/60 py-2"
            >
              <span className="text-[17px]">{r.emoji}</span>
              <span className="text-[10.5px] text-muted-foreground">{r.count}</span>
            </Pressable>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="card-surface mx-4 mt-3 rounded-2xl p-3">
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-bold tracking-wide text-foreground/85 uppercase">Chat</p>
          <span className="rounded-full border border-border px-2 py-1 text-[11px] text-muted-foreground">
            🌐 Tout le monde
          </span>
        </div>
        <div className="mt-2.5 space-y-2.5">
          {tableChat.map((m) => (
            <div key={m.id} className="flex items-start gap-2">
              <Avatar name={m.name} size={26} />
              <div className="min-w-0 flex-1">
                <p className="flex justify-between text-[11.5px] font-semibold text-gold/85">
                  {m.name} <span className="text-muted-foreground">{m.time}</span>
                </p>
                <p className="text-[12.5px] text-foreground/85">{m.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <input
            placeholder="Écris ton message…"
            className="min-w-0 flex-1 rounded-full border border-border bg-surface-2/70 px-3.5 py-2.5 text-[13px] outline-none placeholder:text-muted-foreground"
          />
          <Pressable
            aria-label="Envoyer"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-gradient text-[oklch(0.16_0.02_60)]"
          >
            ➤
          </Pressable>
        </div>
      </div>
    </div>
  );
}

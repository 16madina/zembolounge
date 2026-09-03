import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ChevronDown,
  Gift,
  Hand,
  Heart,
  MicVocal,
  MoreHorizontal,
  Share2,
  Smile,
  UserPlus,
  Users,
  Vote,
} from "lucide-react";
import { IMG, guests, showChat } from "@/lib/zembo-data";
import { Avatar, LiveBadge, Pressable } from "@/components/zembo/ui";

export const Route = createFileRoute("/talk-show/$id")({
  head: () => ({
    meta: [
      { title: "Talk Show en direct — Zembo" },
      {
        name: "description",
        content: "Un talk show Zembo en direct : invités, chat, votes, cadeaux et réactions.",
      },
      { property: "og:title", content: "Talk Show en direct — Zembo" },
      {
        property: "og:description",
        content: "Rejoins le débat en direct, demande la parole et réagis avec la communauté.",
      },
    ],
  }),
  component: TalkShow,
});

const ACTIONS = [
  { icon: Hand, label: "Demander" },
  { icon: UserPlus, label: "Inviter" },
  { icon: Vote, label: "Voter" },
  { icon: Gift, label: "Cadeau" },
  { icon: Smile, label: "Réagir" },
  { icon: MoreHorizontal, label: "Plus" },
];

function TalkShow() {
  const navigate = useNavigate();

  return (
    <div className="pb-4">
      {/* Scène */}
      <div className="relative">
        <img src={IMG.mic} alt="Scène du talk show" width={768} height={512} className="h-[300px] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-transparent to-background" />

        <div className="absolute inset-x-0 top-0 flex items-start gap-2 px-4 pt-[max(env(safe-area-inset-top),12px)]">
          <Pressable onClick={() => navigate({ to: "/live" })} aria-label="Fermer" className="mt-1">
            <ChevronDown size={24} className="text-white" />
          </Pressable>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 text-[13px] font-bold tracking-wide text-white">
              TALK SHOW <LiveBadge />
            </p>
            <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-white/85">
              Un homme doit-il payer toutes les factures ?
            </p>
            <p className="mt-1 flex items-center gap-1 text-[11.5px] text-white/70">
              <Users size={12} /> 1.2K
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Pressable className="rounded-full border border-gold/60 px-3 py-1.5 text-[12px] font-semibold text-gold">
              Suivre
            </Pressable>
            <Pressable
              aria-label="Partager"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/45 backdrop-blur-sm"
            >
              <Share2 size={16} className="text-white" />
            </Pressable>
          </div>
        </div>

        <div className="absolute right-4 top-[104px] flex flex-col items-end gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-[12px] font-medium text-white backdrop-blur-sm">
            <MicVocal size={13} /> Débat
          </span>
          <span className="rounded-full bg-black/55 px-3 py-1.5 text-[12px] font-bold text-white backdrop-blur-sm">
            HOT SEAT 🔥
          </span>
        </div>

        <div className="absolute bottom-4 left-4">
          <p className="text-[11px] font-bold text-gold">👑 HOST</p>
          <p className="flex items-center gap-1 text-[19px] font-extrabold text-white">Deena ✔</p>
        </div>
      </div>

      {/* Invités */}
      <div className="snap-row -mt-2 gap-2.5 px-4">
        {guests.map((g, i) => (
          <div
            key={g.name}
            className={`relative h-[104px] w-[112px] overflow-hidden rounded-2xl border ${
              i === 1 ? "border-gold" : "border-border"
            }`}
          >
            <div className="flex h-full w-full items-center justify-center bg-surface-2">
              <Avatar name={g.name} size={54} />
            </div>
            <span
              className={`absolute top-1.5 left-1.5 rounded-md px-1.5 py-0.5 text-[9px] font-bold text-white ${
                g.role === "CO-HOST" ? "bg-gold text-[oklch(0.16_0.02_60)]" : "bg-violet"
              }`}
            >
              {g.role}
            </span>
            <span className="absolute bottom-1.5 left-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[11px] font-semibold text-white">
              {g.name}
            </span>
          </div>
        ))}
      </div>

      {/* Chat */}
      <div className="card-surface mx-4 mt-4 rounded-2xl p-3">
        <div className="space-y-2.5">
          {showChat.map((m) => (
            <div key={m.id} className="flex items-start gap-2">
              <Avatar name={m.name} size={26} />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-[11.5px] font-semibold text-gold/85">
                  {m.name}
                  {m.tag && (
                    <span className="rounded-md bg-violet/25 px-1.5 py-0.5 text-[9px] font-bold text-violet">
                      💎 {m.tag}
                    </span>
                  )}
                </p>
                <p className="text-[12.5px] text-foreground/85">{m.text}</p>
              </div>
              <Heart size={14} className="mt-1 shrink-0 fill-live text-live" />
            </div>
          ))}
          <div className="rounded-xl border border-gold/25 bg-gold/8 p-2.5">
            <p className="text-[11.5px] font-semibold text-gold">ZEMBO ✔ 📌</p>
            <p className="text-[12px] text-foreground/80">
              N'oubliez pas de rester respectueux dans le chat. Amusez-vous ! ✨
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <input
            placeholder="Écrire un message…"
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

      {/* Actions */}
      <div className="snap-row mt-3 gap-2 px-4">
        {ACTIONS.map((a) => (
          <Pressable
            key={a.label}
            className="card-surface flex w-[86px] flex-col items-center gap-1 rounded-2xl py-2.5"
          >
            <a.icon size={19} className="text-gold" />
            <span className="text-[10.5px] font-medium text-foreground/80">{a.label}</span>
          </Pressable>
        ))}
      </div>
    </div>
  );
}

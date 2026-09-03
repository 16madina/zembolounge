import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, HelpCircle, MicOff, MoreVertical, Send, Smile, Timer, Users } from "lucide-react";
import { photoUrl } from "@/components/zembo/PhotoAvatar";
import { Pressable } from "@/components/zembo/ui";
import { ZemboIcon } from "@/components/zembo/ZemboMark";
import { IMG } from "@/lib/zembo-data";

export const Route = createFileRoute("/play_/hot-seat")({
  head: () => ({
    meta: [
      { title: "Hot Seat en direct — Zembo" },
      {
        name: "description",
        content:
          "Hot Seat : un joueur sur la chaise chaude répond aux questions des autres avant la fin du chrono, devant les spectateurs.",
      },
      { property: "og:title", content: "Hot Seat en direct — Zembo" },
      {
        property: "og:description",
        content: "Questions cash, joker et chat en direct : qui sera le champion du Hot Seat ?",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HotSeat,
});

const SIDE = [
  { name: "Moussa", tint: "oklch(0.6 0.16 250)" },
  { name: "Karim", tint: "oklch(0.6 0.14 240)" },
  { name: "Sarah", tint: "oklch(0.6 0.16 30)" },
  { name: "Aïcha", tint: "oklch(0.6 0.2 320)" },
  { name: "Yann", tint: "oklch(0.6 0.17 260)" },
  { name: "Djeneba", tint: "oklch(0.6 0.2 330)" },
];

const CHAT = [
  { name: "FanZembo", text: "Deena toujours cash 🤣🔥", color: "oklch(0.7 0.2 300)", time: "21:45" },
  { name: "MisterYann", text: "Hâte de voir sa réponse 👀", color: "oklch(0.7 0.16 250)", time: "21:45" },
  { name: "QueenLina", text: "Cette question est intense 😳", color: "oklch(0.7 0.2 320)", time: "21:45" },
  { name: "Moussa92", text: "Je parie qu'elle va dire la vérité !", color: "oklch(0.7 0.16 250)", time: "21:45" },
  { name: "AïchaLove", text: "Let's go Deena !!! 👏🔥", color: "oklch(0.7 0.2 310)", time: "21:45" },
];

function HotSeat() {
  const navigate = useNavigate();

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-[max(env(safe-area-inset-top),12px)]">
        <Pressable onClick={() => navigate({ to: "/play" })} aria-label="Retour">
          <ChevronLeft size={22} className="text-gold" />
        </Pressable>
        <ZemboIcon size={20} />
        <h1 className="text-[19px] font-extrabold tracking-tight">
          🔥 <span className="text-[oklch(0.68_0.2_38)]">HOT</span> SEAT
        </h1>
        <Pressable aria-label="Plus" className="ml-auto">
          <MoreVertical size={18} className="text-foreground/70" />
        </Pressable>
      </div>

      <div className="snap-row mt-3 gap-2 px-4">
        <span className="flex items-center gap-1.5 rounded-full bg-violet/25 px-3 py-1.5 text-[11px] font-bold text-violet">
          ROUND <span className="text-foreground">1 / 3</span>
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11px] text-foreground/80">
          <Users size={12} /> Joueurs : 7
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11px] text-foreground/80">
          <Users size={12} /> Spectateurs : 124
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[10px] font-bold tracking-wide text-foreground/75">
          <HelpCircle size={12} /> COMMENT ÇA MARCHE ?
        </span>
      </div>

      {/* Scène chaise chaude */}
      <div className="mx-4 mt-3 overflow-hidden rounded-3xl border border-[oklch(0.6_0.2_35_/_45%)]">
        <p className="bg-[oklch(0.14_0.03_35)] py-2 text-center text-[12.5px] font-extrabold tracking-wide">
          🔥 DEENA EST SUR LA CHAISE CHAUDE 🔥
        </p>
        <div className="relative">
          <img
            src={IMG.mic}
            alt="Deena sur la chaise chaude"
            width={768}
            height={512}
            className="h-[220px] w-full object-cover"
          />
          <div className="absolute inset-0 bg-[oklch(0.5_0.2_35)]/20" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[oklch(0.09_0.008_60)] to-transparent" />
          <p className="absolute left-4 top-3 text-[15px] font-extrabold tracking-[0.2em] text-[oklch(0.7_0.22_35)]">
            HOT
          </p>
          <p className="absolute right-4 top-3 text-[15px] font-extrabold tracking-[0.2em] text-[oklch(0.7_0.22_35)]">
            SEAT
          </p>
        </div>

        {/* Question */}
        <div className="border-t border-violet/25 bg-[oklch(0.1_0.01_290)] p-3.5">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-violet/25 px-2.5 py-1 text-[10.5px] font-bold text-violet">
              QUESTION <span className="text-foreground">2 / 3</span>
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-gold/60 px-2.5 py-1 text-[11px] font-bold text-gold">
              <Timer size={12} /> 00:30
            </span>
          </div>
          <h2 className="mt-3 text-center text-[15.5px] leading-snug font-bold">
            Quelle est la chose que tu ne pardonnerais jamais dans une relation ?
          </h2>
          <Pressable className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-gold/60 py-2.5 text-[11.5px] font-bold tracking-wide text-gold">
            🃏 UTILISER MON JOKER <span className="text-muted-foreground">1 / 1</span>
          </Pressable>
        </div>
      </div>

      {/* Joueurs */}
      <div className="snap-row mt-3 gap-2 px-4">
        {SIDE.map((s) => (
          <div
            key={s.name}
            className="relative h-[124px] w-[104px] overflow-hidden rounded-2xl border border-border"
            style={{ background: `linear-gradient(180deg, ${s.tint}, oklch(0.1 0.008 60))` }}
          >
            <img
              src={photoUrl(s.name, 200)}
              alt={s.name}
              loading="lazy"
              className="h-full w-full object-cover opacity-90"
            />
            <span className="absolute left-1.5 top-1.5 rounded-md bg-black/55 px-1.5 py-0.5 text-[10.5px] font-semibold text-white">
              {s.name}
            </span>
            <span className="absolute right-1.5 top-2 h-2 w-2 rounded-full bg-emerald" />
            <MicOff size={13} className="absolute bottom-1.5 left-1.5 text-live" />
          </div>
        ))}
      </div>

      {/* Chat */}
      <div className="mx-4 mt-3 rounded-2xl border border-border bg-[oklch(0.11_0.008_60)] p-3">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-extrabold tracking-wide">CHAT</p>
          <Pressable className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[10.5px] font-semibold text-foreground/80">
            <Smile size={12} /> RÉACTION
          </Pressable>
        </div>
        <div className="mt-2.5 space-y-2.5">
          {CHAT.map((c) => (
            <div key={c.name} className="flex items-center gap-2">
              <img
                src={photoUrl(c.name, 64)}
                alt=""
                loading="lazy"
                className="h-7 w-7 shrink-0 rounded-full object-cover"
              />
              <p className="min-w-0 flex-1 text-[12.5px]">
                <span className="font-semibold" style={{ color: c.color }}>
                  {c.name}
                </span>{" "}
                <span className="text-foreground/85">{c.text}</span>
              </p>
              <span className="shrink-0 text-[10.5px] text-muted-foreground">{c.time}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <input
            placeholder="Écrire un message…"
            className="min-w-0 flex-1 rounded-full border border-border bg-surface-2/60 px-3.5 py-2.5 text-[13px] outline-none placeholder:text-muted-foreground"
          />
          <Pressable
            aria-label="Envoyer"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet"
          >
            <Send size={16} className="text-white" />
          </Pressable>
        </div>
      </div>

      <p className="mt-4 text-center text-[11.5px] tracking-wide text-muted-foreground">
        QUI SERA LE OU LA CHAMPION(NE) DU <span className="font-bold text-gold">HOT SEAT</span> ? 👑
      </p>
    </div>
  );
}

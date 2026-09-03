import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Crown, Eye, Gift, Info, Lock, MoreVertical, Send, Timer } from "lucide-react";
import { BrainZIcon, PodiumBase } from "@/components/zembo/GameIcons";
import { photoUrl } from "@/components/zembo/PhotoAvatar";
import { Pressable } from "@/components/zembo/ui";

export const Route = createFileRoute("/play_/quiz")({
  head: () => ({
    meta: [
      { title: "Zembo Quiz en direct — Zembo" },
      {
        name: "description",
        content:
          "Zembo Quiz : séries de 5 questions, réponses secrètes, éliminations et classement en direct avec les spectateurs.",
      },
      { property: "og:title", content: "Zembo Quiz en direct — Zembo" },
      {
        property: "og:description",
        content: "Réponds avant la fin du chrono, reste en jeu et grimpe au classement.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Quiz,
});

const PLAYERS = [
  { name: "Deena", host: true },
  { name: "Moussa", host: false },
  { name: "Sarah", host: false },
  { name: "Karim", host: false },
  { name: "Ami", host: false },
  { name: "Yao", host: false },
  { name: "Nadège", host: false },
  { name: "Ibrahim", host: false },
];

const ANSWERS = [
  { k: "A", label: "Accra", tint: "oklch(0.7 0.18 150)" },
  { k: "B", label: "Lagos", tint: "oklch(0.66 0.19 250)" },
  { k: "C", label: "Nairobi", tint: "oklch(0.68 0.2 320)" },
];

const RANKING = [
  { n: 1, name: "Deena", score: "4 / 5", time: "21.4s", out: false },
  { n: 2, name: "Moussa", score: "4 / 5", time: "28.7s", out: false },
  { n: 3, name: "Sarah", score: "3 / 5", time: "18.2s", out: false },
  { n: 4, name: "Ami", score: "3 / 5", time: "24.6s", out: false },
  { n: 5, name: "Yao", score: "2 / 5", time: "30.1s", out: false },
  { n: 6, name: "Karim", score: "1 / 5", time: "29.3s", out: true },
  { n: 7, name: "Ibrahim", score: "1 / 5", time: "35.7s", out: true },
  { n: 8, name: "Nadège", score: "0 / 5", time: "–", out: true },
];

const CHAT = [
  { name: "Fatou", text: "Allez Deena ! 🔥", color: "oklch(0.72 0.2 320)" },
  { name: "Momo", text: "Je pense que c'est Accra 🤔", color: "oklch(0.7 0.17 250)" },
  { name: "Emma", text: "Bonne chance à tous ! 🎉", color: "oklch(0.75 0.15 155)" },
  { name: "Koffi", text: "Zembo Quiz le meilleur ! 💪", color: "oklch(0.85 0.13 85)" },
];

function Podium({ name, host }: { name: string; host: boolean }) {
  return (
    <div className="relative flex flex-col items-center overflow-hidden rounded-2xl border border-border bg-[linear-gradient(180deg,oklch(0.16_0.05_270),oklch(0.09_0.008_60))] px-2 pt-3">
      <div className="absolute inset-x-3 top-2 h-14 rounded-[100%] bg-azure/22 blur-xl" />
      {host && <Crown size={14} className="relative z-10 text-gold" />}
      <span className="relative z-10 mt-1">
        <img
          src={photoUrl(name, 160)}
          alt={name}
          loading="lazy"
          className="h-[54px] w-[54px] rounded-full object-cover"
          style={{
            border: `2px solid ${host ? "oklch(0.82 0.13 85)" : "oklch(0.68 0.16 158)"}`,
          }}
        />
      </span>
      <span className="relative z-10 mt-2 rounded-md border border-gold/45 bg-black/60 px-2 py-0.5 text-[10.5px] font-bold text-gold">
        {name}
      </span>
      <span className="relative z-10 mt-1 text-[8.5px] font-bold tracking-wide text-foreground/70">
        {host ? "HÔTE" : "PRÊT ✓"}
      </span>
      <span className="relative z-10 mt-1 -mb-1">
        <PodiumBase width={120} />
      </span>
    </div>
  );
}

function Quiz() {
  const navigate = useNavigate();

  return (
    <div className="pb-6">
      {/* Barre haute */}
      <div className="flex items-center gap-2 px-4 pt-[max(env(safe-area-inset-top),12px)]">
        <Pressable onClick={() => navigate({ to: "/play" })} aria-label="Retour">
          <ChevronLeft size={22} className="text-gold" />
        </Pressable>
        <BrainZIcon size={22} />
        <h1 className="text-[15px] font-extrabold tracking-tight">ZEMBO QUIZ</h1>
        <span className="ml-auto flex items-center gap-1 text-[12px] text-foreground/75">
          <Eye size={13} /> 128
        </span>
        <Pressable aria-label="Plus">
          <MoreVertical size={17} className="text-foreground/70" />
        </Pressable>
      </div>
      <p className="mt-2 px-4">
        <span className="inline-block rounded-full bg-gold-gradient px-3 py-1.5 text-[10.5px] font-extrabold tracking-wide text-[oklch(0.16_0.02_60)]">
          ROUND 2 — 8 JOUEURS EN JEU
        </span>
      </p>

      {/* Sous-barre */}
      <div className="mt-2.5 flex items-center justify-between gap-2 px-4">
        <span className="min-w-0 truncate rounded-full border border-border px-2.5 py-1.5 text-[10.5px] font-semibold text-foreground/80">
          SÉRIE 1 / 5 QUESTIONS — Question 2/5
        </span>
        <span className="flex shrink-0 items-center gap-1 text-[10.5px] font-bold tracking-wide text-gold">
          RÈGLES <Info size={12} />
        </span>
      </div>

      {/* Question */}
      <div className="relative mx-4 mt-3 overflow-hidden rounded-3xl border border-violet/35 bg-[linear-gradient(170deg,oklch(0.15_0.05_285),oklch(0.1_0.01_60))] p-4">
        <div className="absolute -top-10 left-1/2 h-24 w-40 -translate-x-1/2 rounded-[100%] bg-violet/30 blur-2xl" />
        <p className="relative flex justify-center">
          <span className="rounded-full bg-violet/25 px-3 py-1 text-[10.5px] font-bold text-violet">
            🌍 CULTURE GÉNÉRALE
          </span>
        </p>
        <h2 className="relative mt-3 text-center text-[18px] leading-snug font-extrabold">
          Quelle est la capitale du Ghana ?
        </h2>
        <div className="relative mt-3.5 space-y-2">
          {ANSWERS.map((a) => (
            <Pressable
              key={a.k}
              className="flex w-full items-center gap-3 rounded-2xl border border-border bg-[oklch(0.12_0.01_60)] px-3 py-2.5 text-left"
            >
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-extrabold text-white"
                style={{ background: a.tint }}
              >
                {a.k}
              </span>
              <span className="text-[14px] font-semibold">{a.label}</span>
            </Pressable>
          ))}
        </div>
      </div>

      {/* Chrono + réponses + éliminations */}
      <div className="mx-4 mt-3 flex items-center gap-3 rounded-2xl border border-border bg-[oklch(0.11_0.008_60)] p-3">
        <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-gold/70">
          <span className="text-center text-[10px] leading-[1.1] font-extrabold text-gold">
            10
            <br />
            SEC
          </span>
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold tracking-wide text-gold">10 SECONDES</p>
          <p className="mt-0.5 text-[12px] font-semibold text-gold/90">
            7/8 joueurs ont répondu
          </p>
        </div>
      </div>
      <div className="mx-4 mt-2 rounded-2xl border border-live/45 bg-[oklch(0.13_0.03_25)] p-3">
        <p className="text-[10.5px] font-extrabold tracking-wide text-live">ÉLIMINATIONS</p>
        <p className="mt-1 text-[12px] leading-snug text-foreground/80">
          À la fin de cette série, <span className="font-bold text-live">2 joueurs</span> seront
          éliminés
        </p>
      </div>

      {/* Podiums */}
      <div className="mt-3 grid grid-cols-2 gap-2.5 px-4">
        {PLAYERS.map((p) => (
          <Podium key={p.name} name={p.name} host={p.host} />
        ))}
      </div>

      {/* Réponses verrouillées */}
      <div className="mx-4 mt-3 flex items-center gap-3 rounded-2xl border border-border bg-[oklch(0.11_0.008_60)] p-3.5">
        <Lock size={18} className="shrink-0 text-gold" />
        <div>
          <p className="text-[12.5px] font-extrabold tracking-wide">RÉPONSES VERROUILLÉES 🔒</p>
          <p className="mt-0.5 text-[11.5px] text-muted-foreground">
            La réponse sera révélée à la fin du chrono
          </p>
        </div>
      </div>

      {/* Classement */}
      <div className="mx-4 mt-3 rounded-2xl border border-border bg-[oklch(0.11_0.008_60)] p-3">
        <p className="text-[12.5px] font-extrabold tracking-wide">CLASSEMENT SÉRIE 1</p>
        <div className="mt-2.5 space-y-2">
          {RANKING.map((r) => (
            <div key={r.n} className="flex items-center gap-2.5">
              <span
                className={`w-4 shrink-0 text-[12px] font-extrabold ${r.n <= 3 ? "text-gold" : "text-muted-foreground"}`}
              >
                {r.n}
              </span>
              <img
                src={photoUrl(r.name, 64)}
                alt=""
                loading="lazy"
                className="h-7 w-7 shrink-0 rounded-full object-cover"
              />
              <span className="min-w-0 flex-1 truncate text-[13px] font-semibold">{r.name}</span>
              <span
                className={`shrink-0 text-[12px] font-bold ${r.out ? "text-live" : "text-foreground/85"}`}
              >
                {r.score}
              </span>
              <span className="w-11 shrink-0 text-right text-[11px] text-muted-foreground">
                {r.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Réactions */}
      <div className="snap-row mt-3 gap-2 px-4">
        {["❤️ 48", "🔥 36", "👏 22"].map((r) => (
          <span
            key={r}
            className="rounded-full border border-border bg-surface/60 px-3 py-1.5 text-[12px] font-semibold"
          >
            {r}
          </span>
        ))}
        <Pressable className="flex items-center gap-1.5 rounded-full border border-gold/60 px-3 py-1.5 text-[11px] font-bold tracking-wide text-gold">
          <Gift size={13} /> CADEAUX
        </Pressable>
      </div>

      {/* Chat spectateurs */}
      <div className="mx-4 mt-3 rounded-2xl border border-border bg-[oklch(0.11_0.008_60)] p-3">
        <div className="flex items-center justify-between">
          <p className="text-[12.5px] font-extrabold tracking-wide">CHAT SPECTATEURS</p>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Timer size={12} /> en direct
          </span>
        </div>
        <div className="mt-2.5 space-y-2">
          {CHAT.map((c) => (
            <p key={c.name} className="text-[12.5px]">
              <span className="font-semibold" style={{ color: c.color }}>
                {c.name}
              </span>{" "}
              <span className="text-foreground/85">{c.text}</span>
            </p>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <input
            placeholder="Écrire un message…"
            className="min-w-0 flex-1 rounded-full border border-border bg-surface-2/60 px-3.5 py-2.5 text-[13px] outline-none placeholder:text-muted-foreground"
          />
          <Pressable
            aria-label="Envoyer"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-gradient"
          >
            <Send size={16} className="text-[oklch(0.16_0.02_60)]" />
          </Pressable>
        </div>
      </div>
    </div>
  );
}

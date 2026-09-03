import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Eye, Info, Lock, MoreVertical, Send } from "lucide-react";
import { PhotoAvatar, photoUrl } from "@/components/zembo/PhotoAvatar";
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
  { name: "Deena", role: "HÔTE", host: true },
  { name: "Moussa", role: "PRÊT ✓", host: false },
  { name: "Sarah", role: "PRÊT ✓", host: false },
  { name: "Karim", role: "PRÊT ✓", host: false },
  { name: "Ami", role: "PRÊT ✓", host: false },
  { name: "Yao", role: "PRÊT ✓", host: false },
  { name: "Nadège", role: "PRÊT ✓", host: false },
  { name: "Ibrahim", role: "PRÊT ✓", host: false },
];

const ANSWERS = [
  { k: "A", label: "Accra" },
  { k: "B", label: "Lagos" },
  { k: "C", label: "Nairobi" },
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
  { name: "Fatou", text: "Allez Deena ! 🔥" },
  { name: "Momo", text: "Je pense que c'est Accra 🤔" },
  { name: "Emma", text: "Bonne chance à tous ! 🎉" },
  { name: "Koffi", text: "Zembo Quiz le meilleur ! 💪" },
];

const FEATURES = [
  { emoji: "🎥", title: "VIDÉO EN DIRECT", desc: "Caméra activée par le joueur. Avatar par défaut." },
  { emoji: "🔒", title: "RÉPONSES SECRÈTES", desc: "Personne ne voit vos choix jusqu'à la révélation." },
  { emoji: "☰", title: "SÉRIES DE 5 QUESTIONS", desc: "À la fin de chaque série, les 2 moins bons sont éliminés." },
  { emoji: "👥", title: "SPECTATEURS ACTIFS", desc: "Ils voient tout, commentent, envoient des cadeaux." },
  { emoji: "🏆", title: "RÉCOMPENSE", desc: "Le gagnant remporte des Z Points et une victoire." },
];

function Podium({ name, role, host }: { name: string; role: string; host: boolean }) {
  return (
    <div className="flex w-[92px] flex-col items-center">
      {host && <span className="text-[13px] leading-none">👑</span>}
      <PhotoAvatar name={name} size={62} status="none" />
      <div className="-mt-2 w-full rounded-2xl border border-gold/35 bg-[oklch(0.11_0.01_60)] px-1.5 py-1.5 text-center">
        <p className="text-[10.5px] font-extrabold tracking-wide">{name.toUpperCase()}</p>
        {host ? (
          <p className="text-[9px] font-bold text-gold">HÔTE</p>
        ) : (
          <p className="mt-0.5 rounded-full bg-emerald/20 text-[8.5px] font-bold text-emerald">{role}</p>
        )}
      </div>
      <div className="mt-0.5 flex h-7 w-[52px] items-center justify-center rounded-b-lg border-x border-b border-gold/30 bg-gradient-to-b from-[oklch(0.16_0.02_70)] to-[oklch(0.1_0.01_60)] text-[15px] font-extrabold text-gold">
        Z
      </div>
    </div>
  );
}

function Quiz() {
  const navigate = useNavigate();

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-[max(env(safe-area-inset-top),12px)]">
        <Pressable onClick={() => navigate({ to: "/play" })} aria-label="Retour">
          <ChevronLeft size={22} className="text-gold" />
        </Pressable>
        <span className="text-[19px]">🧠</span>
        <p className="text-[15px] font-extrabold">
          ZEMBO <span className="text-gold-gradient">QUIZ</span>
        </p>
        <span className="ml-auto flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[10px] text-muted-foreground">
          <Eye size={12} /> 128 SPECTATEURS
        </span>
        <Pressable aria-label="Plus">
          <MoreVertical size={18} className="text-foreground/70" />
        </Pressable>
      </div>

      <div className="mt-3 flex items-center gap-2 px-4">
        <div className="rounded-full border border-gold/70 px-3 py-1.5 text-center">
          <p className="text-[12px] font-extrabold text-gold">ROUND 2</p>
          <p className="text-[9.5px] text-muted-foreground">8 JOUEURS EN JEU</p>
        </div>
        <div className="rounded-2xl border border-border bg-[oklch(0.115_0.008_60)] px-2.5 py-1.5">
          <p className="text-[10px] font-bold tracking-wide">SÉRIE 1 / 5 QUESTIONS</p>
          <p className="text-[10px] text-muted-foreground">Question 2 / 5</p>
        </div>
        <Pressable className="ml-auto flex shrink-0 items-center gap-1 rounded-full border border-gold/60 px-2.5 py-1.5 text-[10px] font-bold text-gold">
          RÈGLES <Info size={12} />
        </Pressable>
      </div>

      {/* Podiums haut */}
      <div className="snap-row mt-4 gap-2 px-4">
        {PLAYERS.slice(0, 4).map((p) => (
          <Podium key={p.name} {...p} />
        ))}
      </div>

      {/* Question */}
      <div className="mx-4 mt-4 rounded-3xl border border-gold/45 bg-[oklch(0.1_0.008_60)] p-3.5">
        <p className="text-center text-[10.5px] font-bold tracking-wide text-violet">
          🌍 CULTURE GÉNÉRALE
        </p>
        <h1 className="mt-2 text-center text-[19px] leading-snug font-extrabold">
          Quelle est la capitale du Ghana ?
        </h1>
        <div className="mt-3 space-y-2">
          {ANSWERS.map((a) => (
            <Pressable
              key={a.k}
              className="flex w-full items-center gap-2.5 rounded-2xl border border-border bg-surface-2/60 px-3 py-2.5 text-left"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-gradient text-[11px] font-bold text-[oklch(0.16_0.02_60)]">
                {a.k}
              </span>
              <span className="text-[14px] font-medium">{a.label}</span>
            </Pressable>
          ))}
        </div>
        <p className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-gold">
          <Info size={12} /> 7 / 8 joueurs ont répondu
        </p>
      </div>

      {/* Chrono + série */}
      <div className="mt-3 flex items-center gap-3 px-4">
        <div className="flex h-[74px] w-[74px] shrink-0 flex-col items-center justify-center rounded-full border-[3px] border-gold/80">
          <p className="text-[24px] leading-none font-extrabold">10</p>
          <p className="text-[8px] tracking-wide text-muted-foreground">SECONDES</p>
        </div>
        <div className="flex-1 rounded-2xl border border-border bg-[oklch(0.115_0.008_60)] p-3">
          <p className="text-[11px] font-bold tracking-wide text-gold">SÉRIE 1</p>
          <p className="text-[11px] text-muted-foreground">5 QUESTIONS</p>
          <p className="mt-2 text-[11px] font-bold tracking-wide text-gold">ÉLIMINATIONS</p>
          <p className="text-[11px] text-muted-foreground">
            À la fin de cette série <span className="text-live">2 joueurs</span> seront éliminés
          </p>
        </div>
      </div>

      {/* Podiums bas */}
      <div className="snap-row mt-4 gap-2 px-4">
        {PLAYERS.slice(4).map((p) => (
          <Podium key={p.name} {...p} />
        ))}
      </div>

      {/* Réponses verrouillées */}
      <div className="mx-4 mt-4 rounded-2xl border border-border bg-[oklch(0.115_0.008_60)] p-4 text-center">
        <p className="flex items-center justify-center gap-2 text-[14px] font-extrabold tracking-wide">
          <Lock size={15} className="text-gold" /> RÉPONSES VERROUILLÉES
        </p>
        <p className="mt-1 text-[11.5px] text-muted-foreground">
          La réponse sera révélée à la fin du chrono.
        </p>
      </div>

      {/* Réactions */}
      <div className="snap-row mt-3 gap-2 px-4">
        {[
          { e: "❤️", v: "48" },
          { e: "🔥", v: "36" },
          { e: "👏", v: "22" },
          { e: "🎁", v: "CADEAUX" },
        ].map((r) => (
          <Pressable
            key={r.e}
            className="flex items-center gap-1.5 rounded-full border border-border bg-[oklch(0.13_0.01_60)] px-3.5 py-2 text-[12px] font-semibold"
          >
            <span>{r.e}</span> {r.v}
          </Pressable>
        ))}
      </div>

      {/* Classement */}
      <div className="mx-4 mt-4 rounded-2xl border border-gold/25 bg-[oklch(0.115_0.008_60)] p-3">
        <p className="text-[12px] font-extrabold tracking-wide text-gold">CLASSEMENT SÉRIE 1</p>
        <div className="mt-2 space-y-1.5">
          {RANKING.map((r) => (
            <div
              key={r.n}
              className={`flex items-center gap-2 text-[12px] ${r.out ? "text-live" : "text-foreground/85"}`}
            >
              <span className="w-3 text-[11px]">{r.n}</span>
              <img
                src={photoUrl(r.name, 64)}
                alt=""
                loading="lazy"
                className="h-6 w-6 rounded-full object-cover"
              />
              <span className="flex-1 truncate font-medium">{r.name}</span>
              <span className="w-12 text-right">{r.score}</span>
              <span className="w-12 text-right text-muted-foreground">{r.time}</span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[10.5px] text-muted-foreground">
          2 joueurs seront éliminés à la fin de cette série.
        </p>
      </div>

      {/* Chat spectateurs */}
      <div className="mx-4 mt-3 rounded-2xl border border-border bg-[oklch(0.115_0.008_60)] p-3">
        <p className="text-[11.5px] font-extrabold tracking-wide text-violet">CHAT SPECTATEURS</p>
        <div className="mt-2 space-y-2">
          {CHAT.map((c) => (
            <div key={c.name} className="flex items-center gap-2">
              <img
                src={photoUrl(c.name, 64)}
                alt=""
                loading="lazy"
                className="h-6 w-6 rounded-full object-cover"
              />
              <p className="text-[12px] text-foreground/85">
                <span className="font-semibold">{c.name}:</span> {c.text}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-2.5 flex items-center gap-2">
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

      {/* Fonctionnalités clés */}
      <div className="mx-4 mt-3 rounded-2xl border border-gold/25 bg-[oklch(0.1_0.008_60)] p-3">
        <p className="text-center text-[11px] font-extrabold tracking-wide text-violet">
          FONCTIONNALITÉS CLÉS
        </p>
        <div className="mt-2.5 space-y-2.5">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex gap-2.5">
              <span className="text-[16px]">{f.emoji}</span>
              <div className="min-w-0">
                <p className="text-[11px] font-bold tracking-wide text-gold">{f.title}</p>
                <p className="text-[11px] leading-snug text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

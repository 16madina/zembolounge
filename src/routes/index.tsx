import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronRight, Flame, Play, Sparkles, Users, Volume2 } from "lucide-react";
import { ScreenHeader } from "@/components/zembo/Header";
import { Avatar, AvatarStack, CountPill, LiveBadge, Pressable, SectionTitle } from "@/components/zembo/ui";
import { IMG, forYou, lives, stories } from "@/lib/zembo-data";
import { useZemboAuth } from "@/lib/use-zembo-auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Accueil — Zembo" },
      {
        name: "description",
        content: "Talk shows en direct, tables de discussion et jeux sociaux : ta soirée commence ici.",
      },
      { property: "og:title", content: "Accueil — Zembo" },
      {
        property: "og:description",
        content: "Découvre les lives du moment, rejoins une table ou lance ton propre talk show.",
      },
    ],
  }),
  component: Home,
});

const QUICK = [
  { id: "talk", title: "TALK SHOW", desc: "Débats, Opinions, Confessions", count: 124, image: IMG.mic, accent: "oklch(0.62 0.24 300)" },
  { id: "table", title: "ZEMBO TABLES", desc: "Petites discussions en groupe", count: 86, image: IMG.table, accent: "oklch(0.82 0.13 85)" },
  { id: "play", title: "PLAY & FUN", desc: "Jeux, Quizz, Défis", count: 212, image: IMG.play, accent: "oklch(0.65 0.19 250)" },
  { id: "world", title: "WORLD ROOM", desc: "Rencontre des gens du monde entier", count: 309, image: IMG.world, accent: "oklch(0.68 0.16 158)" },
];

function Home() {
  const navigate = useNavigate();
  const { user } = useZemboAuth();
  const meta = (user?.user_metadata ?? {}) as { prenom?: string; full_name?: string };
  const prenom = meta.prenom || meta.full_name?.split(" ")[0] || "Deena";
  const go = (kind: string, id: string) =>
    kind === "table" || kind === "play" || kind === "world"
      ? navigate({ to: "/table/$id", params: { id } })
      : navigate({ to: "/talk-show/$id", params: { id } });

  return (
    <div className="pb-4">
      <ScreenHeader />

      {/* Salutation */}
      <section className="flex items-center gap-3 px-4 pt-4">
        <Avatar name={prenom} size={54} ring online />
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[21px] leading-tight font-extrabold">
            Bonsoir {prenom} <span className="text-gold">♛</span>
          </h1>
          <p className="truncate text-[13px] text-muted-foreground">Qu'est-ce qu'on vit aujourd'hui ?</p>
        </div>
        <div className="card-surface rounded-2xl px-3 py-2 text-right">
          <p className="text-[10px] text-gold">Énergie du jour</p>
          <p className="text-[15px] font-bold">100%</p>
        </div>
      </section>

      {/* Stories */}
      <div className="snap-row mt-4 gap-3.5 px-4">
        <Pressable
          onClick={() => navigate({ to: "/live" })}
          className="flex w-[70px] flex-col items-center gap-1.5"
        >
          <span className="flex h-[68px] w-[68px] items-center justify-center rounded-full border border-dashed border-gold/60 text-2xl text-gold">
            +
          </span>
          <span className="text-center text-[11px] leading-tight text-muted-foreground">Créer un live</span>
        </Pressable>
        {stories.map((s) => (
          <Pressable
            key={s.id}
            onClick={() => go("talk", s.id)}
            className="flex w-[70px] flex-col items-center gap-1.5"
          >
            <span className="relative">
              <span className="block rounded-full bg-gold-gradient p-[2px]">
                <img
                  src={s.image}
                  alt={s.label}
                  loading="lazy"
                  className="h-[64px] w-[64px] rounded-full object-cover"
                />
              </span>
              <span className="absolute -top-1 left-1/2 -translate-x-1/2">
                <LiveBadge />
              </span>
            </span>
            <span className="w-full truncate text-center text-[11px] font-medium">{s.label}</span>
            <span className="text-[10px] text-muted-foreground">👁 {s.viewers}</span>
          </Pressable>
        ))}
      </div>

      {/* Hero live */}
      <div className="mt-5 px-4">
        <Pressable
          onClick={() => go("talk", "1")}
          className="relative block w-full overflow-hidden rounded-3xl border border-gold/25 text-left"
        >
          <img src={IMG.mic} alt="Débat en direct" width={768} height={512} className="h-[210px] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-between p-3.5">
            <div className="flex items-start justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-live px-2.5 py-1 text-[10px] font-bold text-white">
                <Flame size={11} /> EN DIRECT MAINTENANT
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm">
                <Volume2 size={15} className="text-white/80" />
              </span>
            </div>
            <div>
              <p className="text-[13px] text-white/70">Débat :</p>
              <h2 className="max-w-[62%] text-[24px] leading-[1.1] font-extrabold text-white">
                L'argent et l'amour
              </h2>
              <p className="mt-1.5 text-[13px] text-white/80">Rejoins la discussion !</p>
              <div className="mt-2.5 flex items-end justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AvatarStack names={["Sarah", "Leila", "Aïcha"]} size={24} />
                  <span className="text-[11px] leading-tight text-white/75">
                    +256 personnes
                    <br />
                    sont en ligne
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-gradient px-3.5 py-2 text-[13px] font-bold text-[oklch(0.16_0.02_60)]">
                  Entrer maintenant <Play size={13} fill="currentColor" />
                </span>
              </div>
            </div>
          </div>
        </Pressable>
      </div>

      {/* 4 univers */}
      <div className="mt-5 grid grid-cols-2 gap-3 px-4">
        {QUICK.map((q) => (
          <Pressable
            key={q.id}
            onClick={() =>
              q.id === "talk"
                ? navigate({ to: "/talk-show" })
                : q.id === "world"
                  ? navigate({ to: "/world" })
                  : go(q.id, q.id)
            }
            className="card-surface relative overflow-hidden rounded-2xl p-2.5 text-center"
          >
            <div className="absolute inset-x-0 -top-6 h-20 opacity-25 blur-2xl" style={{ background: q.accent }} />
            <img src={q.image} alt="" loading="lazy" className="relative h-[78px] w-full rounded-xl object-cover" />
            <h3 className="relative mt-2 text-[13px] font-extrabold tracking-wide text-gold">{q.title}</h3>
            <p className="relative mt-0.5 text-[11px] leading-snug text-muted-foreground">{q.desc}</p>
            <span className="relative mt-2 inline-flex items-center gap-1 rounded-full bg-white/8 px-2.5 py-1 text-[11px] font-semibold">
              <Users size={11} /> {q.count}
            </span>
          </Pressable>
        ))}
      </div>

      {/* En direct maintenant */}
      <div className="mt-6">
        <SectionTitle action="Voir tout" onAction={() => navigate({ to: "/live" })}>
          En direct maintenant
        </SectionTitle>
        <div className="snap-row mt-3 gap-3 px-4">
          {lives.slice(0, 4).map((l) => (
            <Pressable
              key={l.id}
              onClick={() => go("talk", l.id)}
              className="card-surface w-[210px] overflow-hidden rounded-2xl text-left"
            >
              <div className="relative">
                <img src={l.image} alt={l.title} loading="lazy" className="h-[118px] w-full object-cover" />
                <span className="absolute top-2 left-2">
                  <LiveBadge />
                </span>
                <span className="absolute top-2 right-2">
                  <CountPill value={l.viewers} />
                </span>
              </div>
              <div className="p-2.5">
                <p className="text-[10px] font-bold tracking-wider text-gold uppercase">{l.category}</p>
                <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug font-semibold">{l.title}</p>
                <div className="mt-2 flex items-center justify-between">
                  <AvatarStack names={["Sarah", "Yann", "Leila", "Marc"]} extra={28} size={20} />
                </div>
                <p className="mt-1.5 text-[11px] text-gold/90">{l.host} l'hôte ✔</p>
              </div>
            </Pressable>
          ))}
        </div>
      </div>

      {/* Pour toi */}
      <div className="mt-6">
        <SectionTitle
          icon={<Sparkles size={14} className="text-gold" />}
          action="Voir tout"
          onAction={() => navigate({ to: "/live" })}
        >
          Pour toi aujourd'hui
        </SectionTitle>
        <div className="snap-row mt-3 gap-3 px-4">
          {forYou.map((f) => (
            <Pressable
              key={f.id}
              onClick={() => go("talk", f.id)}
              className="relative h-[140px] w-[150px] overflow-hidden rounded-2xl border border-border text-left"
            >
              <img src={f.image} alt={f.title} loading="lazy" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/35 to-black/40" />
              <div className="absolute inset-0 flex flex-col justify-between p-2.5">
                <span className="self-start rounded-md bg-white/15 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm">
                  {f.tag}
                </span>
                <div>
                  <p className="line-clamp-2 text-[13px] leading-tight font-bold text-white">{f.title}</p>
                  <p className="mt-1 text-[11px] text-white/70">👁 {f.views}</p>
                </div>
              </div>
            </Pressable>
          ))}
        </div>
      </div>

      <Pressable
        onClick={() => navigate({ to: "/live" })}
        className="mt-6 mx-4 flex w-[calc(100%-2rem)] items-center justify-between rounded-2xl border border-gold/30 bg-gold/8 px-4 py-3"
      >
        <span className="text-sm font-semibold">Découvre plus de lives</span>
        <ChevronRight size={17} className="text-gold" />
      </Pressable>
    </div>
  );
}

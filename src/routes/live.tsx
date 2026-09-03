import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Clock,
  Flame,
  Gamepad2,
  Globe,
  Grid2x2,
  Lock,
  Mic,
  Plus,
  Radio,
  Star,
  Users,
} from "lucide-react";
import { ScreenHeader } from "@/components/zembo/Header";
import {
  AvatarStack,
  Chip,
  CountPill,
  LiveBadge,
  Pressable,
  SectionTitle,
} from "@/components/zembo/ui";
import { IMG, categories, lives, recommended, trends } from "@/lib/zembo-data";

export const Route = createFileRoute("/live")({
  head: () => ({
    meta: [
      { title: "Lives en direct — Zembo" },
      {
        name: "description",
        content: "Des conversations en direct : débats, open mic, confessions, jeux et culture.",
      },
      { property: "og:title", content: "Lives en direct — Zembo" },
      {
        property: "og:description",
        content: "Rejoins les talk shows et tables qui t'inspirent, en direct maintenant.",
      },
    ],
  }),
  component: LivePage,
});

const ICONS = [Grid2x2, Mic, Star, Lock, Gamepad2, Globe, Flame];

function LivePage() {
  const navigate = useNavigate();
  const [active, setActive] = useState("tous");

  return (
    <div className="pb-4">
      <ScreenHeader title="Live" wordmark={false} />

      <section className="flex items-start justify-between gap-3 px-4 pt-4">
        <h1 className="text-[19px] leading-tight font-extrabold">
          Des conversations en direct.
          <br />
          <span className="text-foreground/70">Rejoins ce qui t'inspire.</span>
        </h1>
        <Pressable className="flex shrink-0 items-center gap-1 rounded-full border border-gold/50 px-3 py-2 text-[12px] font-semibold text-gold">
          <Plus size={13} /> Créer un live
        </Pressable>
      </section>

      <div className="snap-row mt-4 gap-2 px-4">
        {categories.map((c, i) => {
          const Icon = ICONS[i % ICONS.length]!;
          return (
            <Pressable
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`flex w-[68px] flex-col items-center gap-1 rounded-2xl border px-2 py-2.5 ${
                active === c.id ? "border-gold/60 bg-gold/10" : "border-border bg-surface/50"
              }`}
            >
              <Icon size={19} className={active === c.id ? "text-gold" : "text-foreground/60"} />
              <span
                className={`text-[10px] font-medium ${active === c.id ? "text-gold" : "text-foreground/60"}`}
              >
                {c.label}
              </span>
            </Pressable>
          );
        })}
      </div>

      <div className="mt-5">
        <SectionTitle icon={<Radio size={14} className="text-gold" />} action="Voir tout">
          En direct maintenant
        </SectionTitle>
        <div className="mt-3 grid grid-cols-2 gap-3 px-4">
          {lives.map((l) => (
            <Pressable
              key={l.id}
              onClick={() => navigate({ to: "/talk-show/$id", params: { id: l.id } })}
              className="card-surface overflow-hidden rounded-2xl text-left"
            >
              <div className="relative">
                <img src={l.image} alt={l.title} loading="lazy" className="h-[104px] w-full object-cover" />
                <span className="absolute top-2 left-2">
                  <LiveBadge />
                </span>
                <span className="absolute top-2 right-2">
                  <CountPill value={l.viewers} />
                </span>
              </div>
              <div className="p-2.5">
                <p className="text-[9px] font-bold tracking-wider text-gold uppercase">{l.category}</p>
                <p className="mt-0.5 line-clamp-2 text-[12.5px] leading-snug font-semibold">{l.title}</p>
                <div className="mt-2">
                  <AvatarStack names={["Sarah", "Yann", "Leila"]} extra={14} size={18} />
                </div>
                <p className="mt-1.5 text-[11px] text-gold/90">{l.host} l'hôte ✔</p>
              </div>
            </Pressable>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <SectionTitle icon={<Star size={14} className="text-gold" />}>Recommandé pour toi</SectionTitle>
        <div className="mt-3 space-y-2.5 px-4">
          {recommended.map((r) => (
            <div key={r.id} className="card-surface flex items-center gap-3 rounded-2xl p-2.5">
              <div className="relative shrink-0">
                <img src={IMG.table} alt="" loading="lazy" className="h-16 w-16 rounded-xl object-cover" />
                <span className="absolute top-1 left-1">
                  <LiveBadge />
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-[13px] leading-snug font-semibold">{r.title}</p>
                <p className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users size={11} /> {r.kind}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} /> {r.min} min
                  </span>
                </p>
              </div>
              <Pressable
                onClick={() => navigate({ to: "/talk-show/$id", params: { id: r.id } })}
                className="shrink-0 rounded-full border border-gold/60 px-3 py-1.5 text-[12px] font-semibold text-gold"
              >
                Rejoindre
              </Pressable>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <SectionTitle icon={<Flame size={14} className="text-gold" />}>Tendances</SectionTitle>
        <div className="card-surface mx-4 mt-3 divide-y divide-border/60 rounded-2xl">
          {trends.map((t, i) => (
            <Pressable
              key={t.id}
              onClick={() => navigate({ to: "/talk-show/$id", params: { id: t.id } })}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left"
            >
              <span className="w-4 text-[13px] font-bold text-gold">{i + 1}</span>
              <img src={IMG.mic} alt="" loading="lazy" className="h-10 w-10 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold">{t.title}</p>
                <p className="text-[11px] text-muted-foreground">{t.live} en direct</p>
              </div>
            </Pressable>
          ))}
        </div>
      </div>

      <div className="mx-4 mt-5 overflow-hidden rounded-2xl border border-gold/30 bg-gold/8 p-4">
        <h3 className="text-[15px] font-extrabold text-gold">Deviens hôte</h3>
        <p className="mt-1 text-[12px] text-muted-foreground">
          Partage ta voix. Crée ta communauté.
        </p>
        <Pressable className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gold-gradient px-4 py-2 text-[13px] font-bold text-[oklch(0.16_0.02_60)]">
          <Mic size={14} /> Créer un live
        </Pressable>
      </div>
    </div>
  );
}

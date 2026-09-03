import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  BadgeCheck,
  BarChart3,
  CalendarDays,
  ChevronRight,
  Clock,
  Gem,
  Globe,
  Heart,
  Mail,
  MapPin,
  Menu,
  MoreVertical,
  QrCode,
  Share2,
  Shield,
  Sparkles,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import { Avatar, Pressable, SectionTitle } from "@/components/zembo/ui";
import { ZemboWordmark } from "@/components/zembo/ZemboMark";
import { creations } from "@/lib/zembo-data";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profil de Deena — Zembo" },
      {
        name: "description",
        content: "Hôte Zembo : lives animés, tables, badges, communautés et statistiques.",
      },
      { property: "og:title", content: "Profil de Deena — Zembo" },
      {
        property: "og:description",
        content: "Découvre les créations, badges et communautés de Deena sur Zembo.",
      },
    ],
  }),
  component: Profile,
});

const QUICK = [
  { icon: Clock, label: "Historique", sub: "Lives & tables" },
  { icon: BarChart3, label: "Statistiques", sub: "Performances" },
  { icon: Shield, label: "Badges", sub: "16 badges" },
  { icon: Wallet, label: "Portefeuille", sub: "2 450 Z" },
];

const TABS = [
  { id: "creations", label: "Créations", icon: Sparkles },
  { id: "tables", label: "Tables animées", icon: Users },
  { id: "moments", label: "Moments forts", icon: Star },
  { id: "communautes", label: "Communautés", icon: Globe },
];

function Profile() {
  const [tab, setTab] = useState("creations");

  return (
    <div className="pb-4">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border/50 bg-background/85 px-4 pt-[max(env(safe-area-inset-top),12px)] pb-3 backdrop-blur-xl">
        <ZemboWordmark className="text-[16px]" />
        <div className="flex items-center gap-3 text-gold">
          <QrCode size={19} />
          <Share2 size={19} />
          <Menu size={19} />
        </div>
      </header>

      <section className="flex gap-3 px-4 pt-4">
        <span className="rounded-full bg-gold-gradient p-[2.5px]">
          <Avatar name="Deena" size={78} online />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h1 className="flex items-center gap-1.5 text-[21px] font-extrabold">
                Deena <BadgeCheck size={17} className="text-gold" />
              </h1>
              <p className="flex items-center gap-2 text-[12px] text-muted-foreground">
                @deena_zembo
                <span className="rounded-md border border-gold/50 px-1.5 py-0.5 text-[9px] font-bold text-gold">
                  HÔTE
                </span>
              </p>
            </div>
            <Pressable className="shrink-0 rounded-full border border-gold/60 px-3 py-1.5 text-[11.5px] font-semibold text-gold">
              Éditer
            </Pressable>
          </div>
          <p className="mt-2 text-[12px] leading-snug text-foreground/70">
            J'aime les vraies conversations, les débats qui éveillent et les gens authentiques ✨
          </p>
        </div>
      </section>

      <div className="snap-row mt-3 gap-2 px-4">
        {["🔥 Talk Show Host", "🏆 Top Hôte", "👑 Level 7"].map((b) => (
          <span
            key={b}
            className="card-surface rounded-full px-3 py-1.5 text-[11.5px] font-semibold whitespace-nowrap"
          >
            {b}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between px-4">
        {[
          { v: "2.4K", l: "Abonnés" },
          { v: "512", l: "Abonnements" },
          { v: "18.7K", l: "Points Z" },
        ].map((s) => (
          <div key={s.l}>
            <p className="text-[19px] font-extrabold">{s.v}</p>
            <p className="text-[11px] text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="card-surface mx-4 mt-4 flex items-center gap-3 rounded-2xl p-3">
        <Gem size={28} className="text-gold" />
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-bold">Diamant</p>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[69%] rounded-full bg-gold-gradient" />
          </div>
          <p className="mt-1 flex justify-between text-[10.5px] text-muted-foreground">
            <span>3 450 / 5 000 pts</span>
            <span>Prochain niveau : Maître</span>
          </p>
        </div>
      </div>

      <div className="card-surface mx-4 mt-3 grid grid-cols-4 divide-x divide-border/60 rounded-2xl py-3">
        {QUICK.map((q) => (
          <Pressable key={q.label} className="flex flex-col items-center gap-1 px-1">
            <q.icon size={18} className="text-gold" />
            <span className="text-[11px] font-semibold text-gold">{q.label}</span>
            <span className="text-center text-[9.5px] leading-tight text-muted-foreground">{q.sub}</span>
          </Pressable>
        ))}
      </div>

      <div className="snap-row mt-4 gap-2 px-4">
        {TABS.map((t) => (
          <Pressable
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12.5px] font-semibold ${
              tab === t.id
                ? "bg-gold-gradient text-[oklch(0.16_0.02_60)]"
                : "border border-border bg-surface/50 text-foreground/70"
            }`}
          >
            <t.icon size={14} />
            {t.label}
          </Pressable>
        ))}
      </div>

      <div className="mt-5">
        <SectionTitle action="Voir tout">Mes créations récentes</SectionTitle>
        <div className="snap-row mt-3 gap-3 px-4">
          {creations.map((c) => (
            <div key={c.id} className="card-surface w-[190px] overflow-hidden rounded-2xl">
              <div className="relative">
                <img src={c.image} alt={c.title} loading="lazy" className="h-[96px] w-full object-cover" />
                <span
                  className={`absolute top-2 left-2 rounded-md px-1.5 py-0.5 text-[9px] font-bold text-white ${
                    c.kind === "LIVE" ? "bg-live" : "bg-violet"
                  }`}
                >
                  {c.kind}
                </span>
              </div>
              <div className="p-2.5">
                <p className="line-clamp-2 text-[12.5px] leading-snug font-semibold">{c.title}</p>
                <p className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Users size={11} /> {c.meta}
                </p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[10.5px] text-muted-foreground">{c.when}</span>
                  <MoreVertical size={14} className="text-muted-foreground" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card-surface mx-4 mt-5 rounded-2xl p-3.5">
        <h3 className="text-[15px] font-bold">À propos de moi</h3>
        <ul className="mt-2.5 space-y-2 text-[12px] text-foreground/75">
          <li className="flex items-center gap-2">
            <Sparkles size={14} className="text-gold" /> Passionnée de discussions et de connexions
          </li>
          <li className="flex items-center gap-2">
            <MapPin size={14} className="text-gold" /> Montréal, Canada
          </li>
          <li className="flex items-center gap-2">
            <Globe size={14} className="text-gold" /> Français | English
          </li>
          <li className="flex items-center gap-2">
            <CalendarDays size={14} className="text-gold" /> Sur Zembo depuis avril 2024
          </li>
          <li className="flex items-center gap-2">
            <Shield size={14} className="text-gold" /> Hôte vérifiée
          </li>
          <li className="flex items-center gap-2">
            <Mail size={14} className="text-gold" /> Collabs : deena@zembo.app
          </li>
        </ul>
      </div>

      <div className="card-surface mx-4 mt-3 rounded-2xl p-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[15px] font-bold">Communautés</h3>
            <p className="text-[11.5px] text-muted-foreground">Gère tes communautés</p>
          </div>
          <ChevronRight size={17} className="text-gold" />
        </div>
        <div className="mt-3 flex items-center gap-2">
          {["Deena", "Open Mic", "World", "Love"].map((n) => (
            <Avatar key={n} name={n} size={40} ring />
          ))}
        </div>
      </div>

      <div className="card-surface mx-4 mt-3 grid grid-cols-2 gap-y-3 rounded-2xl p-3.5 text-center">
        {[
          { v: "47", l: "Lives animés" },
          { v: "32", l: "Tables animées" },
          { v: "128h", l: "Heures en direct" },
          { v: "3.2K", l: "Appréciations", heart: true },
        ].map((s) => (
          <div key={s.l}>
            <p className="flex items-center justify-center gap-1 text-[17px] font-extrabold">
              {s.heart && <Heart size={14} className="fill-live text-live" />}
              {s.v}
            </p>
            <p className="text-[11px] text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

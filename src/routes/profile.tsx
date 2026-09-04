import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { LogIn, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useZemboAuth } from "@/lib/use-zembo-auth";
import { motion } from "framer-motion";
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
  Mic,
  MoreVertical,
  PlaySquare,
  QrCode,
  Share2,
  ShieldCheck,
  Star,
  User,
  Users,
  Wallet,
} from "lucide-react";
import { Pressable } from "@/components/zembo/ui";
import { ZemboWordmark } from "@/components/zembo/ZemboMark";
import { SegmentedTabs, type SegmentedTab } from "@/components/zembo/SegmentedTabs";
import { PhotoAvatar } from "@/components/zembo/PhotoAvatar";
import { Skeleton, useMockLoad } from "@/components/zembo/Skeleton";
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
  { icon: ShieldCheck, label: "Badges", sub: "16 badges" },
  { icon: Wallet, label: "Portefeuille", sub: "2,450 Z" },
];

const TABS: SegmentedTab[] = [
  { id: "creations", label: "Créations", icon: PlaySquare },
  { id: "tables", label: "Tables", icon: Users },
  { id: "moments", label: "Moments", icon: Star },
  { id: "communautes", label: "Communautés", icon: Globe },
];

const ABOUT = [
  { icon: User, text: "Passionnée de discussions et de connexions" },
  { icon: CalendarDays, text: "Sur Zembo depuis Avril 2024" },
  { icon: MapPin, text: "Montréal, Canada" },
  { icon: ShieldCheck, text: "Hôte vérifiée" },
  { icon: Globe, text: "Français | English" },
  { icon: Mail, text: "Collabs : deena@zembo.app" },
];

const BOTTOM_STATS = [
  { l: "Lives animés", v: "47" },
  { l: "Tables animées", v: "32" },
  { l: "Heures en direct", v: "128h" },
  { l: "Appréciations reçues", v: "3.2K", heart: true },
];

function Profile() {
  const { user, signOut } = useZemboAuth();
  const [tab, setTab] = useState("creations");
  const loading = useMockLoad();

  return (
    <div style={{ paddingBottom: 110 }}>
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border/50 bg-background/85 px-4 pt-[max(env(safe-area-inset-top),12px)] pb-3 backdrop-blur-xl">
        <ZemboWordmark className="text-[16px]" />
        <div className="flex items-center gap-4 text-gold">
          <Pressable aria-label="Code QR">
            <QrCode size={19} />
          </Pressable>
          <Pressable aria-label="Partager">
            <Share2 size={19} />
          </Pressable>
          <Pressable aria-label="Menu">
            <Menu size={19} />
          </Pressable>
        </div>
      </header>

      {/* Identité */}
      <section className="flex gap-4 px-4 pt-5">
        <span className="shrink-0 rounded-full border-[3px] border-gold p-[2px]">
          <PhotoAvatar name="Deena" size={104} ring={false} status="online" />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="flex items-center gap-1.5 text-[28px] leading-tight font-bold text-white">
            Deena <BadgeCheck size={20} className="shrink-0 text-gold" />
          </h1>
          <p className="mt-0.5 flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
            @deena_zembo
            <span className="rounded-md border border-gold/50 px-1.5 py-[1px] text-[10px] font-bold text-gold">
              HÔTE
            </span>
          </p>
        </div>
      </section>

      <p className="mt-3 px-4 text-[14px] leading-snug text-white">
        J'aime les vraies conversations, les débats qui éveillent et les gens authentiques ✨ Créons
        des connexions qui comptent.
      </p>

      <div className="snap-row mt-3 gap-2 px-4">
        {["🔥 Talk Show Host", "🏆 Top Hôte", "👑 Level 7"].map((b) => (
          <span
            key={b}
            className="shrink-0 rounded-full bg-[oklch(0.16_0.004_60)] px-3 py-1.5 text-[12px] font-medium whitespace-nowrap text-white"
          >
            {b}
          </span>
        ))}
      </div>

      <div className="px-4">
        <Pressable className="mt-4 w-full rounded-full border border-gold/60 py-2.5 text-[13.5px] font-semibold text-gold">
          Éditer le profil
        </Pressable>
        {user ? (
          <Pressable
            onClick={async () => {
              await signOut();
              toast("Déconnecté", { description: "À bientôt sur Zembo." });
            }}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full border border-border py-2.5 text-[13.5px] font-semibold text-muted-foreground"
          >
            <LogOut size={15} /> Se déconnecter
          </Pressable>
        ) : (
          <Link
            to="/login"
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full border border-border py-2.5 text-[13.5px] font-semibold text-muted-foreground"
          >
            <LogIn size={15} /> Se connecter
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-3 px-4 text-center">
        {[
          { v: "2.4K", l: "Abonnés" },
          { v: "512", l: "Abonnements" },
          { v: "18.7K", l: "Points Z" },
        ].map((s) => (
          <div key={s.l}>
            <p className="text-[22px] leading-none font-bold text-white">{s.v}</p>
            <p className="mt-1 text-[13px] text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </div>

      {/* Niveau */}
      <div className="mx-4 mt-5 flex items-center gap-3 rounded-2xl border border-gold/25 bg-[oklch(0.115_0.008_60)] p-3.5">
        <Gem size={36} className="shrink-0 text-gold" />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-bold text-white">Diamant</p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[oklch(0.26_0_0)]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "69%" }}
              transition={{ duration: 0.9, ease: [0.32, 0.72, 0, 1], delay: 0.15 }}
              className="bg-gold-gradient h-full rounded-full"
            />
          </div>
          <p className="mt-1.5 flex justify-between gap-2 text-[11.5px] text-muted-foreground">
            <span>3,450 / 5,000 pts</span>
            <span>Prochain niveau : Maître</span>
          </p>
        </div>
      </div>

      {/* Accès rapide */}
      <div className="mx-4 mt-3 grid grid-cols-4 divide-x divide-border/60 rounded-2xl border border-border/70 bg-[oklch(0.115_0.008_60)] py-3">
        {QUICK.map((q) => (
          <Pressable key={q.label} className="flex flex-col items-center gap-1 px-1">
            <q.icon size={24} className="text-gold" />
            <span className="text-[12px] font-bold text-gold">{q.label}</span>
            <span className="text-center text-[10.5px] leading-tight text-muted-foreground">
              {q.sub}
            </span>
          </Pressable>
        ))}
      </div>

      {/* Onglets */}
      <div className="mt-4 px-4">
        <SegmentedTabs tabs={TABS} value={tab} onChange={setTab} layoutId="profile-seg" />
      </div>

      <div className="mt-5 flex items-center justify-between px-4">
        <h2 className="text-[15px] font-bold text-white">Mes créations récentes</h2>
        <Pressable className="flex items-center gap-0.5 text-[12.5px] font-semibold text-gold">
          Voir tout <ChevronRight size={14} />
        </Pressable>
      </div>

      {loading ? (
        <div className="snap-row mt-3 gap-3 px-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-[220px] w-[170px] shrink-0 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="snap-row mt-3 gap-3 px-4">
          {creations.map((c) => (
            <div
              key={c.id}
              className="w-[170px] shrink-0 overflow-hidden rounded-2xl border border-border/70 bg-[oklch(0.115_0.008_60)]"
            >
              <div className="relative">
                <img
                  src={c.image}
                  alt={c.title}
                  loading="lazy"
                  className="h-[120px] w-full object-cover"
                />
                <span
                  className={`absolute top-2 left-2 rounded-md px-1.5 py-0.5 text-[9.5px] font-bold text-white ${
                    c.kind === "LIVE" ? "bg-live" : "bg-violet"
                  }`}
                >
                  {c.kind}
                </span>
              </div>
              <div className="p-2.5">
                <p className="line-clamp-2 min-h-[36px] text-[13px] leading-snug font-bold text-white">
                  {c.title}
                </p>
                <p className="mt-1.5 flex items-center gap-1 text-[11.5px] text-muted-foreground">
                  <Users size={12} /> {c.meta}
                </p>
                <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{c.when}</span>
                  <MoreVertical size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* À propos */}
      <div className="mx-4 mt-4 rounded-2xl border border-border/70 bg-[oklch(0.115_0.008_60)] p-3.5">
        <h3 className="text-[15px] font-bold text-white">À propos de moi</h3>
        <ul className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-2.5">
          {ABOUT.map((a) => (
            <li key={a.text} className="flex items-start gap-1.5 text-[13px] text-white">
              <a.icon size={14} className="mt-[3px] shrink-0 text-gold" />
              <span className="leading-snug">{a.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Communautés */}
      <Pressable className="mx-4 mt-3 block w-[calc(100%-2rem)] rounded-2xl border border-border/70 bg-[oklch(0.115_0.008_60)] p-3.5 text-left">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[15px] font-bold text-white">Communautés</h3>
            <p className="text-[12px] text-muted-foreground">Gère tes communautés</p>
          </div>
          <ChevronRight size={18} className="text-gold" />
        </div>
        <div className="mt-3 flex items-center gap-2.5">
          <PhotoAvatar name="Deena" size={44} />
          <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-gold/60 bg-[oklch(0.16_0.006_60)]">
            <Mic size={18} className="text-gold" />
          </span>
          <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-gold/60 bg-[oklch(0.16_0.006_60)]">
            <Globe size={18} className="text-gold" />
          </span>
          <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[oklch(0.72_0.16_350)]/60 bg-[oklch(0.16_0.006_60)]">
            <Heart size={18} className="text-[oklch(0.72_0.16_350)]" />
          </span>
        </div>
      </Pressable>

      {/* Stats bas */}
      <div className="mx-4 mt-3 grid grid-cols-4 divide-x divide-border/60 rounded-2xl border border-border/70 bg-[oklch(0.115_0.008_60)] py-3.5 text-center">
        {BOTTOM_STATS.map((s) => (
          <div key={s.l} className="px-1">
            <p className="text-[11px] leading-tight text-muted-foreground">{s.l}</p>
            <p className="mt-1 flex items-center justify-center gap-1 text-[22px] leading-none font-bold text-white">
              {s.heart && <Heart size={13} className="fill-live text-live" />}
              {s.v}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

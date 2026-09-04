import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Camera,
  ChevronRight,
  Globe,
  HelpCircle,
  Lock,
  MessageCircle,
  Plus,
  Ticket,
  Users,
  Ban,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { IMG } from "@/lib/zembo-data";
import {
  FORMAT_META,
  setLiveConfig,
  useLiveConfig,
  type FormatId,
  type LiveConfig,
} from "@/lib/talk-show-config";
import { BottomSheet } from "./Sheet";
import { Pressable } from "./ui";
import { ZemboIcon, ZemboWordmark } from "./ZemboMark";

function tap() {
  navigator.vibrate?.(12);
}

export function SetupHeader({
  onBack,
  right,
}: {
  onBack: () => void;
  right: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-2 border-b border-border/50 bg-background/85 px-4 pt-[max(env(safe-area-inset-top),12px)] pb-3 backdrop-blur-xl">
      <Pressable onClick={onBack} aria-label="Retour" className="-ml-1">
        <ArrowLeft size={24} className="text-gold" />
      </Pressable>
      <div className="flex items-center gap-2">
        <ZemboIcon size={22} />
        <ZemboWordmark className="text-[15px]" />
      </div>
      <div className="flex h-9 min-w-9 items-center justify-center">{right}</div>
    </header>
  );
}

function Section({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-5 px-4">
      <h2 className="flex items-center gap-2 text-[14px] font-bold text-foreground">
        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gold/60 text-[10px] font-extrabold text-gold">
          {n}
        </span>
        {title}
      </h2>
      <div className="mt-2.5">{children}</div>
    </section>
  );
}

function ChoiceCard({
  active,
  icon,
  title,
  desc,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <Pressable
      onClick={() => {
        tap();
        onClick();
      }}
      className={cn(
        "card-surface flex-1 rounded-2xl p-3 text-left",
        active ? "border-gold/80 bg-gold/8" : "",
      )}
    >
      <span className={cn("flex items-center gap-1.5", active ? "text-gold" : "text-foreground/80")}>
        {icon}
        <span className="text-[12.5px] font-bold">{title}</span>
      </span>
      <p className="mt-1 text-[10.5px] leading-snug text-muted-foreground">{desc}</p>
    </Pressable>
  );
}

function Pill({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <Pressable
      onClick={() => {
        tap();
        onClick();
      }}
      className={cn(
        "rounded-full border px-3 py-1.5 text-[11.5px] font-semibold whitespace-nowrap",
        active
          ? "border-transparent bg-gold-gradient text-[oklch(0.16_0.02_60)]"
          : "border-border bg-surface/70 text-foreground/75",
      )}
    >
      {children}
    </Pressable>
  );
}

export function TalkShowConfigScreen({ format }: { format: FormatId }) {
  const navigate = useNavigate();
  const cfg = useLiveConfig();
  const meta = FORMAT_META[format];
  const [rulesOpen, setRulesOpen] = useState(false);
  const [draftRules, setDraftRules] = useState(cfg.rules);

  const set = (patch: Partial<LiveConfig>) => setLiveConfig(patch);

  return (
    <div className="app-scroll no-scrollbar pb-[130px]">
      <SetupHeader
        onBack={() => navigate({ to: "/talk-show" })}
        right={
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface/60">
            <HelpCircle size={17} className="text-foreground/70" />
          </span>
        }
      />

      <section className="flex items-center gap-3 px-4 pt-5">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border"
          style={{
            borderColor: `color-mix(in oklab, ${meta.accent} 55%, transparent)`,
            background: `color-mix(in oklab, ${meta.accent} 14%, transparent)`,
          }}
        >
          <FormatIcon format={format} />
        </span>
        <div className="min-w-0">
          <h1 className="text-[24px] leading-none font-extrabold tracking-tight">{meta.name}</h1>
          <p className="mt-1.5 text-[12px] font-medium text-gold">{meta.subtitle}</p>
        </div>
      </section>

      <div className="mt-4 flex items-center gap-2 px-4">
        <span className="h-1 flex-1 rounded-full bg-gold-gradient" />
        <span className="h-1 flex-1 rounded-full bg-white/12" />
        <span className="text-[10px] font-bold tracking-wide text-muted-foreground">1/2</span>
      </div>

      <Section n={1} title="Titre de ton live *">
        <div className="card-surface rounded-2xl px-3 pt-2.5 pb-1.5">
          <input
            value={cfg.title}
            maxLength={100}
            onChange={(e) => set({ title: e.target.value })}
            placeholder={meta.placeholder}
            className="w-full bg-transparent text-[13.5px] text-foreground outline-none placeholder:text-muted-foreground/70"
          />
          <p className="mt-1 text-right text-[10.5px] text-muted-foreground">{cfg.title.length}/100</p>
        </div>
      </Section>

      <Section n={2} title="Description (facultatif)">
        <div className="card-surface rounded-2xl px-3 pt-2.5 pb-1.5">
          <textarea
            value={cfg.description}
            maxLength={500}
            rows={3}
            onChange={(e) => set({ description: e.target.value })}
            placeholder="De quoi vas-tu parler ? Donne envie de te rejoindre…"
            className="w-full resize-none bg-transparent text-[13px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/70"
          />
          <p className="text-right text-[10.5px] text-muted-foreground">{cfg.description.length}/500</p>
        </div>
      </Section>

      <Section n={3} title="Image de couverture (facultatif)">
        <div className="flex gap-3">
          <div className="relative h-[92px] flex-1 overflow-hidden rounded-2xl border border-border">
            <img src={cfg.cover ?? IMG.mic} alt="Aperçu de la couverture" className="h-full w-full object-cover" />
            <Pressable
              onClick={() => {
                tap();
                set({ cover: IMG.world });
              }}
              className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-full bg-black/65 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-md"
            >
              <Camera size={12} /> Modifier
            </Pressable>
          </div>
          <Pressable
            onClick={() => {
              tap();
              set({ cover: IMG.table });
            }}
            className="flex h-[92px] flex-1 flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-gold/45 bg-gold/5 text-gold"
          >
            <Plus size={20} />
            <span className="text-[11px] font-semibold">Ajouter une image</span>
          </Pressable>
        </div>
      </Section>

      <Section n={4} title="Visibilité du live">
        <div className="flex gap-3">
          <ChoiceCard
            active={cfg.visibility === "public"}
            icon={<Globe size={15} />}
            title="Public"
            desc="Tout le monde peut rejoindre"
            onClick={() => set({ visibility: "public" })}
          />
          <ChoiceCard
            active={cfg.visibility === "private"}
            icon={<Lock size={15} />}
            title="Privé"
            desc="Sur invitation uniquement"
            onClick={() => set({ visibility: "private" })}
          />
        </div>
      </Section>

      <Section n={5} title="Accès au live">
        <div className="flex gap-3">
          <ChoiceCard
            active={cfg.access === "free"}
            icon={<Users size={15} />}
            title="Gratuit"
            desc="Accès libre pour tous"
            onClick={() => set({ access: "free" })}
          />
          <ChoiceCard
            active={cfg.access === "paid"}
            icon={<Ticket size={15} />}
            title="Payant"
            desc="Demande des Tickets pour entrer"
            onClick={() => set({ access: "paid" })}
          />
        </div>

        {cfg.access === "paid" && (
          <div className="card-surface mt-3 rounded-2xl p-3">
            <p className="text-[12px] font-bold text-foreground">Prix d'entrée (Tickets)</p>
            <div className="mt-2 flex gap-2">
              {([1, 3, 5, 10] as const).map((p) => (
                <Pill key={p} active={cfg.price === p} onClick={() => set({ price: p })}>
                  {p} 🎟
                </Pill>
              ))}
            </div>
            <p className="mt-2 text-[10.5px] leading-snug text-muted-foreground">
              Tu recevras 80% des Tickets (après frais de plateforme).
            </p>
          </div>
        )}
      </Section>

      <Section n={6} title="Qui peut commenter ?">
        <div className="flex flex-wrap gap-2">
          <Pill active={cfg.comments === "all"} onClick={() => set({ comments: "all" })}>
            <span className="inline-flex items-center gap-1">
              <MessageCircle size={12} /> Tout le monde
            </span>
          </Pill>
          <Pill active={cfg.comments === "followers"} onClick={() => set({ comments: "followers" })}>
            <span className="inline-flex items-center gap-1">
              <Users size={12} /> Abonnés uniquement
            </span>
          </Pill>
          <Pill active={cfg.comments === "none"} onClick={() => set({ comments: "none" })}>
            <span className="inline-flex items-center gap-1">
              <Ban size={12} /> Personne (Mode écoute)
            </span>
          </Pill>
        </div>
      </Section>

      <Section n={7} title="Règles du live (optionnel)">
        <Pressable
          onClick={() => {
            tap();
            setDraftRules(cfg.rules);
            setRulesOpen(true);
          }}
          className="card-surface flex w-full items-center gap-2 rounded-2xl px-3 py-3 text-left"
        >
          <span className="min-w-0 flex-1 truncate text-[12.5px] text-foreground/85">{cfg.rules}</span>
          <ChevronRight size={17} className="shrink-0 text-muted-foreground" />
        </Pressable>
      </Section>

      <div className="mt-6 px-4">
        <Pressable
          onClick={() => {
            tap();
            navigate({ to: "/talk-show/preview/$format", params: { format } });
          }}
          className="w-full rounded-full bg-gold-gradient py-3.5 text-[14px] font-extrabold text-[oklch(0.16_0.02_60)]"
        >
          Suivant ›
        </Pressable>
      </div>

      <BottomSheet open={rulesOpen} onClose={() => setRulesOpen(false)}>
        <div className="px-4 pt-1">
          <h3 className="text-[16px] font-extrabold">Règles de ton live</h3>
          <textarea
            value={draftRules}
            rows={3}
            onChange={(e) => setDraftRules(e.target.value)}
            className="card-surface mt-3 w-full resize-none rounded-2xl px-3 py-2.5 text-[13px] text-foreground outline-none"
          />
          <Pressable
            onClick={() => {
              set({ rules: draftRules });
              setRulesOpen(false);
            }}
            className="mt-3 w-full rounded-full bg-gold-gradient py-3 text-[13.5px] font-extrabold text-[oklch(0.16_0.02_60)]"
          >
            Enregistrer
          </Pressable>
        </div>
      </BottomSheet>
    </div>
  );
}

export function FormatIcon({ format, size = 22 }: { format: FormatId; size?: number }) {
  const cls = "text-gold";
  if (format === "storytime") return <BookOpen size={size} className={cls} />;
  if (format === "open-mic") return <MicVocal size={size} className={cls} />;
  if (format === "stand") return <Users size={size} className={cls} />;
  return <Mic size={size} className={cls} />;
}

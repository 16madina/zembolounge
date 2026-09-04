import { useNavigate } from "@tanstack/react-router";
import { Camera, ChevronRight, Globe, Lock, MessageCircle, Pencil, Radio, ScrollText, Shield, Ticket, Users } from "lucide-react";
import type { ReactNode } from "react";
import { IMG } from "@/lib/zembo-data";
import {
  ACCESS_LABEL,
  COMMENTS_LABEL,
  FORMAT_META,
  VISIBILITY_LABEL,
  useLiveConfig,
  type FormatId,
} from "@/lib/talk-show-config";
import { SetupHeader } from "./TalkShowConfig";
import { Pressable } from "./ui";

function tap() {
  navigator.vibrate?.(12);
}

function RecapRow({
  icon,
  label,
  value,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <Pressable
      onClick={() => {
        tap();
        onClick();
      }}
      className="card-surface flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gold/12 text-gold">
        {icon}
      </span>
      <span className="text-[12px] font-semibold text-muted-foreground">{label}</span>
      <span className="min-w-0 flex-1 truncate text-right text-[12.5px] font-bold text-foreground">
        {value}
      </span>
      <ChevronRight size={16} className="shrink-0 text-muted-foreground" />
    </Pressable>
  );
}

export function TalkShowPreviewScreen({ format }: { format: FormatId }) {
  const navigate = useNavigate();
  const cfg = useLiveConfig();
  const meta = FORMAT_META[format];

  const toConfig = () => navigate({ to: "/talk-show/config/$format", params: { format } });

  const launch = () => {
    tap();
    if (format === "storytime") navigate({ to: "/talk-show/storytime" });
    else if (format === "open-mic") navigate({ to: "/talk-show/open-mic" });
    else if (format === "stand") navigate({ to: "/talk-show/stand" });
    else navigate({ to: "/talk-show/slam" });
  };

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <SetupHeader
        onBack={toConfig}
        right={<span className="text-[12px] font-bold text-gold">2/2</span>}
      />

      <div className="app-scroll no-scrollbar min-h-0 flex-1 pb-[188px]">
      <section className="px-4 pt-4 text-center">
        <h1 className="text-[26px] leading-none font-extrabold tracking-tight">Tout est prêt !</h1>
        <p className="mt-2 text-[12.5px] text-muted-foreground">
          Vérifie les informations avant de lancer ton {meta.name}.
        </p>
      </section>


      <div className="mt-4 px-4">
        <div className="card-surface overflow-hidden rounded-[22px]">
          <div className="relative">
            <img
              src={cfg.cover ?? IMG.mic}
              alt="Couverture du live"
              className="h-[168px] w-full object-cover"
            />
            <Pressable
              onClick={() => {
                tap();
                toConfig();
              }}
              className="absolute right-2 bottom-2 flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-1 text-[10.5px] font-bold text-white backdrop-blur-md"
            >
              <Camera size={12} /> Modifier
            </Pressable>
          </div>
          <div className="p-3.5">
            <h2 className="text-[15.5px] leading-snug font-extrabold text-foreground">
              {cfg.title || meta.placeholder}
            </h2>
            <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
              {cfg.description || "Aucune description ajoutée."}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-2 px-4">
        <RecapRow
          icon={cfg.visibility === "public" ? <Globe size={15} /> : <Lock size={15} />}
          label="Visibilité"
          value={VISIBILITY_LABEL[cfg.visibility]}
          onClick={toConfig}
        />
        <RecapRow
          icon={cfg.access === "free" ? <Users size={15} /> : <Ticket size={15} />}
          label="Accès"
          value={
            cfg.access === "free"
              ? ACCESS_LABEL.free
              : `${ACCESS_LABEL.paid} · ${cfg.price} Tickets`
          }
          onClick={toConfig}
        />
        <RecapRow
          icon={<MessageCircle size={15} />}
          label="Commentaires"
          value={COMMENTS_LABEL[cfg.comments]}
          onClick={toConfig}
        />
        <RecapRow
          icon={<ScrollText size={15} />}
          label="Règles"
          value={cfg.rules}
          onClick={toConfig}
        />
      </div>

      <div className="mx-4 mt-4 flex items-start gap-3 rounded-[18px] border border-gold/35 bg-gold/6 p-3.5">
        <Shield size={18} className="mt-0.5 shrink-0 text-gold" />
        <div className="min-w-0">
          <p className="text-[13px] font-bold text-foreground">Rappel important</p>
          <p className="mt-1 text-[11.5px] leading-snug text-muted-foreground">
            Assure-toi de respecter nos Règles de la communauté. Tout comportement inapproprié peut
            entraîner la suspension de ton compte.
          </p>
        </div>
      </div>

      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 space-y-2.5 bg-gradient-to-t from-background via-background/95 to-transparent px-4 pt-8 pb-[calc(env(safe-area-inset-bottom)+92px)]">
        <Pressable
          onClick={launch}
          className="pointer-events-auto flex w-full items-center justify-center gap-2 rounded-full bg-gold-gradient py-3.5 text-[14px] font-extrabold text-[oklch(0.16_0.02_60)]"
        >
          <Radio size={17} /> Lancer mon {meta.name}
        </Pressable>
        <Pressable
          onClick={() => {
            tap();
            toConfig();
          }}
          className="pointer-events-auto flex w-full items-center justify-center gap-2 rounded-full border border-border bg-surface/70 py-3.5 text-[13px] font-bold text-foreground/85"
        >
          <Pencil size={15} /> Modifier les informations
        </Pressable>
      </div>
    </div>
  );
}

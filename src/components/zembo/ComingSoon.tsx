import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { Pressable } from "./ui";

export function ComingSoon({
  title,
  accent,
  icon,
}: {
  title: string;
  accent: string;
  icon: ReactNode;
}) {
  const navigate = useNavigate();

  return (
    <div className="app-scroll no-scrollbar pb-[112px]">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/50 bg-background/85 px-4 pt-[max(env(safe-area-inset-top),12px)] pb-3 backdrop-blur-xl">
        <Pressable onClick={() => navigate({ to: "/talk-show" })} aria-label="Retour" className="-ml-1">
          <ArrowLeft size={24} className="text-gold" />
        </Pressable>
        <h1 className="text-[15px] font-extrabold tracking-[0.1em] uppercase text-foreground">
          {title}
        </h1>
      </header>

      <div className="flex flex-col items-center px-6 pt-20 text-center">
        <span className="relative flex h-32 w-32 items-center justify-center">
          <span
            className="absolute inset-0 rounded-full opacity-60 blur-2xl"
            style={{
              background: `radial-gradient(circle, color-mix(in oklab, ${accent} 55%, transparent), transparent 70%)`,
            }}
          />
          <span className="relative drop-shadow-[0_6px_18px_oklch(0.82_0.13_85_/_35%)]">{icon}</span>
        </span>

        <h2 className="mt-8 text-[24px] font-extrabold tracking-tight text-foreground">{title}</h2>

        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-gold/8 px-4 py-1.5 text-[12px] font-bold tracking-wide text-gold">
          <Sparkles size={13} /> BIENTÔT
        </span>

        <p className="mt-4 max-w-[260px] text-[13px] leading-relaxed text-muted-foreground">
          Cet écran arrive très bientôt. En attendant, explore les autres formats Talk Show !
        </p>

        <Pressable
          onClick={() => navigate({ to: "/talk-show" })}
          className="mt-7 rounded-full bg-gold-gradient px-6 py-3 text-[13px] font-bold text-[oklch(0.16_0.02_60)]"
        >
          Retour aux formats
        </Pressable>
      </div>
    </div>
  );
}

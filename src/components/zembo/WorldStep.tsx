import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Pressable } from "@/components/zembo/ui";

export function WorldStep({
  step,
  title,
  subtitle,
  back,
  cta = "Continuer",
  ctaDisabled,
  onCta,
  secondary,
  onSecondary,
  children,
}: {
  step: number;
  title: string;
  subtitle: string;
  back: string;
  cta?: string;
  ctaDisabled?: boolean;
  onCta: () => void;
  secondary?: string;
  onSecondary?: () => void;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-[oklch(0.06_0.01_50)]">
      <div className="shrink-0 px-5 pt-[max(env(safe-area-inset-top),14px)]">
        <div className="flex items-center gap-2">
          <Pressable
            onClick={() => navigate({ to: back })}
            aria-label="Retour"
            className="-ml-1 rounded-full p-1"
          >
            <ArrowLeft size={22} className="text-gold" />
          </Pressable>
          <span className="text-[12px] font-semibold tracking-wide text-muted-foreground">
            ÉTAPE {step}/6
          </span>
        </div>

        <div className="mt-3 flex gap-1.5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <span
              key={i}
              className={`h-1 flex-1 rounded-full ${i <= step ? "bg-gold-gradient" : "bg-white/10"}`}
            />
          ))}
        </div>

        <h1 className="mt-5 text-[22px] font-extrabold leading-tight text-foreground">{title}</h1>
        <p className="mt-1.5 text-[13px] text-muted-foreground">{subtitle}</p>
      </div>

      <div className="app-scroll no-scrollbar min-h-0 flex-1 px-5 pt-5 pb-4">{children}</div>

      <div className="shrink-0 border-t border-white/5 bg-[oklch(0.06_0.01_50)]/95 px-5 pt-3 pb-[max(env(safe-area-inset-bottom),16px)] backdrop-blur-sm">
        <Pressable
          onClick={onCta}
          disabled={ctaDisabled}
          className={`flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-bold ${
            ctaDisabled
              ? "border border-gold/20 bg-white/[0.04] text-muted-foreground"
              : "glow-gold bg-gold-gradient text-[oklch(0.16_0.02_60)]"
          }`}
        >
          {cta} <span className="text-[17px] leading-none">›</span>
        </Pressable>
        {secondary && (
          <Pressable
            onClick={onSecondary}
            className="mt-2 flex w-full items-center justify-center rounded-full border border-gold/25 py-3 text-[14px] font-semibold text-gold"
          >
            {secondary}
          </Pressable>
        )}
      </div>
    </div>
  );
}

export const worldInputCls =
  "w-full rounded-2xl border border-gold/20 bg-white/[0.04] px-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground/70 outline-none focus:border-gold/50";

export function worldHead(step: number, title: string, description: string) {
  return () => ({
    meta: [
      { title: `${title} — World Room` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} — World Room` },
      { property: "og:description", content: `Étape ${step}/6 de ton profil World Room.` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  });
}

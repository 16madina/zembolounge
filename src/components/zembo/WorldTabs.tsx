import { useNavigate, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type WorldTab = { to: string; emoji: string; label: string };

const WORLD_TABS: WorldTab[] = [
  { to: "/world/discover", emoji: "🌍", label: "Découvrir" },
  { to: "/world/hellos", emoji: "👋", label: "Hellos" },
  { to: "/world/messages", emoji: "💬", label: "Messages" },
  { to: "/world/profile", emoji: "👤", label: "Mon profil" },
];

/** Barre d'onglets interne World Room (or = actif). */
export function WorldTabs({
  badge,
  floating = false,
  className,
}: {
  /** Badges par route (ex. { "/world/hellos": 2 }). */
  badge?: Record<string, number>;
  /** Version superposée (écran plein écran type découverte). */
  floating?: boolean;
  className?: string;
}) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      className={cn(
        "flex w-full items-stretch gap-1 rounded-2xl border p-1",
        floating
          ? "border-gold/30 bg-black/65 backdrop-blur-md"
          : "border-white/10 bg-[oklch(0.145_0.006_60)]",
        className,
      )}
    >
      {WORLD_TABS.map((t) => {
        const active = pathname === t.to;
        const count = badge?.[t.to];
        return (
          <button
            key={t.to}
            type="button"
            onClick={() => {
              if (typeof navigator !== "undefined") navigator.vibrate?.(8);
              if (!active) navigate({ to: t.to });
            }}
            className="relative min-w-0 flex-1 rounded-xl px-0.5 py-1.5 outline-none"
          >
            {active && (
              <motion.span
                layoutId="world-tabs-pill"
                className="bg-gold-gradient absolute inset-0 rounded-xl"
                transition={{ type: "spring", stiffness: 460, damping: 34 }}
              />
            )}
            <span
              className={cn(
                "relative flex min-w-0 items-center justify-center gap-[3px]",
                active ? "text-[oklch(0.16_0.02_60)]" : "text-white/70",
              )}
            >
              <span className="text-[11px] leading-none">{t.emoji}</span>
              <span
                className={cn(
                  "truncate text-[10px] leading-none",
                  active ? "font-black" : "font-medium",
                )}
              >
                {t.label}
              </span>
              {count ? (
                <span
                  className={cn(
                    "flex h-[15px] min-w-[15px] items-center justify-center rounded-full px-1 text-[9px] font-bold",
                    active ? "bg-[oklch(0.16_0.02_60)] text-gold" : "bg-gold text-[oklch(0.16_0.02_60)]",
                  )}
                >
                  {count}
                </span>
              ) : null}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

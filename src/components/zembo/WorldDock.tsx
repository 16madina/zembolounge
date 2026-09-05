import { useNavigate, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Pressable } from "./ui";

type WorldDockItem = { to: string; emoji: string; label: string };

const ITEMS: WorldDockItem[] = [
  { to: "/world/discover", emoji: "🌍", label: "Découvrir" },
  { to: "/world/hellos", emoji: "👋", label: "Hellos" },
  { to: "/world/messages", emoji: "💬", label: "Messages" },
  { to: "/world/profile", emoji: "👤", label: "Mon profil" },
];

/** Dock World Room : remplace le dock Zembo à l'intérieur de World Room. */
export function WorldDock({ badge }: { badge?: Record<string, number> }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 pb-[max(env(safe-area-inset-bottom),10px)]">
      <div className="pointer-events-auto mx-3 mb-1 flex items-end justify-between rounded-[28px] border border-gold/25 bg-[oklch(0.12_0.01_60)]/95 px-2 pt-2 pb-2 backdrop-blur-xl">
        {ITEMS.map((t) => {
          const active = pathname === t.to;
          const count = badge?.[t.to];
          return (
            <Pressable
              key={t.to}
              onClick={() => {
                if (typeof navigator !== "undefined") navigator.vibrate?.(8);
                if (!active) navigate({ to: t.to });
              }}
              aria-label={t.label}
              className="relative flex w-[24%] flex-col items-center gap-1 py-1"
            >
              <span className="relative text-[19px] leading-none">
                <span className={cn(active ? "opacity-100" : "opacity-55")}>{t.emoji}</span>
                {count ? (
                  <span className="absolute -top-1 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] font-bold text-[oklch(0.16_0.02_60)]">
                    {count}
                  </span>
                ) : null}
              </span>
              <span
                className={cn(
                  "max-w-full truncate text-[10px]",
                  active ? "font-bold text-gold" : "font-medium text-foreground/45",
                )}
              >
                {t.label}
              </span>
              {active && (
                <motion.span
                  layoutId="world-dock-underline"
                  className="absolute -bottom-0.5 h-[3px] w-6 rounded-full bg-gold"
                />
              )}
            </Pressable>
          );
        })}
      </div>
    </div>
  );
}

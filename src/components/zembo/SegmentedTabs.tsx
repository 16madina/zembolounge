import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type SegmentedTab = {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
};

export function SegmentedTabs({
  tabs,
  value,
  onChange,
  layoutId,
}: {
  tabs: SegmentedTab[];
  value: string;
  onChange: (id: string) => void;
  layoutId: string;
}) {
  return (
    <div className="flex w-full items-stretch gap-0.5 rounded-2xl bg-[oklch(0.145_0.006_60)] p-1">
      {tabs.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className="relative min-w-0 flex-1 rounded-xl px-0.5 py-2 outline-none"
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="bg-gold-gradient absolute inset-0 rounded-xl"
                transition={{ type: "spring", stiffness: 480, damping: 34 }}
              />
            )}
            <span
              className={cn(
                "relative flex items-center justify-center gap-[3px]",
                active ? "text-[oklch(0.16_0.02_60)]" : "text-foreground/80",
              )}
            >
              <t.icon size={12} strokeWidth={active ? 2.6 : 2} />
              <span
                className={cn(
                  "truncate text-[10px]",
                  active ? "font-bold" : "font-medium",
                )}
              >
                {t.label}
              </span>
              {t.badge ? (
                <span
                  className={cn(
                    "flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold",
                    active
                      ? "bg-[oklch(0.16_0.02_60)] text-gold"
                      : "bg-gold text-[oklch(0.16_0.02_60)]",
                  )}
                >
                  {t.badge}
                </span>
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}

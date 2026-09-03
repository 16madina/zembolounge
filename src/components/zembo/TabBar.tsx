import { Link, useRouterState } from "@tanstack/react-router";
import { Home, MessageCircle, Plus, Radio, User } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Pressable } from "./ui";

const TABS = [
  { to: "/", label: "Accueil", icon: Home },
  { to: "/live", label: "Live", icon: Radio },
  { to: "/messages", label: "Messages", icon: MessageCircle, dot: true },
  { to: "/profile", label: "Profil", icon: User },
] as const;

export function TabBar({ onCreate }: { onCreate: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 pb-[max(env(safe-area-inset-bottom),10px)]">
      <div className="pointer-events-auto mx-3 mb-1 flex items-end justify-between rounded-[28px] border border-border bg-[oklch(0.12_0.01_60)]/95 px-3 pt-2 pb-2 backdrop-blur-xl">
        {TABS.slice(0, 2).map((t) => (
          <TabItem key={t.to} {...t} active={pathname === t.to} />
        ))}

        <Pressable
          onClick={onCreate}
          aria-label="Créer"
          className="glow-gold -mt-7 flex h-[58px] w-[58px] items-center justify-center rounded-full bg-gold-gradient"
        >
          <Plus size={28} strokeWidth={2.6} className="text-[oklch(0.16_0.02_60)]" />
        </Pressable>

        {TABS.slice(2).map((t) => (
          <TabItem key={t.to} {...t} active={pathname === t.to} />
        ))}
      </div>
    </div>
  );
}

function TabItem({
  to,
  label,
  icon: Icon,
  active,
  dot,
}: {
  to: string;
  label: string;
  icon: typeof Home;
  active: boolean;
  dot?: boolean;
}) {
  return (
    <Link to={to} className="relative flex w-[68px] flex-col items-center gap-1 py-1">
      <span className="relative">
        <Icon size={22} className={cn(active ? "text-gold" : "text-foreground/45")} strokeWidth={active ? 2.4 : 2} />
        {dot && (
          <span className="absolute -top-0.5 -right-1 h-2 w-2 rounded-full bg-gold ring-2 ring-[oklch(0.12_0.01_60)]" />
        )}
      </span>
      <span className={cn("text-[10px] font-medium", active ? "text-gold" : "text-foreground/45")}>{label}</span>
      {active && (
        <motion.span layoutId="tab-underline" className="absolute -bottom-0.5 h-[3px] w-6 rounded-full bg-gold" />
      )}
    </Link>
  );
}

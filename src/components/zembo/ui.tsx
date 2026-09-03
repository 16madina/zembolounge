import { motion } from "framer-motion";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { ChevronRight, Eye, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pressable({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof motion.button>) {
  return (
    <motion.button
      whileTap={{ scale: 0.955 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={cn("outline-none", className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}

const AVATAR_TINTS = [
  "from-[oklch(0.72_0.12_60)] to-[oklch(0.45_0.09_35)]",
  "from-[oklch(0.68_0.14_300)] to-[oklch(0.4_0.1_290)]",
  "from-[oklch(0.7_0.13_160)] to-[oklch(0.42_0.09_170)]",
  "from-[oklch(0.7_0.14_250)] to-[oklch(0.42_0.1_260)]",
  "from-[oklch(0.78_0.13_85)] to-[oklch(0.5_0.11_70)]",
];

export function Avatar({
  name,
  size = 40,
  ring,
  online,
  className,
}: {
  name: string;
  size?: number;
  ring?: boolean;
  online?: boolean;
  className?: string;
}) {
  const tint = AVATAR_TINTS[name.charCodeAt(0) % AVATAR_TINTS.length];
  return (
    <span className={cn("relative inline-flex shrink-0", className)} style={{ width: size, height: size }}>
      <span
        className={cn(
          "flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white/90",
          tint,
          ring && "ring-1 ring-gold/70",
        )}
        style={{ fontSize: size * 0.38 }}
      >
        {name.trim().charAt(0).toUpperCase()}
      </span>
      {online && (
        <span
          className="absolute right-0 bottom-0 rounded-full bg-emerald ring-2 ring-background"
          style={{ width: size * 0.26, height: size * 0.26 }}
        />
      )}
    </span>
  );
}

export function AvatarStack({ names, extra, size = 22 }: { names: string[]; extra?: number; size?: number }) {
  return (
    <div className="flex items-center">
      {names.map((n, i) => (
        <span key={n + i} style={{ marginLeft: i === 0 ? 0 : -size * 0.32 }}>
          <Avatar name={n} size={size} className="ring-2 ring-background rounded-full" />
        </span>
      ))}
      {extra ? (
        <span
          className="ml-1 rounded-full bg-surface-2/90 px-2 py-0.5 text-[10px] font-semibold text-foreground/80"
          style={{ marginLeft: -size * 0.2 }}
        >
          +{extra}
        </span>
      ) : null}
    </div>
  );
}

export function LiveBadge({ label = "LIVE" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-live px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white">
      <span className="live-dot h-1.5 w-1.5 rounded-full bg-white" />
      {label}
    </span>
  );
}

export function CountPill({ value, icon = "users" }: { value: string | number; icon?: "users" | "eye" }) {
  const Icon = icon === "users" ? Users : Eye;
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-black/55 px-1.5 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur-sm">
      <Icon size={11} />
      {value}
    </span>
  );
}

export function SectionTitle({
  icon,
  children,
  action,
  onAction,
}: {
  icon?: ReactNode;
  children: ReactNode;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-4">
      <h2 className="flex items-center gap-2 text-[13px] font-bold tracking-[0.12em] text-foreground/90 uppercase">
        {icon}
        {children}
      </h2>
      {action && (
        <Pressable onClick={onAction} className="flex items-center gap-0.5 text-xs font-semibold text-gold">
          {action}
          <ChevronRight size={14} />
        </Pressable>
      )}
    </div>
  );
}

export function Chip({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <Pressable
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors",
        active
          ? "border-transparent bg-gold-gradient text-[oklch(0.16_0.02_60)]"
          : "border-border bg-surface/70 text-foreground/70",
      )}
    >
      {children}
    </Pressable>
  );
}

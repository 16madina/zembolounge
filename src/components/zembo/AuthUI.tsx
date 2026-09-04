import { motion } from "framer-motion";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Pressable } from "./ui";

export const COUNTRIES = [
  { code: "CA", flag: "🇨🇦", name: "Canada", dial: "+1" },
  { code: "FR", flag: "🇫🇷", name: "France", dial: "+33" },
  { code: "BE", flag: "🇧🇪", name: "Belgique", dial: "+32" },
  { code: "CH", flag: "🇨🇭", name: "Suisse", dial: "+41" },
  { code: "SN", flag: "🇸🇳", name: "Sénégal", dial: "+221" },
  { code: "CI", flag: "🇨🇮", name: "Côte d'Ivoire", dial: "+225" },
  { code: "CM", flag: "🇨🇲", name: "Cameroun", dial: "+237" },
  { code: "CD", flag: "🇨🇩", name: "RD Congo", dial: "+243" },
  { code: "MA", flag: "🇲🇦", name: "Maroc", dial: "+212" },
  { code: "US", flag: "🇺🇸", name: "États-Unis", dial: "+1" },
] as const;

export function AuthBrand() {
  return (
    <div className="flex items-center justify-center gap-2.5">
      <span className="bg-gold-gradient glow-gold flex h-11 w-11 items-center justify-center rounded-full text-[20px] font-black text-[oklch(0.16_0.02_60)]">
        Z
      </span>
      <span className="text-gold-gradient text-[24px] font-black tracking-[0.18em]">ZEMBO</span>
    </div>
  );
}

export function AuthField({
  label,
  icon,
  trailing,
  children,
}: {
  label: string;
  icon: ReactNode;
  trailing?: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between gap-2 text-[13px] font-semibold text-white">
        {label}
        {trailing}
      </span>
      <span className="flex items-center gap-2.5 rounded-2xl border border-border/70 bg-[oklch(0.145_0.006_60)] px-3.5 py-3 focus-within:border-gold/70">
        <span className="shrink-0 text-gold">{icon}</span>
        {children}
      </span>
    </label>
  );
}

export const inputClass =
  "min-w-0 flex-1 bg-transparent text-[15px] text-white outline-none placeholder:text-muted-foreground";

export function GoldButton({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof motion.button>) {
  return (
    <Pressable
      {...props}
      className={cn(
        "bg-gold-gradient glow-gold flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-black tracking-wider text-[oklch(0.16_0.02_60)] disabled:opacity-60",
        className,
      )}
    >
      {children}
    </Pressable>
  );
}

export function SocialRow() {
  const soon = (name: string) => toast("Bientôt disponible", { description: `${name} arrive très vite.` });
  return (
    <div className="grid grid-cols-3 gap-2.5">
      <Pressable
        onClick={() => soon("Apple")}
        className="flex items-center justify-center gap-1.5 rounded-2xl border border-white/15 bg-black py-3 text-[13px] font-semibold text-white"
      >
        <span className="text-[15px] font-black">⌘</span> Apple
      </Pressable>
      <Pressable
        onClick={() => soon("Google")}
        className="flex items-center justify-center gap-1.5 rounded-2xl bg-white py-3 text-[13px] font-semibold text-[oklch(0.2_0_0)]"
      >
        <span className="text-[15px] font-black text-[oklch(0.55_0.2_25)]">G</span> Google
      </Pressable>
      <Pressable
        onClick={() => soon("Facebook")}
        className="flex items-center justify-center gap-1.5 rounded-2xl bg-[oklch(0.48_0.19_264)] py-3 text-[13px] font-semibold text-white"
      >
        <span className="text-[15px] font-black">f</span> Facebook
      </Pressable>
    </div>
  );
}

export function AuthDivider() {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-border" />
      <span className="text-[12px] text-muted-foreground">ou continuer avec</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

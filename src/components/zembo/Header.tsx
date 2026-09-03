import { Bell, Search } from "lucide-react";
import { Avatar, Pressable } from "./ui";
import { ZemboIcon, ZemboWordmark } from "./ZemboMark";

export function ScreenHeader({
  title,
  wordmark = true,
  compact,
}: {
  title?: string;
  wordmark?: boolean;
  compact?: boolean;
}) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-2 border-b border-border/50 bg-background/85 px-4 pt-[max(env(safe-area-inset-top),12px)] pb-3 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <ZemboIcon size={22} />
        {wordmark && <ZemboWordmark className="text-[15px]" />}
      </div>
      {title && (
        <span className="text-[13px] font-bold tracking-[0.2em] text-gold uppercase">{title}</span>
      )}
      <div className="flex items-center gap-2">
        <Pressable
          aria-label="Rechercher"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface/60"
        >
          <Search size={17} className="text-foreground/70" />
        </Pressable>
        <Pressable
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface/60"
        >
          <Bell size={17} className="text-foreground/70" />
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-live px-1 text-[9px] font-bold text-white">
            7
          </span>
        </Pressable>
        {!compact && <Avatar name="Deena" size={34} ring online />}
      </div>
    </header>
  );
}

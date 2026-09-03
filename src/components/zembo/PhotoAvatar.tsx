import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ZemboIcon } from "./ZemboMark";

export function photoUrl(seed: string, size = 160) {
  return `https://i.pravatar.cc/${size}?u=zembo-${encodeURIComponent(seed)}`;
}

export function PhotoAvatar({
  name,
  size = 56,
  ring = true,
  status,
  className,
}: {
  name: string;
  size?: number;
  ring?: boolean;
  status?: "online" | "away" | "none";
  className?: string;
}) {
  const dot = Math.max(10, Math.round(size * 0.25));
  return (
    <span
      className={cn("relative inline-flex shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <img
        src={photoUrl(name)}
        alt={name}
        loading="lazy"
        className={cn(
          "h-full w-full rounded-full object-cover",
          ring && "border-2 border-gold/80",
        )}
      />
      {status === "online" && (
        <span
          className="absolute right-0 bottom-0 rounded-full bg-emerald ring-2 ring-background"
          style={{ width: dot, height: dot }}
        />
      )}
      {status === "away" && (
        <span
          className="absolute right-0 bottom-0 flex items-center justify-center rounded-full bg-[oklch(0.16_0.01_60)] text-gold ring-2 ring-background"
          style={{ width: dot + 2, height: dot + 2 }}
        >
          <Clock size={Math.round(dot * 0.62)} />
        </span>
      )}
    </span>
  );
}

export function GroupAvatar({ seeds, size = 56 }: { seeds: string[]; size?: number }) {
  return (
    <span
      className="relative inline-grid shrink-0 grid-cols-2 overflow-hidden rounded-full border-2 border-gold/80"
      style={{ width: size, height: size }}
    >
      {seeds.slice(0, 4).map((s) => (
        <img key={s} src={photoUrl(s, 80)} alt="" loading="lazy" className="h-full w-full object-cover" />
      ))}
    </span>
  );
}

export function OfficialAvatar({ size = 56 }: { size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full border-2 border-gold/80 bg-black"
      style={{ width: size, height: size }}
    >
      <ZemboIcon size={Math.round(size * 0.58)} />
    </span>
  );
}

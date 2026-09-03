import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, ChevronDown, MessageSquare, MicOff, Plus, SquarePen, Users } from "lucide-react";
import { ScreenHeader } from "@/components/zembo/Header";
import { Avatar, Pressable } from "@/components/zembo/ui";
import { conversations, people } from "@/lib/zembo-data";

export const Route = createFileRoute("/messages")({
  head: () => ({
    meta: [
      { title: "Messages — Zembo" },
      {
        name: "description",
        content: "Tes discussions, demandes, activité et groupes de la communauté Zembo.",
      },
      { property: "og:title", content: "Messages — Zembo" },
      {
        property: "og:description",
        content: "Continue les conversations démarrées en live, en table ou en groupe.",
      },
    ],
  }),
  component: Messages,
});

const TABS = [
  { id: "discussions", label: "Discussions", icon: MessageSquare },
  { id: "demandes", label: "Demandes", icon: Users, badge: 4 },
  { id: "activite", label: "Activité", icon: Bell },
  { id: "groupes", label: "Groupes", icon: Users },
];

function Messages() {
  const [tab, setTab] = useState("discussions");

  return (
    <div className="pb-4">
      <ScreenHeader wordmark compact />

      <h1 className="px-4 pt-4 text-[26px] font-extrabold">Messages</h1>

      <div className="snap-row mt-3 gap-2 px-4">
        {TABS.map((t) => (
          <Pressable
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12.5px] font-semibold ${
              tab === t.id
                ? "bg-gold-gradient text-[oklch(0.16_0.02_60)]"
                : "border border-border bg-surface/50 text-foreground/70"
            }`}
          >
            <t.icon size={14} />
            {t.label}
            {t.badge && (
              <span className="rounded-full bg-live px-1.5 text-[10px] font-bold text-white">{t.badge}</span>
            )}
          </Pressable>
        ))}
      </div>

      <div className="snap-row mt-4 gap-3.5 px-4">
        <Pressable className="flex w-[64px] flex-col items-center gap-1.5">
          <span className="flex h-[58px] w-[58px] items-center justify-center rounded-full border border-dashed border-gold/60 text-gold">
            <Plus size={22} />
          </span>
          <span className="text-center text-[10.5px] leading-tight text-muted-foreground">
            Nouvelle discussion
          </span>
        </Pressable>
        {people.map((p) => (
          <Pressable key={p} className="flex w-[64px] flex-col items-center gap-1.5">
            <span className="rounded-full bg-gold-gradient p-[2px]">
              <Avatar name={p} size={54} online />
            </span>
            <span className="w-full truncate text-center text-[11px] font-medium">{p}</span>
          </Pressable>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between px-4">
        <h2 className="text-[15px] font-bold">Messages</h2>
        <Pressable className="flex items-center gap-1 text-[12px] text-muted-foreground">
          Trier par : <span className="font-semibold text-gold">Récents</span>
          <ChevronDown size={14} className="text-gold" />
        </Pressable>
      </div>

      <div className="mt-2 space-y-2 px-4">
        {conversations.map((c) => (
          <Pressable key={c.id} className="card-surface flex w-full items-start gap-3 rounded-2xl p-3 text-left">
            <Avatar name={c.name} size={46} ring online={!c.group} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-[14px] font-semibold">{c.name}</p>
                {c.badge && (
                  <span className="rounded-md border border-gold/50 px-1.5 py-0.5 text-[9px] font-bold text-gold">
                    {c.badge}
                  </span>
                )}
              </div>
              {c.group && <p className="text-[11px] text-muted-foreground">{c.group}</p>}
              {c.lines.map((l, i) => (
                <p key={i} className="truncate text-[12.5px] text-foreground/65">
                  {l}
                </p>
              ))}
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <span className="text-[11px] text-muted-foreground">{c.time}</span>
              {c.unread > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-[oklch(0.16_0.02_60)]">
                  {c.unread}
                </span>
              )}
              {c.dot && <span className="h-2.5 w-2.5 rounded-full bg-gold" />}
              {c.muted && <MicOff size={14} className="text-muted-foreground" />}
            </div>
          </Pressable>
        ))}
      </div>

      <Pressable
        aria-label="Nouveau message"
        className="glow-gold fixed right-4 bottom-32 flex h-12 w-12 items-center justify-center rounded-full bg-gold-gradient"
      >
        <SquarePen size={20} className="text-[oklch(0.16_0.02_60)]" />
      </Pressable>
    </div>
  );
}

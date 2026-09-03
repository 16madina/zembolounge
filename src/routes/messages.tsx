import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bell,
  ChevronDown,
  MessageSquare,
  MicOff,
  MoreVertical,
  Plus,
  Search,
  SquarePen,
  UserPlus,
  Users,
} from "lucide-react";
import { Pressable } from "@/components/zembo/ui";
import { ZemboWordmark } from "@/components/zembo/ZemboMark";
import { SegmentedTabs, type SegmentedTab } from "@/components/zembo/SegmentedTabs";
import { GroupAvatar, OfficialAvatar, PhotoAvatar } from "@/components/zembo/PhotoAvatar";
import { ListSkeleton, useMockLoad } from "@/components/zembo/Skeleton";
import { contacts, conversations } from "@/lib/zembo-data";

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

const TABS: SegmentedTab[] = [
  { id: "discussions", label: "Discussions", icon: MessageSquare },
  { id: "demandes", label: "Demandes", icon: UserPlus, badge: 4 },
  { id: "activite", label: "Activité", icon: Bell },
  { id: "groupes", label: "Groupes", icon: Users },
];

function Messages() {
  const [tab, setTab] = useState("discussions");
  const loading = useMockLoad();
  const navigate = useNavigate();

  const list =
    tab === "groupes" ? conversations.filter((c) => c.kind === "group") : conversations;

  return (
    <div style={{ paddingBottom: 110 }}>
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border/50 bg-background/85 px-4 pt-[max(env(safe-area-inset-top),12px)] pb-3 backdrop-blur-xl">
        <ZemboWordmark className="text-[16px]" />
        <div className="flex items-center gap-4">
          <Pressable aria-label="Rechercher">
            <Search size={19} className="text-white" />
          </Pressable>
          <Pressable aria-label="Nouveau message">
            <SquarePen size={19} className="text-white" />
          </Pressable>
          <Pressable aria-label="Plus d'options">
            <MoreVertical size={19} className="text-white" />
          </Pressable>
        </div>
      </header>

      <h1 className="px-4 pt-4 text-[32px] leading-none font-bold text-white">Messages</h1>

      <div className="mt-4 px-4">
        <SegmentedTabs tabs={TABS} value={tab} onChange={setTab} layoutId="messages-seg" />
      </div>

      <div className="snap-row mt-4 gap-3.5 px-4">
        <Pressable className="flex w-[74px] shrink-0 flex-col items-center gap-1.5">
          <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full border border-gold/60 text-gold">
            <Plus size={26} />
          </span>
          <span className="text-center text-[12px] leading-tight text-white/85">
            Nouvelle
            <br />
            discussion
          </span>
        </Pressable>
        {contacts.map((c) => (
          <Pressable key={c.name} className="flex w-[74px] shrink-0 flex-col items-center gap-1.5">
            <PhotoAvatar name={c.name} size={72} status={c.status} />
            <span className="w-full truncate text-center text-[13px] text-white">{c.name}</span>
          </Pressable>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between px-4">
        <h2 className="text-[16px] font-bold text-white">Messages</h2>
        <Pressable className="flex items-center gap-1 text-[12.5px] text-muted-foreground">
          Trier par : <span className="font-semibold text-gold">Récents</span>
          <ChevronDown size={14} className="text-gold" />
        </Pressable>
      </div>

      {loading ? (
        <div className="mt-3">
          <ListSkeleton rows={5} />
        </div>
      ) : (
        <div className="mt-3 space-y-2.5 px-4">
          {list.map((c) => (
            <Pressable
              key={c.id}
              onClick={() => navigate({ to: "/messages/$id", params: { id: c.id } })}
              className="flex w-full items-start gap-3 rounded-[18px] border border-border/70 bg-[oklch(0.115_0.008_60)] p-3.5 text-left"
            >
              {c.kind === "group" ? (
                <GroupAvatar seeds={["Marc", "Leila", "Yann", "Aïcha"]} size={56} />
              ) : c.kind === "official" ? (
                <OfficialAvatar size={56} />
              ) : (
                <PhotoAvatar name={c.name} size={56} status="online" />
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  {c.kind === "group" && <Users size={14} className="shrink-0 text-gold" />}
                  <p className="truncate text-[15px] font-semibold text-white">{c.name}</p>
                  {c.badge && (
                    <span className="shrink-0 rounded-md border border-gold/50 px-1.5 py-[1px] text-[10px] font-bold tracking-wide text-gold uppercase">
                      {c.badge}
                    </span>
                  )}
                </div>
                {c.group && <p className="text-[13px] text-[oklch(0.75_0_0)]">{c.group}</p>}
                {c.lines.map((l, i) => (
                  <p key={i} className="truncate text-[14px] text-[oklch(0.75_0_0)]">
                    {l}
                  </p>
                ))}
              </div>

              <div className="flex shrink-0 flex-col items-end gap-2 pt-0.5">
                <span className="text-[12px] text-muted-foreground">{c.time}</span>
                {c.unread ? (
                  <span className="flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-gold px-1 text-[11px] font-bold text-[oklch(0.16_0.02_60)]">
                    {c.unread}
                  </span>
                ) : c.dot ? (
                  <span className="h-2.5 w-2.5 rounded-full bg-gold" />
                ) : c.muted ? (
                  <MicOff size={15} className="text-muted-foreground" />
                ) : null}
              </div>
            </Pressable>
          ))}
        </div>
      )}
    </div>
  );
}

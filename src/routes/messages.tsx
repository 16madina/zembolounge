import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Flame,
  Globe,
  Heart,
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
import { connections, conversationPreview, type WorldPerson } from "@/lib/world-hello";

export const Route = createFileRoute("/messages")({
  head: () => ({
    meta: [
      { title: "Messages — Zembo" },
      {
        name: "description",
        content: "Tes discussions, demandes, activité, groupes et connexions World Room sur Zembo.",
      },
      { property: "og:title", content: "Messages — Zembo" },
      {
        property: "og:description",
        content: "Continue les conversations démarrées en live, en table, en groupe ou dans World Room.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Messages,
});

const TABS: SegmentedTab[] = [
  { id: "discussions", label: "Discussions", icon: MessageSquare },
  { id: "demandes", label: "Demandes", icon: UserPlus, badge: 4 },
  { id: "activite", label: "Activité", icon: Bell },
  { id: "groupes", label: "Groupes", icon: Users },
  { id: "world", label: "World", icon: Globe },
];

const REQUESTS = [
  { name: "Inès", preview: "Salut ! On s'est croisés sur ta table hier 😊" },
  { name: "Kevin", preview: "J'ai adoré ton passage au micro ouvert 🔥" },
  { name: "Nadia", preview: "Tu organises un débat ce week-end ?" },
  { name: "Bilal", preview: "Je peux te poser une question sur Zembo ?" },
];

const ACTIVITY = [
  { name: "Sarah", text: "a aimé ton live « Red flags »", time: "12 min", icon: Heart },
  { name: "Yann", text: "a rejoint ta table Red Flags", time: "38 min", icon: Users },
  { name: "Leila", text: "a commencé à te suivre", time: "1 h", icon: UserPlus },
  { name: "Marc", text: "a envoyé 20 Zems sur ton stand", time: "3 h", icon: Flame },
  { name: "Aïcha", text: "a réagi à ton storytime", time: "Hier", icon: MessageSquare },
];

const GROUPS = [
  { name: "Red Flags Table", theme: "Relations ❤️", members: 8, seeds: ["Marc", "Leila", "Yann", "Aïcha"] },
  { name: "Parents célibataires", theme: "Discussion", members: 12, seeds: ["Sarah", "Kader", "Inès", "Marc"] },
  { name: "Débat du dimanche", theme: "Débats 🎤", members: 24, seeds: ["Yann", "Nadia", "Bilal", "Leila"] },
];

function Messages() {
  const [tab, setTab] = useState("discussions");
  const loading = useMockLoad();
  const navigate = useNavigate();
  const [worldConnections, setWorldConnections] = useState<WorldPerson[]>([]);
  const [handled, setHandled] = useState<Record<string, "ok" | "no">>({});

  useEffect(() => {
    setWorldConnections(connections());
  }, []);

  const list = conversations;

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

      {tab === "discussions" && (
        <>
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
        </>
      )}

      {tab === "demandes" && (
        <div className="mt-5 space-y-2.5 px-4">
          <p className="text-[13px] text-muted-foreground">
            Ces personnes veulent te parler. Accepte pour ouvrir la discussion.
          </p>
          {REQUESTS.map((r) => {
            const state = handled[r.name];
            return (
              <div
                key={r.name}
                className="rounded-[18px] border border-border/70 bg-[oklch(0.115_0.008_60)] p-3.5"
              >
                <div className="flex items-start gap-3">
                  <PhotoAvatar name={r.name} size={48} status="online" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold text-white">{r.name}</p>
                    <p className="text-[13.5px] text-[oklch(0.75_0_0)]">{r.preview}</p>
                  </div>
                </div>
                {state ? (
                  <p className="mt-2.5 text-[13px] font-semibold text-gold">
                    {state === "ok" ? "Demande acceptée ✅" : "Demande refusée"}
                  </p>
                ) : (
                  <div className="mt-3 flex gap-2">
                    <Pressable
                      onClick={() => setHandled((h) => ({ ...h, [r.name]: "ok" }))}
                      className="bg-gold-gradient flex-1 rounded-full py-2 text-[13.5px] font-bold text-[oklch(0.16_0.02_60)]"
                    >
                      Accepter
                    </Pressable>
                    <Pressable
                      onClick={() => setHandled((h) => ({ ...h, [r.name]: "no" }))}
                      className="flex-1 rounded-full border border-border py-2 text-[13.5px] font-semibold text-white/85"
                    >
                      Refuser
                    </Pressable>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === "activite" && (
        <div className="mt-5 space-y-2.5 px-4">
          {ACTIVITY.map((a) => (
            <div
              key={a.name + a.text}
              className="flex items-center gap-3 rounded-[18px] border border-border/70 bg-[oklch(0.115_0.008_60)] p-3.5"
            >
              <PhotoAvatar name={a.name} size={44} status="none" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14.5px] text-white">
                  <span className="font-semibold">{a.name}</span> {a.text}
                </p>
                <p className="text-[12px] text-muted-foreground">{a.time}</p>
              </div>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
                <a.icon size={15} />
              </span>
            </div>
          ))}
        </div>
      )}

      {tab === "groupes" && (
        <div className="mt-5 space-y-2.5 px-4">
          {GROUPS.map((g) => (
            <div
              key={g.name}
              className="flex items-center gap-3 rounded-[18px] border border-border/70 bg-[oklch(0.115_0.008_60)] p-3.5"
            >
              <GroupAvatar seeds={g.seeds} size={52} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold text-white">{g.name}</p>
                <p className="text-[13px] text-[oklch(0.75_0_0)]">
                  {g.theme} · {g.members} membres
                </p>
              </div>
              <ChevronRight size={18} className="shrink-0 text-gold" />
            </div>
          ))}
        </div>
      )}

      {tab === "world" && (
        <div className="mt-5 space-y-2.5 px-4">
          <div className="rounded-[18px] border border-gold/35 bg-[oklch(0.13_0.02_70)] p-3.5">
            <p className="text-[14.5px] font-semibold text-white">🌍 Tes connexions World Room</p>
            <p className="mt-1 text-[13px] text-[oklch(0.75_0_0)]">
              Les personnes avec qui le Hello a été mutuel et la rencontre validée.
            </p>
            <Pressable
              onClick={() => navigate({ to: "/world/messages" })}
              className="bg-gold-gradient mt-3 w-full rounded-full py-2 text-[13.5px] font-bold text-[oklch(0.16_0.02_60)]"
            >
              Ouvrir World Room
            </Pressable>
          </div>

          {worldConnections.length === 0 ? (
            <p className="px-1 py-6 text-center text-[13.5px] text-muted-foreground">
              Tes connexions mutuelles apparaîtront ici.
            </p>
          ) : (
            worldConnections.map((p) => {
              const preview = conversationPreview(p.id);
              return (
                <Pressable
                  key={p.id}
                  onClick={() => navigate({ to: "/world/messages/$id", params: { id: p.id } })}
                  className="flex w-full items-center gap-3 rounded-[18px] border border-border/70 bg-[oklch(0.115_0.008_60)] p-3.5 text-left"
                >
                  <PhotoAvatar name={p.name} size={52} status="online" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold text-white">
                      {p.name} {p.flag}
                    </p>
                    <p className="truncate text-[13.5px] text-[oklch(0.75_0_0)]">{preview.last}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <span className="text-[12px] text-muted-foreground">{preview.time}</span>
                    {preview.unread ? (
                      <span className="flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-gold px-1 text-[11px] font-bold text-[oklch(0.16_0.02_60)]">
                        {preview.unread}
                      </span>
                    ) : null}
                  </div>
                </Pressable>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Globe2, Hand, MessageCircle } from "lucide-react";
import { Pressable } from "@/components/zembo/ui";
import { WorldTabs } from "@/components/zembo/WorldTabs";
import { photoUrl } from "@/components/zembo/PhotoAvatar";
import { connections, conversationPreview, pendingHellos } from "@/lib/world-hello";

export const Route = createFileRoute("/world/messages")({
  head: () => ({
    meta: [
      { title: "Messagerie World Room — Zembo" },
      {
        name: "description",
        content:
          "Mes connexions World Room : les conversations débloquées après une connexion mutuelle.",
      },
      { property: "og:title", content: "Messagerie World Room — Zembo" },
      {
        property: "og:description",
        content: "Une conversation s'ouvre seulement après une connexion mutuelle.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorldMessages,
});

function WorldMessages() {
  const navigate = useNavigate();
  const [conns] = useState(() => connections());
  const [pending] = useState(() => pendingHellos());

  const tap = () => {
    if (typeof navigator !== "undefined") navigator.vibrate?.(8);
  };

  return (
    <div className="min-h-full bg-background px-4 pt-4 pb-[124px]">
      <div className="min-w-0">
        <h1 className="text-[19px] leading-none font-black text-white">Messages World</h1>
        <p className="mt-1 flex items-center gap-1.5 text-[11px] text-white/55">
          <Globe2 size={12} className="shrink-0 text-gold" /> 🌍 Tes connexions World — messagerie
          distincte de Zembo.
        </p>
      </div>

      <div className="mt-3">
        <WorldTabs badge={{ "/world/hellos": pending.length }} />
      </div>

      <div className="mt-4 space-y-2">
        {conns.length === 0 && (
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-7 text-center text-[13px] leading-snug text-white/60">
            Tes connexions mutuelles apparaîtront ici.
            <br />
            Hello mutuel → rencontre 60 secondes → connexion mutuelle.
          </p>
        )}
        {conns.map((c, i) => {
          const preview = conversationPreview(c.id);
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Pressable
                onClick={() => {
                  tap();
                  navigate({ to: "/world/messages/$id", params: { id: c.id } });
                }}
                className="flex w-full items-center gap-3 rounded-2xl border border-gold/22 bg-white/[0.04] px-3 py-3 text-left"
              >
                <img
                  src={photoUrl(c.id, 120)}
                  alt={c.name}
                  className="h-12 w-12 shrink-0 rounded-full border-2 border-gold/70 object-cover"
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="min-w-0 truncate text-[14px] font-bold text-white">
                      {c.name} {c.flag}
                    </span>
                  </span>
                  <span className="mt-0.5 block truncate text-[11.5px] text-white/55">
                    {preview.last}
                  </span>
                </span>
                <span className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-[10px] text-white/40">{preview.time}</span>
                  {preview.unread > 0 ? (
                    <span className="flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-gold-gradient px-1 text-[10px] font-black text-[oklch(0.16_0.02_60)]">
                      {preview.unread}
                    </span>
                  ) : (
                    <MessageCircle size={14} className="text-gold/60" />
                  )}
                </span>
              </Pressable>
            </motion.div>
          );
        })}
      </div>

      {pending.length > 0 && (
        <Pressable
          onClick={() => {
            tap();
            navigate({ to: "/world/hellos" });
          }}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-gold/35 py-3 text-[12px] font-semibold text-white/85"
        >
          <Hand size={14} className="text-gold" /> {pending.length} Hello
          {pending.length > 1 ? "s" : ""} en attente
        </Pressable>
      )}
    </div>
  );
}

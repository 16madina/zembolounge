import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Hand, MessageCircle } from "lucide-react";
import { Pressable } from "@/components/zembo/ui";
import { photoUrl } from "@/components/zembo/PhotoAvatar";
import { connections, pendingHellos } from "@/lib/world-hello";

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
    <div className="min-h-full bg-background px-4 pt-4 pb-[120px]">
      <div className="flex items-center gap-2">
        <Pressable
          onClick={() => {
            tap();
            navigate({ to: "/world/discover" });
          }}
          aria-label="Retour"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/5 text-gold"
        >
          <ChevronLeft size={18} />
        </Pressable>
        <div className="min-w-0">
          <h1 className="text-[19px] leading-none font-black text-white">Mes connexions World</h1>
          <p className="mt-1 text-[11px] text-white/55">
            Débloquées après une connexion mutuelle.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        {conns.length === 0 && (
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-7 text-center text-[13px] leading-snug text-white/60">
            Aucune conversation encore.
            <br />
            Hello mutuel → rencontre 60 secondes → connexion mutuelle.
          </p>
        )}
        {conns.map((c, i) => (
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
                className="h-12 w-12 rounded-full border-2 border-gold/70 object-cover"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-bold text-white">
                  {c.name}, {c.age}
                </span>
                <span className="block truncate text-[11px] text-white/55">
                  {c.flag} {c.city} · Connexion mutuelle
                </span>
              </span>
              <MessageCircle size={17} className="text-gold" />
            </Pressable>
          </motion.div>
        ))}
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

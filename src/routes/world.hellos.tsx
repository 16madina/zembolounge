import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Hand, MessageCircle, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Pressable } from "@/components/zembo/ui";
import { photoUrl } from "@/components/zembo/PhotoAvatar";
import { ignoreHello, pendingHellos, resetHelloDemo, connections } from "@/lib/world-hello";

export const Route = createFileRoute("/world/hellos")({
  head: () => ({
    meta: [
      { title: "Hellos reçus — World Room Zembo" },
      {
        name: "description",
        content: "Les Hellos reçus du monde entier : réponds Hello pour lancer une rencontre de 60 secondes.",
      },
      { property: "og:title", content: "Hellos reçus — World Room Zembo" },
      {
        property: "og:description",
        content: "Un Hello mutuel ouvre une rencontre vidéo de 60 secondes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorldHellos,
});

function WorldHellos() {
  const navigate = useNavigate();
  const [list, setList] = useState(() => pendingHellos());
  const [conns, setConns] = useState(() => connections());

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
          <h1 className="text-[19px] leading-none font-black text-white">Hellos reçus</h1>
          <p className="mt-1 text-[11px] text-white/55">
            Réponds Hello pour débloquer la rencontre de 60 secondes.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {list.length === 0 && (
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-6 text-center text-[13px] text-white/60">
            Aucun Hello en attente pour l'instant.
          </p>
        )}
        {list.map((p, i) => (
          <motion.article
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-3xl border border-gold/25 bg-gradient-to-b from-white/[0.06] to-transparent p-3"
          >
            <div className="flex items-center gap-3">
              <img
                src={photoUrl(p.id, 160)}
                alt={p.name}
                className="h-14 w-14 shrink-0 rounded-full border-2 border-gold/80 object-cover"
              />
              <div className="min-w-0">
                <p className="text-[14px] leading-snug font-bold text-white">
                  👋 {p.name} t'a envoyé un Hello depuis {p.country}
                </p>
                <p className="mt-0.5 truncate text-[11px] text-white/55">
                  {p.flag} {p.city} · {p.age} ans
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Pressable
                onClick={() => {
                  tap();
                  navigate({ to: "/world/hello/$id", params: { id: p.id }, search: { step: "card" } });
                }}
                className="min-w-0 flex-1 rounded-full bg-gold-gradient py-2.5 text-center text-[12px] font-black text-[oklch(0.16_0.02_60)]"
              >
                Voir sa World Card
              </Pressable>
              <Pressable
                onClick={() => {
                  tap();
                  ignoreHello(p.id);
                  setList(pendingHellos());
                  toast("Hello ignoré");
                }}
                className="rounded-full border border-white/15 px-4 py-2.5 text-[12px] font-semibold text-white/70"
              >
                Ignorer
              </Pressable>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="mt-7">
        <h2 className="text-[13px] font-black tracking-wide text-gold/90">Mes connexions World</h2>
        {conns.length === 0 ? (
          <p className="mt-2 text-[12px] text-white/50">
            Aucune connexion pour l'instant. Une conversation s'ouvre seulement après une
            connexion mutuelle.
          </p>
        ) : (
          <div className="mt-2 space-y-2">
            {conns.map((c) => (
              <Pressable
                key={c.id}
                onClick={() => {
                  tap();
                  navigate({ to: "/world/messages/$id", params: { id: c.id } });
                }}
                className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-left"
              >
                <img
                  src={photoUrl(c.id, 120)}
                  alt={c.name}
                  className="h-10 w-10 rounded-full border border-gold/60 object-cover"
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-bold text-white">{c.name}</span>
                  <span className="block truncate text-[11px] text-white/50">
                    {c.flag} {c.city}
                  </span>
                </span>
                <MessageCircle size={16} className="text-gold" />
              </Pressable>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-2">
        <Pressable
          onClick={() => {
            tap();
            navigate({ to: "/world/messages" });
          }}
          className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full border border-gold/35 py-2.5 text-[12px] font-semibold text-white/85"
        >
          <MessageCircle size={14} className="text-gold" /> Messagerie World
        </Pressable>
        <Pressable
          onClick={() => {
            tap();
            resetHelloDemo();
            setList(pendingHellos());
            setConns(connections());
            toast("Démo réinitialisée");
          }}
          aria-label="Réinitialiser la démo"
          className="flex items-center gap-1.5 rounded-full border border-white/12 px-3 py-2.5 text-[11px] text-white/55"
        >
          <RotateCcw size={13} /> Démo
        </Pressable>
      </div>

      <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-[10px] text-white/35">
        <Hand size={11} className="text-gold/70" /> Un Hello ne crée pas de conversation : il faut
        un Hello mutuel.
      </p>
    </div>
  );
}

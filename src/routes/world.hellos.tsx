import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Hand, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Pressable } from "@/components/zembo/ui";
import { photoUrl } from "@/components/zembo/PhotoAvatar";
import {
  cancelSentHello,
  helloAge,
  ignoreHello,
  pendingHellos,
  resetHelloDemo,
  sentHellos,
} from "@/lib/world-hello";

export const Route = createFileRoute("/world/hellos")({
  head: () => ({
    meta: [
      { title: "Hellos reçus et envoyés — World Room Zembo" },
      {
        name: "description",
        content:
          "Tes Hellos World Room : ceux que tu as reçus du monde entier et ceux que tu attends encore.",
      },
      { property: "og:title", content: "Hellos — World Room Zembo" },
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
  const [tab, setTab] = useState<"recus" | "envoyes">("recus");
  const [received, setReceived] = useState(() => pendingHellos());
  const [sent, setSent] = useState(() => sentHellos());

  const tap = () => {
    if (typeof navigator !== "undefined") navigator.vibrate?.(8);
  };

  return (
    <div className="min-h-full bg-background px-4 pt-4 pb-[124px]">
      <div className="min-w-0">
        <h1 className="text-[19px] leading-none font-black text-white">Hellos</h1>
        <p className="mt-1 text-[11px] text-white/55">
          Un Hello ne crée pas de conversation : il faut un Hello mutuel.
        </p>
      </div>


      <div className="mt-3 flex items-stretch gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-1">
        {(
          [
            ["recus", `Reçus${received.length ? ` (${received.length})` : ""}`],
            ["envoyes", `Envoyés${sent.length ? ` (${sent.length})` : ""}`],
          ] as const
        ).map(([id, label]) => (
          <Pressable
            key={id}
            onClick={() => {
              tap();
              setTab(id);
            }}
            className={
              tab === id
                ? "min-w-0 flex-1 rounded-xl bg-gold-gradient py-2 text-center text-[12px] font-black text-[oklch(0.16_0.02_60)]"
                : "min-w-0 flex-1 rounded-xl py-2 text-center text-[12px] font-medium text-white/65"
            }
          >
            <span className="block truncate">{label}</span>
          </Pressable>
        ))}
      </div>

      {tab === "recus" ? (
        <div className="mt-4 space-y-3">
          {received.length === 0 && (
            <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-6 text-center text-[13px] text-white/60">
              Aucun Hello en attente pour l'instant.
            </p>
          )}
          {received.map((p, i) => (
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
                  <p className="text-[13.5px] leading-snug font-bold text-white">
                    👋 {p.name} t'a envoyé un Hello depuis {p.country}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-white/55">
                    {p.flag} {p.city} · {p.age} ans · {helloAge(p.id)}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Pressable
                  onClick={() => {
                    tap();
                    navigate({
                      to: "/world/hello/$id",
                      params: { id: p.id },
                      search: { step: "card" },
                    });
                  }}
                  className="rounded-full border border-gold/35 px-4 py-2.5 text-[12px] font-semibold text-white/85"
                >
                  Voir
                </Pressable>
                <Pressable
                  onClick={() => {
                    tap();
                    navigate({
                      to: "/world/hello/$id",
                      params: { id: p.id },
                      search: { step: "celebration" },
                    });
                  }}
                  className="min-w-0 flex-1 rounded-full bg-gold-gradient py-2.5 text-center text-[12px] font-black text-[oklch(0.16_0.02_60)]"
                >
                  👋 Répondre
                </Pressable>
                <Pressable
                  onClick={() => {
                    tap();
                    ignoreHello(p.id);
                    setReceived(pendingHellos());
                    toast("Hello ignoré");
                  }}
                  className="rounded-full border border-white/15 px-3 py-2.5 text-[12px] text-white/60"
                >
                  Ignorer
                </Pressable>
              </div>
            </motion.article>
          ))}
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {sent.length === 0 && (
            <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-6 text-center text-[13px] text-white/60">
              Tu n'as envoyé aucun Hello pour l'instant.
            </p>
          )}
          {sent.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3"
            >
              <img
                src={photoUrl(p.id, 120)}
                alt={p.name}
                className="h-12 w-12 shrink-0 rounded-full border border-gold/45 object-cover opacity-90"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-bold text-white">
                  {p.name} {p.flag}
                </p>
                <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-white/50">
                  <Clock size={11} className="shrink-0 text-gold/70" /> En attente de sa réponse…
                </p>
              </div>
              <Pressable
                onClick={() => {
                  tap();
                  cancelSentHello(p.id);
                  setSent(sentHellos());
                  toast("Hello annulé");
                }}
                className="shrink-0 rounded-full border border-white/12 px-3 py-2 text-[11px] text-white/55"
              >
                Annuler
              </Pressable>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center justify-center">
        <Pressable
          onClick={() => {
            tap();
            resetHelloDemo();
            setReceived(pendingHellos());
            setSent(sentHellos());
            toast("Démo réinitialisée");
          }}
          aria-label="Réinitialiser la démo"
          className="flex items-center gap-1.5 rounded-full border border-white/12 px-3 py-2 text-[11px] text-white/45"
        >
          <RotateCcw size={12} /> Démo
        </Pressable>
      </div>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[10px] text-white/35">
        <Hand size={11} className="text-gold/70" /> Hello mutuel → rencontre 60 s → connexion
        mutuelle.
      </p>
    </div>
  );
}

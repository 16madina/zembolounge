import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Send } from "lucide-react";
import { Pressable } from "@/components/zembo/ui";
import { photoUrl } from "@/components/zembo/PhotoAvatar";
import { findPerson, isConnected } from "@/lib/world-hello";

export const Route = createFileRoute("/world/messages_/$id")({
  head: () => ({
    meta: [
      { title: "Conversation World Room — Zembo" },
      {
        name: "description",
        content: "Conversation débloquée après une connexion mutuelle World Room.",
      },
      { property: "og:title", content: "Conversation World Room — Zembo" },
      {
        property: "og:description",
        content: "Après le Hello mutuel et la rencontre de 60 secondes, la conversation s'ouvre.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorldThread,
});

type Msg = { id: number; me: boolean; text: string };

function WorldThread() {
  const { id } = useParams({ from: "/world/messages_/$id" });
  const navigate = useNavigate();
  const person = findPerson(id);
  const [unlocked] = useState(() => isConnected(id));
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs.length]);

  if (!person || !unlocked) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-[14px] leading-snug text-white/70">
          Cette conversation n'est pas encore débloquée. Il faut une connexion mutuelle.
        </p>
        <Pressable
          onClick={() => navigate({ to: "/world/messages" })}
          className="rounded-full bg-gold-gradient px-5 py-2.5 text-[13px] font-black text-[oklch(0.16_0.02_60)]"
        >
          Mes connexions World
        </Pressable>
      </div>
    );
  }

  const send = () => {
    const t = draft.trim();
    if (!t) return;
    if (typeof navigator !== "undefined") navigator.vibrate?.(8);
    setMsgs((m) => [...m, { id: Date.now(), me: true, text: t }]);
    setDraft("");
    window.setTimeout(() => {
      setMsgs((m) => [
        ...m,
        { id: Date.now() + 1, me: false, text: "Trop content de ce Hello mutuel 🙌" },
      ]);
    }, 1400);
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <header className="flex items-center gap-2.5 border-b border-white/8 px-3 py-3">
        <Pressable
          onClick={() => navigate({ to: "/world/messages" })}
          aria-label="Retour"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/5 text-gold"
        >
          <ChevronLeft size={18} />
        </Pressable>
        <img
          src={photoUrl(person.id, 120)}
          alt={person.name}
          className="h-10 w-10 rounded-full border border-gold/70 object-cover"
        />
        <div className="min-w-0">
          <p className="truncate text-[14px] font-bold text-white">{person.name}</p>
          <p className="truncate text-[10px] text-gold/80">
            {person.flag} {person.city} · Connexion mutuelle
          </p>
        </div>
      </header>

      <div className="app-scroll flex-1 px-4 py-4">
        <p className="mx-auto max-w-[280px] rounded-2xl border border-gold/22 bg-gold/8 px-3 py-2 text-center text-[11px] leading-snug text-white/75">
          🎉 Vous vous êtes dit Hello, vous vous êtes rencontrés 60 secondes et vous avez choisi de
          vous connecter. À vous de jouer.
        </p>
        <div className="mt-4 space-y-2">
          {msgs.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={m.me ? "flex justify-end" : "flex justify-start"}
            >
              <span
                className={
                  m.me
                    ? "max-w-[75%] rounded-2xl rounded-br-md bg-gold-gradient px-3 py-2 text-[13px] font-medium text-[oklch(0.16_0.02_60)]"
                    : "max-w-[75%] rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.06] px-3 py-2 text-[13px] text-white/90"
                }
              >
                {m.text}
              </span>
            </motion.div>
          ))}
        </div>
        <div ref={endRef} />
      </div>

      <div className="flex items-center gap-2 border-t border-white/8 px-3 py-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Écris un message…"
          className="min-w-0 flex-1 rounded-full border border-white/12 bg-white/[0.05] px-4 py-2.5 text-[13px] text-white placeholder:text-white/35 focus:border-gold/50 focus:outline-none"
        />
        <Pressable
          onClick={send}
          aria-label="Envoyer"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-gradient text-[oklch(0.16_0.02_60)]"
        >
          <Send size={16} />
        </Pressable>
      </div>
    </div>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, MoreVertical, Phone, Send, Smile, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { Pressable } from "@/components/zembo/ui";
import { PhotoAvatar } from "@/components/zembo/PhotoAvatar";
import { conversations, threadMessages } from "@/lib/zembo-data";

export const Route = createFileRoute("/messages_/$id")({
  head: () => ({
    meta: [
      { title: "Conversation — Zembo" },
      {
        name: "description",
        content: "Discussion privée Zembo : continue l'échange après un live ou une table.",
      },
      { property: "og:title", content: "Conversation — Zembo" },
      {
        property: "og:description",
        content: "Échange en direct avec les hôtes et les membres de la communauté Zembo.",
      },
    ],
  }),
  component: Thread,
});

function Thread() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const convo = conversations.find((c) => c.id === id) ?? conversations[0]!;
  const [msgs, setMsgs] = useState(threadMessages);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [msgs.length]);

  function send() {
    const text = draft.trim();
    if (!text) return;
    const time = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    setMsgs((m) => [...m, { id: `me-${m.length + 1}`, mine: true, text, time }]);
    setDraft("");
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex shrink-0 items-center gap-3 border-b border-border/50 bg-background/90 px-3 pt-[max(env(safe-area-inset-top),12px)] pb-3 backdrop-blur-xl">
        <Pressable aria-label="Retour" onClick={() => navigate({ to: "/messages" })}>
          <ChevronLeft size={24} className="text-white" />
        </Pressable>
        <PhotoAvatar name={convo.name} size={36} status="online" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-bold text-white">{convo.name}</p>
          <p className="text-[12px] text-emerald">En ligne</p>
        </div>
        <div className="flex items-center gap-3.5 pr-1">
          <Pressable aria-label="Appel audio">
            <Phone size={18} className="text-white" />
          </Pressable>
          <Pressable aria-label="Appel vidéo">
            <Video size={19} className="text-white" />
          </Pressable>
          <Pressable aria-label="Plus d'options">
            <MoreVertical size={19} className="text-white" />
          </Pressable>
        </div>
      </header>

      <div className="app-scroll min-h-0 flex-1 space-y-3 px-4 py-4">
        {msgs.map((m) => (
          <div key={m.id} className={cn("flex flex-col", m.mine ? "items-end" : "items-start")}>
            <div
              className={cn(
                "max-w-[78%] px-3.5 py-2.5 text-[14px] leading-snug",
                m.mine
                  ? "bg-gold-gradient rounded-[18px] rounded-br-[6px] text-[oklch(0.16_0.02_60)]"
                  : "rounded-[18px] rounded-bl-[6px] bg-[oklch(0.155_0_0)] text-white",
              )}
            >
              {m.text}
            </div>
            <span className="mt-1 px-1 text-[10.5px] text-muted-foreground">{m.time}</span>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="shrink-0 border-t border-border/50 bg-background/95 px-3 pt-2.5 pb-[max(env(safe-area-inset-bottom),12px)] backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-border bg-[oklch(0.145_0.006_60)] px-4 py-2.5">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
              placeholder="Écris ton message…"
              className="min-w-0 flex-1 bg-transparent text-[14px] text-white outline-none placeholder:text-muted-foreground"
            />
            <Smile size={18} className="shrink-0 text-muted-foreground" />
          </div>
          <Pressable
            aria-label="Envoyer"
            onClick={send}
            className="bg-gold-gradient flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
          >
            <Send size={18} className="text-[oklch(0.16_0.02_60)]" />
          </Pressable>
        </div>
      </div>
    </div>
  );
}

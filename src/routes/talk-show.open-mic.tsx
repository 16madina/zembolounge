import { createFileRoute } from "@tanstack/react-router";
import { MicVocal } from "lucide-react";
import { ComingSoon } from "@/components/zembo/ComingSoon";

export const Route = createFileRoute("/talk-show/open-mic")({
  head: () => ({
    meta: [
      { title: "Open Mic — Bientôt — Zembo" },
      {
        name: "description",
        content: "Open Mic Zembo : masterclass, concept, coachings en direct. Bientôt disponible.",
      },
      { property: "og:title", content: "Open Mic — Zembo" },
      { property: "og:description", content: "Anime, partage, échange en direct. Bientôt disponible." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <ComingSoon
      title="Open Mic"
      accent="oklch(0.68 0.16 158)"
      icon={<MicVocal size={56} className="text-gold" strokeWidth={1.6} />}
    />
  ),
});

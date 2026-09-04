import { createFileRoute } from "@tanstack/react-router";
import { Mic } from "lucide-react";
import { ComingSoon } from "@/components/zembo/ComingSoon";

export const Route = createFileRoute("/talk-show/slam")({
  head: () => ({
    meta: [
      { title: "Slam — Bientôt — Zembo" },
      {
        name: "description",
        content: "Slam Zembo : déclame ta poésie ou ton texte en direct. Bientôt disponible.",
      },
      { property: "og:title", content: "Slam — Zembo" },
      { property: "og:description", content: "Tes mots. Ta voix. Ta scène. Bientôt disponible." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <ComingSoon
      title="Slam"
      accent="oklch(0.6 0.22 350)"
      icon={<Mic size={56} className="text-gold" strokeWidth={1.6} />}
    />
  ),
});

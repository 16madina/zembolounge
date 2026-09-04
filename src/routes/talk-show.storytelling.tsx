import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { ComingSoon } from "@/components/zembo/ComingSoon";

export const Route = createFileRoute("/talk-show/storytelling")({
  head: () => ({
    meta: [
      { title: "Storytelling — Bientôt — Zembo" },
      {
        name: "description",
        content: "Storytelling Zembo : raconte ton histoire en direct. Bientôt disponible.",
      },
      { property: "og:title", content: "Storytelling — Zembo" },
      { property: "og:description", content: "Raconte ton histoire en direct. Bientôt disponible." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <ComingSoon
      title="Storytelling"
      accent="oklch(0.62 0.24 300)"
      icon={<BookOpen size={56} className="text-gold" strokeWidth={1.6} />}
    />
  ),
});

import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { ComingSoon } from "@/components/zembo/ComingSoon";

export const Route = createFileRoute("/talk-show/stand")({
  head: () => ({
    meta: [
      { title: "Stand — Bientôt — Zembo" },
      {
        name: "description",
        content: "Stand Zembo : monte sur scène et parle de ce que tu veux. Bientôt disponible.",
      },
      { property: "og:title", content: "Stand — Zembo" },
      { property: "og:description", content: "Le micro t'appartient. Bientôt disponible." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <ComingSoon
      title="Stand"
      accent="oklch(0.82 0.13 85)"
      icon={<Users size={56} className="text-gold" strokeWidth={1.6} />}
    />
  ),
});

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { TalkShowPreviewScreen } from "@/components/zembo/TalkShowPreview";
import { isFormatId } from "@/lib/talk-show-config";

export const Route = createFileRoute("/talk-show/preview/$format")({
  head: () => ({
    meta: [
      { title: "Aperçu avant le direct — Talk Show — Zembo" },
      {
        name: "description",
        content:
          "Vérifie le titre, la couverture et les réglages de ton Talk Show, puis lance ton live Zembo.",
      },
      { property: "og:title", content: "Aperçu avant le direct — Talk Show — Zembo" },
      {
        property: "og:description",
        content: "Dernière vérification avant de passer en direct sur Zembo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PreviewRoute,
});

function PreviewRoute() {
  const { format } = Route.useParams();
  const navigate = useNavigate();
  const valid = isFormatId(format);

  useEffect(() => {
    if (!valid) navigate({ to: "/talk-show" });
  }, [valid, navigate]);

  if (!valid) return null;
  return <TalkShowPreviewScreen format={format} />;
}

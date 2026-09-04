import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { TalkShowConfigScreen } from "@/components/zembo/TalkShowConfig";
import { FORMAT_META, isFormatId } from "@/lib/talk-show-config";

export const Route = createFileRoute("/talk-show/config/$format")({
  head: () => ({
    meta: [
      { title: "Configurer ton live — Talk Show — Zembo" },
      {
        name: "description",
        content:
          "Titre, couverture, visibilité, accès et commentaires : configure ton Talk Show avant de passer en direct sur Zembo.",
      },
      { property: "og:title", content: "Configurer ton live — Talk Show — Zembo" },
      {
        property: "og:description",
        content: "Prépare ton live Zembo en deux étapes : configuration puis aperçu.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConfigRoute,
});

function ConfigRoute() {
  const { format } = Route.useParams();
  const navigate = useNavigate();
  const valid = isFormatId(format);

  useEffect(() => {
    if (!valid) navigate({ to: "/talk-show" });
  }, [valid, navigate]);

  if (!valid) return null;
  void FORMAT_META[format];
  return <TalkShowConfigScreen format={format} />;
}

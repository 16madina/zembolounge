import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Globe, Heart, Users } from "lucide-react";
import worldRoomImg from "@/assets/world-room-official.png.asset.json";
import { Pressable } from "@/components/zembo/ui";

export const Route = createFileRoute("/world/intro")({
  head: () => ({
    meta: [
      { title: "World Room — Zembo" },
      {
        name: "description",
        content:
          "World Room : fais de nouvelles rencontres aux quatre coins du monde, des échanges authentiques et bienveillants.",
      },
      { property: "og:title", content: "World Room — Zembo" },
      {
        property: "og:description",
        content: "Le monde est à un Hello. Crée ton profil World Room.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorldIntro,
});

// 5 avatars positionnés en cercle autour du globe (angles en degrés, -90 = haut)
const RING = [
  { seed: "amara", angle: -90 },
  { seed: "kenji", angle: -18 },
  { seed: "sofia", angle: 54 },
  { seed: "yacine", angle: 126 },
  { seed: "lina", angle: 198 },
];

const ARGS = [
  {
    icon: <Globe size={20} className="text-gold" />,
    title: "Fais de nouvelles rencontres",
    sub: "aux quatre coins du monde",
  },
  {
    icon: <Heart size={20} className="text-gold" fill="currentColor" />,
    title: "Des échanges authentiques",
    sub: "et bienveillants",
  },
  {
    icon: <Users size={20} className="text-gold" />,
    title: "Amitié, discussion ou plus…",
    sub: "C'est toi qui choisis",
  },
];

function WorldIntro() {
  const navigate = useNavigate();

  return (
    <div className="app-scroll no-scrollbar relative h-[100dvh] overflow-hidden bg-[oklch(0.06_0.01_50)]">
      {/* Halo chaleureux en fond */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 70% at 50% 32%, oklch(0.22 0.05 75 / 55%), transparent 60%), radial-gradient(90% 50% at 50% 100%, oklch(0.5 0.06 60 / 22%), transparent 70%)",
        }}
      />

      <div className="relative flex min-h-[100dvh] flex-col px-5 pt-[max(env(safe-area-inset-top),14px)]">
        {/* Retour */}
        <Pressable
          onClick={() => navigate({ to: "/" })}
          aria-label="Retour"
          className="-ml-1 self-start rounded-full p-1"
        >
          <span className="text-[26px] leading-none text-gold">‹</span>
        </Pressable>

        {/* Logo-titre */}
        <div className="mt-2 text-center">
          <h1
            className="text-gold-gradient font-extrabold leading-none tracking-[0.18em]"
            style={{ fontSize: 30 }}
          >
            W
            <span
              className="relative mx-[1px] inline-flex items-center justify-center rounded-full align-middle bg-gold-gradient"
              style={{ width: 22, height: 22 }}
            >
              <Globe size={15} className="text-[oklch(0.16_0.02_60)]" />
            </span>
            RLD
          </h1>
          <h1
            className="text-gold-gradient font-extrabold leading-none tracking-[0.18em]"
            style={{ fontSize: 30 }}
          >
            ROOM
          </h1>
          <p className="mt-3 text-[14px] font-medium text-foreground/90">
            Le monde est à un <span className="text-gold">Hello.</span>
          </p>
        </div>

        {/* Visuel central : globe + avatars (image officielle) */}
        <div className="relative mx-auto mt-4 flex justify-center" style={{ width: 260, height: 340 }}>
          {/* glow */}
          <div
            className="pointer-events-none absolute inset-0 rounded-full blur-2xl"
            style={{
              background:
                "radial-gradient(circle, oklch(0.78 0.13 82 / 40%), transparent 68%)",
            }}
          />
          <img
            src={worldRoomImg.url}
            alt="Globe terrestre avec avatars — World Room"
            className="relative z-10 h-full w-full rounded-[24px] object-cover"
            style={{ filter: "drop-shadow(0 8px 30px oklch(0.82 0.13 85 / 28%))" }}
          />
        </div>

        {/* 3 arguments */}
        <div className="mt-6 flex flex-col gap-3.5">
          {ARGS.map((arg) => (
            <div key={arg.title} className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/8">
                {arg.icon}
              </span>
              <div className="min-w-0">
                <p className="text-[13.5px] font-semibold leading-tight text-foreground">
                  {arg.title}
                </p>
                <p className="text-[12.5px] leading-tight text-muted-foreground">{arg.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bouton principal */}
        <Pressable
          onClick={() => navigate({ to: "/world/onboarding/1" })}
          className="glow-gold mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-gold-gradient py-3.5 text-[15px] font-bold text-[oklch(0.16_0.02_60)]"
        >
          Créer mon profil <span className="text-[17px] leading-none">›</span>
        </Pressable>

        {/* Déjà inscrit */}
        <div className="mt-4 mb-6 text-center text-[13px]">
          <span className="text-muted-foreground">Déjà inscrit ? </span>
          <Pressable
            onClick={() => navigate({ to: "/world/login" })}
            className="font-semibold text-gold underline-offset-2"
          >
            Se connecter
          </Pressable>
        </div>
      </div>
    </div>
  );
}

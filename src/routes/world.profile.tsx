import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  Globe2,
  Hand,
  Languages,
  LogOut,
  MapPin,
  Pencil,
  Sparkles,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Pressable } from "@/components/zembo/ui";
import { photoUrl } from "@/components/zembo/PhotoAvatar";
import { connections, pendingHellos } from "@/lib/world-hello";
import { deleteWorldProfile, fetchWorldProfile } from "@/lib/world-profile-db";
import { useZemboAuth } from "@/lib/use-zembo-auth";
import {
  EMPTY_WORLD_PROFILE,
  ageNumber,
  intentionLabels,
  loadWorldProfile,
  resetWorldProfile,
  type WorldProfileDraft,
} from "@/lib/world-profile";

export const Route = createFileRoute("/world/profile")({
  head: () => ({
    meta: [
      { title: "Mon profil World Room — Zembo" },
      {
        name: "description",
        content:
          "Aperçu de ta World Card, tes photos, tes connexions et les réglages de ton profil World Room.",
      },
      { property: "og:title", content: "Mon profil World Room — Zembo" },
      {
        property: "og:description",
        content: "Ton profil de découverte World Room, lié à ton compte Zembo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorldProfile,
});

const HELLO_RULES = ["Tout le monde", "Selon mes critères"] as const;
const VISIBILITY = ["Visible", "En pause"] as const;

function WorldProfile() {
  const navigate = useNavigate();
  const { user } = useZemboAuth();
  const [draft, setDraft] = useState<WorldProfileDraft>(EMPTY_WORLD_PROFILE);
  const [conns, setConns] = useState<ReturnType<typeof connections>>([]);
  const [pending, setPending] = useState(0);
  const [helloRule, setHelloRule] = useState<(typeof HELLO_RULES)[number]>("Tout le monde");
  const [visibility, setVisibility] = useState<(typeof VISIBILITY)[number]>("Visible");

  useEffect(() => {
    setDraft(loadWorldProfile());
    setConns(connections());
    setPending(pendingHellos().length);
  }, []);

  // Source de vérité : la base (le profil survit à un rechargement).
  useEffect(() => {
    if (!user) return;
    let active = true;
    fetchWorldProfile(user.id).then((p) => {
      if (active && p) setDraft(p);
    });
    return () => {
      active = false;
    };
  }, [user]);

  const tap = () => {
    if (typeof navigator !== "undefined") navigator.vibrate?.(8);
  };

  const age = ageNumber(draft.age);
  const labels = intentionLabels(draft.intentions);
  const main = draft.photos[0];
  const answers = [
    { q: "🌤 Mon dimanche parfait", a: draft.answerSunday },
    { q: "🚩 Mon red flag", a: draft.answerRedFlag },
    { q: "✈️ Mon évasion rêvée", a: draft.answerEscape },
  ].filter((x) => x.a.trim().length > 0);

  return (
    <div className="min-h-full bg-background px-4 pt-4 pb-[124px]">
      <div className="min-w-0">
        <h1 className="text-[19px] leading-none font-black text-white">Mon profil World</h1>
        <p className="mt-1 text-[11px] text-white/55">Voici ce que les autres voient de toi.</p>
      </div>


      {/* Aperçu World Card */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-b from-white/[0.07] to-transparent"
      >
        <div className="relative h-[210px] w-full">
          {main ? (
            <div className="h-full w-full" style={{ background: main }} />
          ) : (
            <img
              src={photoUrl("deena-world", 480)}
              alt="Ma photo principale World Room"
              className="h-full w-full object-cover"
            />
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-3.5">
            <p className="truncate text-[18px] leading-none font-black text-white">
              {draft.username ? `@${draft.username}` : "@ton_pseudo"}
              {draft.showAge && age !== null ? `, ${age}` : ""}
            </p>
            <p className="mt-1.5 flex items-center gap-1 truncate text-[11.5px] text-white/75">
              <MapPin size={11} className="shrink-0 text-gold" />
              {[draft.city, draft.country].filter(Boolean).join(", ") || "Ta ville"}
            </p>
            {labels.length > 0 && (
              <span className="mt-2 inline-flex max-w-full items-center gap-1 truncate rounded-full border border-gold/45 bg-black/50 px-2.5 py-1 text-[10.5px] font-bold text-gold backdrop-blur-md">
                <Sparkles size={10} className="shrink-0" /> {labels[0]}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3 p-3.5">
          <p className="text-[12.5px] leading-snug text-white/80 italic">
            « {draft.bio || "Ajoute une petite phrase qui te ressemble." } »
          </p>

          {draft.languages.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {draft.languages.map((l) => (
                <span
                  key={l}
                  className="rounded-full border border-white/12 bg-white/[0.05] px-2.5 py-1 text-[10.5px] text-white/75"
                >
                  {l}
                </span>
              ))}
            </div>
          )}

          {answers.length > 0 && (
            <div className="space-y-2">
              {answers.map((x) => (
                <div
                  key={x.q}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2.5"
                >
                  <p className="text-[10.5px] font-bold tracking-wide text-gold/85">{x.q}</p>
                  <p className="mt-1 text-[12.5px] leading-snug text-white/85">{x.a}</p>
                </div>
              ))}
            </div>
          )}

          <Pressable
            onClick={() => {
              tap();
              navigate({ to: "/world/onboarding/1" });
            }}
            className="flex w-full items-center justify-center gap-1.5 rounded-full bg-gold-gradient py-2.5 text-[12.5px] font-black text-[oklch(0.16_0.02_60)]"
          >
            <Pencil size={13} /> Éditer mon profil World
          </Pressable>
        </div>
      </motion.section>

      {/* Mes photos */}
      <section className="mt-5">
        <h2 className="text-[13px] font-black tracking-wide text-gold/90">Mes photos</h2>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {draft.photos.length === 0 && (
            <p className="col-span-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-5 text-center text-[12px] text-white/55">
              Aucune photo pour l'instant.
            </p>
          )}
          {draft.photos.map((p, i) => (
            <span
              key={`${p}-${i}`}
              className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-2xl border border-gold/20"
              style={{ background: p }}
            >
              {i === 0 && (
                <span className="rounded-full bg-black/55 px-2 py-0.5 text-[9px] font-bold text-gold">
                  Principale
                </span>
              )}
            </span>
          ))}
          {draft.photos.length > 0 && draft.photos.length < 6 && (
            <Pressable
              onClick={() => {
                tap();
                navigate({ to: "/world/onboarding/2" });
              }}
              className="flex aspect-[3/4] flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-white/18 text-white/50"
            >
              <User size={16} className="text-gold/70" />
              <span className="text-[10px]">Ajouter</span>
            </Pressable>
          )}
        </div>
      </section>

      {/* Mes connexions */}
      <section className="mt-5">
        <h2 className="text-[13px] font-black tracking-wide text-gold/90">Mes connexions</h2>
        {conns.length === 0 ? (
          <p className="mt-2 text-[12px] text-white/50">
            Aucune connexion mutuelle pour l'instant.
          </p>
        ) : (
          <Pressable
            onClick={() => {
              tap();
              navigate({ to: "/world/messages" });
            }}
            className="mt-2 flex w-full items-center gap-2 rounded-2xl border border-gold/22 bg-white/[0.04] px-3 py-3 text-left"
          >
            <span className="flex min-w-0 flex-1 items-center">
              {conns.slice(0, 6).map((c, i) => (
                <img
                  key={c.id}
                  src={photoUrl(c.id, 96)}
                  alt={c.name}
                  className="h-9 w-9 shrink-0 rounded-full border-2 border-gold/60 object-cover"
                  style={{ marginLeft: i === 0 ? 0 : -10 }}
                />
              ))}
              <span className="ml-2 min-w-0 truncate text-[12px] text-white/70">
                {conns.length} connexion{conns.length > 1 ? "s" : ""} World
              </span>
            </span>
            <Globe2 size={15} className="shrink-0 text-gold" />
          </Pressable>
        )}
      </section>

      {/* Réglages World Room */}
      <section className="mt-5 space-y-2.5">
        <h2 className="text-[13px] font-black tracking-wide text-gold/90">Réglages World Room</h2>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3">
          <p className="flex items-center gap-1.5 text-[12px] font-bold text-white">
            <Hand size={12} className="text-gold" /> Qui peut m'envoyer un Hello
          </p>
          <div className="mt-2 flex items-stretch gap-1 rounded-xl bg-black/35 p-1">
            {HELLO_RULES.map((r) => (
              <Pressable
                key={r}
                onClick={() => {
                  tap();
                  setHelloRule(r);
                  toast(`Hellos : ${r.toLowerCase()}`);
                }}
                className={
                  helloRule === r
                    ? "min-w-0 flex-1 rounded-lg bg-gold-gradient py-1.5 text-center text-[11px] font-black text-[oklch(0.16_0.02_60)]"
                    : "min-w-0 flex-1 rounded-lg py-1.5 text-center text-[11px] text-white/60"
                }
              >
                <span className="block truncate">{r}</span>
              </Pressable>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3">
          <p className="flex items-center gap-1.5 text-[12px] font-bold text-white">
            <Eye size={12} className="text-gold" /> Visibilité de mon profil
          </p>
          <div className="mt-2 flex items-stretch gap-1 rounded-xl bg-black/35 p-1">
            {VISIBILITY.map((v) => (
              <Pressable
                key={v}
                onClick={() => {
                  tap();
                  setVisibility(v);
                  toast(v === "Visible" ? "Profil visible" : "Profil en pause");
                }}
                className={
                  visibility === v
                    ? "min-w-0 flex-1 rounded-lg bg-gold-gradient py-1.5 text-center text-[11px] font-black text-[oklch(0.16_0.02_60)]"
                    : "min-w-0 flex-1 rounded-lg py-1.5 text-center text-[11px] text-white/60"
                }
              >
                <span className="block truncate">{v}</span>
              </Pressable>
            ))}
          </div>
        </div>

        <Pressable
          onClick={() => {
            tap();
            navigate({ to: "/world/onboarding/5" });
          }}
          className="flex w-full items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 text-left"
        >
          <Languages size={14} className="shrink-0 text-gold" />
          <span className="min-w-0 flex-1">
            <span className="block text-[12px] font-bold text-white">Langues</span>
            <span className="block truncate text-[11px] text-white/55">
              {draft.languages.join(" · ") || "Aucune langue choisie"}
            </span>
          </span>
        </Pressable>

        <Pressable
          onClick={() => {
            tap();
            resetWorldProfile();
            if (user) void deleteWorldProfile(user.id);
            toast("Profil World Room désactivé");
            navigate({ to: "/world/intro" });
          }}
          className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-white/12 py-3 text-[12px] font-semibold text-white/60"
        >
          <LogOut size={13} /> Quitter World Room
        </Pressable>
      </section>

      <p className="mt-5 text-center text-[10px] leading-snug text-white/35">
        Ton profil World Room est lié à ton compte Zembo.
      </p>
    </div>
  );
}

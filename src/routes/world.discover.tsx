import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Globe2,
  Heart,
  MapPin,
  MessageCircle,
  Plane,
  Play,
  Settings2,
} from "lucide-react";
import { toast } from "sonner";
import { BottomSheet } from "@/components/zembo/Sheet";
import { Pressable } from "@/components/zembo/ui";
import { photoUrl } from "@/components/zembo/PhotoAvatar";
import { cn } from "@/lib/utils";
import decor from "@/assets/world-room-elena.png";
import { resetWorldProfile, loadWorldProfile } from "@/lib/world-profile";
import { WorldHelloMatch, type HelloMatchPerson } from "@/components/zembo/WorldHelloMatch";

export const Route = createFileRoute("/world/discover")({
  head: () => ({
    meta: [
      { title: "Découverte World Room — Zembo" },
      {
        name: "description",
        content:
          "Voyage de profil en profil à travers le monde : World Cards, réponses de personnalité et Hello.",
      },
      { property: "og:title", content: "Découverte World Room — Zembo" },
      {
        property: "og:description",
        content: "Le monde est à un Hello. Découvre une personne à la fois.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorldDiscover,
});

type WorldCard = {
  id: string;
  name: string;
  age: number;
  flag: string;
  city: string;
  country: string;
  distanceKm: string;
  intent: string;
  quote: string;
  interests: string[];
  sunday: string;
  redFlag: string;
  travel: string;
  photo?: string;
};

const POOL: WorldCard[] = [
  {
    id: "elena",
    name: "Elena",
    age: 27,
    flag: "🇬🇷",
    city: "Santorin",
    country: "Grèce",
    distanceKm: "7 523",
    intent: "💜 Rencontre sérieuse",
    quote: "Bonne énergie, belles discussions et grands projets.",
    interests: ["✈️ Voyage", "🍴 Cuisine", "🏋 Fitness", "📷 Photographie", "🧭 Découverte"],
    sunday: "Plage, bon repas et coucher de soleil",
    redFlag: "Le manque de communication",
    travel: "Le Japon",
    photo: decor,
  },
  {
    id: "moussa",
    name: "Moussa",
    age: 34,
    flag: "🇨🇮",
    city: "Abidjan",
    country: "Côte d'Ivoire",
    distanceKm: "8 140",
    intent: "👥 Amitié",
    quote: "Je crois aux vraies conversations, pas aux petits jeux.",
    interests: ["🎧 Musique", "⚽ Foot", "🍽 Maquis", "🧑‍💻 Tech", "🌍 Voyage"],
    sunday: "Plage + musique jusqu'au coucher du soleil",
    redFlag: "Le mensonge, même petit",
    travel: "Zanzibar, sans hésiter",
  },
  {
    id: "chloe",
    name: "Chloé",
    age: 28,
    flag: "🇫🇷",
    city: "Paris",
    country: "France",
    distanceKm: "5 512",
    intent: "💬 Discussion",
    quote: "Curieuse de tout, surtout des gens.",
    interests: ["📚 Lecture", "🎬 Cinéma", "☕ Cafés", "🚲 Vélo", "🖼 Expos"],
    sunday: "Brunch tardif et marché aux livres",
    redFlag: "Ceux qui n'écoutent jamais",
    travel: "Un train de nuit vers Lisbonne",
  },
  {
    id: "awa",
    name: "Awa",
    age: 26,
    flag: "🇸🇳",
    city: "Dakar",
    country: "Sénégal",
    distanceKm: "6 380",
    intent: "❤️ Rencontre sérieuse",
    quote: "La douceur, l'humour et la famille avant tout.",
    interests: ["🌊 Océan", "🍲 Cuisine", "💃 Danse", "🎨 Art", "🧭 Découverte"],
    sunday: "Thiéboudienne en famille puis Corniche",
    redFlag: "Le manque de respect envers sa mère",
    travel: "Bali, pour apprendre à surfer",
  },
  {
    id: "kenji",
    name: "Kenji",
    age: 30,
    flag: "🇯🇵",
    city: "Tokyo",
    country: "Japon",
    distanceKm: "10 402",
    intent: "♾ Peu importe",
    quote: "Un bon ramen et une longue marche, ça suffit à mon bonheur.",
    interests: ["🍜 Ramen", "📷 Photographie", "🎮 Jeux", "🚉 Trains", "🏯 Histoire"],
    sunday: "Café de quartier puis vélo au bord de la rivière",
    redFlag: "L'impatience",
    travel: "La Patagonie",
  },
];

/** Mock : ces profils répondent Hello en retour (Hello mutuel). */
const MUTUAL_IDS = ["elena", "moussa", "awa"];

function CountryPill({ card }: { card: WorldCard }) {
  return (
    <div className="space-y-1.5">
      <span className="inline-flex max-w-full flex-col rounded-2xl border border-gold/25 bg-black/60 px-3 py-1.5 backdrop-blur-md">
        <span className="flex items-center gap-1.5 text-[12px] font-semibold text-white/90">
          <span>{card.flag}</span>
          <span className="truncate">
            {card.city}, {card.country}
          </span>
        </span>
        <span className="text-[10px] font-medium text-white/60">
          📍 À {card.distanceKm} km de toi
        </span>
      </span>
      <span className="flex w-fit items-center gap-1.5 rounded-full border border-emerald/40 bg-emerald/15 px-2.5 py-1 text-[11px] font-semibold text-emerald">
        🟢 En ligne maintenant
      </span>
    </div>

  );
}

function AnswerCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="min-w-0 flex-1 rounded-2xl border border-white/12 bg-black/55 px-2 py-2 backdrop-blur-md">
      <p className="text-[10px] leading-tight font-semibold text-gold/85">
        {icon} {label}
      </p>
      <p className="mt-1 text-[10px] leading-snug text-white/85">{value}</p>
    </div>
  );
}

function ActionButton({
  onClick,
  label,
  hint,
  children,
  className,
  emphasis,
}: {
  onClick: () => void;
  label: string;
  hint: string;
  children: React.ReactNode;
  className?: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
      <Pressable
        onClick={onClick}
        aria-label={label}
        className={cn(
          "flex items-center justify-center rounded-full",
          emphasis ? "h-16 w-16" : "h-14 w-14",
          className,
        )}
      >
        {children}
      </Pressable>
      <span className="text-[11px] font-bold text-white/90">{label}</span>
      <span className="text-[9px] leading-tight text-white/50">{hint}</span>
    </div>
  );
}

function WorldDiscover() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [gender, setGender] = useState("Tous");
  const [zone, setZone] = useState("Monde entier");
  const [lang, setLang] = useState("FR");
  const [intent, setIntent] = useState("Peu importe");
  const [ageRange, setAgeRange] = useState("25–35");
  const lockRef = useRef(0);
  const [match, setMatch] = useState<WorldCard | null>(null);

  const me: HelloMatchPerson = useMemo(() => {
    const p = loadWorldProfile();
    return {
      name: p.username || "Toi",
      age: Number(p.age) || 27,
      flag: "🌍",
      city: p.city || "Ta ville",
      country: p.country || "",
      photo: p.photos?.[0] || photoUrl("me", 320),
    };
  }, []);

  const card = useMemo(() => POOL[index % POOL.length]!, [index]);

  const tap = () => {
    if (typeof navigator !== "undefined") navigator.vibrate?.(8);
  };

  const next = useCallback(() => {
    setIndex((i) => i + 1);
  }, []);

  const prev = useCallback(() => {
    setIndex((i) => (i > 0 ? i - 1 : i));
  }, []);

  const onWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lockRef.current < 550 || Math.abs(e.deltaY) < 12) return;
    lockRef.current = now;
    if (e.deltaY > 0) next();
    else prev();
  };

  return (
    <div
      className="relative h-full overflow-hidden bg-[oklch(0.05_0.01_50)] select-none"
      onWheel={onWheel}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={card.id + index}
          initial={{ y: "18%", opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: "-16%", opacity: 0, scale: 0.985 }}
          transition={{ duration: 0.46, ease: [0.32, 0.72, 0, 1] }}
          drag="y"
          dragElastic={0.18}
          dragConstraints={{ top: 0, bottom: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.y < -90 || info.velocity.y < -600) {
              tap();
              next();
            } else if (info.offset.y > 110 || info.velocity.y > 700) {
              tap();
              prev();
            }
          }}
          className="absolute inset-0"
        >
          {/* Décor plein écran */}
          <img
            src={card.photo ?? photoUrl(card.id, 900)}
            alt={`${card.name}, ${card.city}`}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[22%] bg-gradient-to-b from-black/85 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-black via-black/70 to-transparent" />

          {/* Bandeau pays */}
          <div className="absolute top-[13%] left-[4%] w-[60%]">
            <CountryPill card={card} />
          </div>

          {/* Vignette vidéo */}
          <div className="absolute top-[14.5%] right-[4%] flex w-[26%] flex-col items-center gap-1">
            <Pressable
              onClick={() => {
                tap();
                toast("Bientôt : vidéo de profil");
              }}
              aria-label="Voir sa vidéo de profil"
              className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-gold/80"
            >
              <img
                src={photoUrl(card.id, 160)}
                alt=""
                className="h-full w-full object-cover"
                draggable={false}
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/35">
                <Play size={16} className="text-gold" />
              </span>
            </Pressable>
            <span className="text-center text-[9px] leading-tight text-white/70">
              Voir sa vidéo de profil
            </span>
          </div>

          {/* Points de progression */}
          <div className="absolute top-[31%] right-[3%] flex flex-col items-center gap-1.5">
            {POOL.map((p, i) => (
              <span
                key={p.id}
                className={cn(
                  "rounded-full transition-all",
                  i === index % POOL.length
                    ? "h-4 w-1.5 bg-gold-gradient"
                    : "h-1.5 w-1.5 bg-white/30",
                )}
              />
            ))}
          </div>

          {/* Mini-carte du monde */}
          <div className="absolute top-[44%] right-[4%] w-[31%] rounded-2xl border border-gold/25 bg-black/45 p-2 backdrop-blur-md">
            <div className="relative h-9 overflow-hidden rounded-lg bg-[oklch(0.14_0.02_60)]">
              <div
                className="absolute inset-0 opacity-70"
                style={{
                  backgroundImage:
                    "radial-gradient(oklch(0.82 0.13 85 / 60%) 1px, transparent 1.3px)",
                  backgroundSize: "7px 7px",
                }}
              />
              <Plane size={13} className="absolute top-2 left-1/2 -translate-x-1/2 text-gold" />
            </div>
            <p className="mt-1 text-[8px] leading-tight text-white/60">
              « Des gens incroyables aux quatre coins du monde. »
            </p>
          </div>

          {/* Infos profil */}
          <div className="absolute bottom-[31.5%] left-[4%] w-[92%] space-y-1.5">
            <div className="flex items-center gap-1.5">
              <h2 className="text-[27px] leading-none font-black text-white">
                {card.name}, {card.age}
              </h2>
              <BadgeCheck size={18} className="text-[oklch(0.72_0.14_240)]" />
            </div>
            <p className="flex items-center gap-1 text-[12px] text-white/70">
              <MapPin size={12} className="text-gold" />
              {card.city}, {card.country}
            </p>
            <span className="inline-flex items-center rounded-full border border-gold/30 bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white/90 backdrop-blur-md">
              {card.intent}
            </span>
            <p className="text-[12px] leading-snug text-white/75 italic">
              « {card.quote} »
            </p>
            <div className="flex flex-wrap gap-1.5">
              {card.interests.map((it) => (
                <span
                  key={it}
                  className="rounded-full border border-gold/35 bg-black/40 px-2 py-0.5 text-[10px] text-white/85"
                >
                  {it}
                </span>
              ))}
            </div>
          </div>

          {/* 3 réponses World Card */}
          <div className="absolute bottom-[23%] left-[4%] flex w-[92%] items-stretch gap-1.5">
            <AnswerCard icon="✈️" label="Mon dimanche parfait ?" value={card.sunday} />
            <AnswerCard icon="🧡" label="Mon plus gros red flag ?" value={card.redFlag} />
            <AnswerCard icon="🌐" label="Si je pouvais partir demain ?" value={card.travel} />
          </div>

          {/* Actions */}
          <div className="absolute bottom-[10.5%] left-[6%] flex w-[88%] items-start justify-between gap-2">
            <ActionButton
              onClick={() => {
                tap();
                next();
              }}
              label="Passer"
              hint="Au prochain profil"
              className="border border-white/15 bg-black/60 text-gold backdrop-blur-md"
            >
              <ArrowRight size={22} />
            </ActionButton>
            <ActionButton
              emphasis
              onClick={() => {
                tap();
                if (MUTUAL_IDS.includes(card.id)) {
                  setMatch(card);
                } else {
                  toast.success(`👋 Hello envoyé à ${card.name}`);
                  next();
                }
              }}
              label="Dire Hello"
              hint="Lance la conversation"
              className="bg-gold-gradient text-[oklch(0.16_0.02_60)] shadow-[0_10px_30px_-8px_oklch(0.82_0.13_85/60%)]"
            >
              <MessageCircle size={24} />
            </ActionButton>
            <ActionButton
              onClick={() => {
                tap();
                toast.success("✨ Demande de connexion envoyée");
                next();
              }}
              label="Connecter"
              hint="Si le feeling est là"
              className="bg-gradient-to-br from-[oklch(0.55_0.18_300)] to-[oklch(0.82_0.13_85)] text-white"
            >
              <span className="flex items-center gap-0.5">
                <span className="text-[13px] font-black">Z</span>
                <Heart size={13} className="fill-white" />
              </span>
            </ActionButton>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* En-tête */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between px-4 pt-4">
        <Pressable
          onClick={() => {
            tap();
            setFiltersOpen(true);
          }}
          aria-label="Filtres"
          className="pointer-events-auto flex flex-col items-center gap-0.5 text-gold"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/35 bg-black/50 backdrop-blur-md">
            <Settings2 size={16} />
          </span>
          <span className="text-[9px] text-white/70">Filtres</span>
        </Pressable>

        <div className="min-w-0 px-2 text-center">
          <h1 className="text-gold-gradient text-[15px] leading-none font-black tracking-[0.2em]">
            W<span className="tracking-normal">🌍</span>RLD ROOM
          </h1>
          <p className="mt-1 text-[10px] text-white/60">Le monde est à un Hello.</p>
        </div>

        <Pressable
          onClick={() => {
            tap();
            toast("Bientôt : la carte du monde");
          }}
          aria-label="Carte"
          className="pointer-events-auto flex flex-col items-center gap-0.5 text-gold"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/35 bg-black/50 backdrop-blur-md">
            <Globe2 size={16} />
          </span>
          <span className="text-[9px] text-white/70">Carte</span>
        </Pressable>
      </header>

      <WorldHelloMatch
        open={!!match}
        me={me}
        other={
          match
            ? {
                name: match.name,
                age: match.age,
                flag: match.flag,
                city: match.city,
                country: match.country,
                photo: match.photo ?? photoUrl(match.id, 320),
              }
            : me
        }
        onStartVideo={() => {
          tap();
          toast("Bientôt : la rencontre vidéo de 60 secondes");
          setMatch(null);
          next();
        }}
        onLater={() => {
          setMatch(null);
          next();
        }}
      />

      <BottomSheet open={filtersOpen} onClose={() => setFiltersOpen(false)}>
        <div className="space-y-4 px-4 pb-2">
          <h2 className="text-[17px] font-black text-white">Filtres du voyage</h2>
          {[
            { label: "Je veux voir", value: gender, set: setGender, options: ["Tous", "Hommes", "Femmes", "LGBT+"] },
            { label: "Âge", value: ageRange, set: setAgeRange, options: ["18–24", "25–35", "36–45", "46+"] },
            { label: "Zone", value: zone, set: setZone, options: ["Monde entier", "Mon pays", "Afrique", "Europe", "Asie"] },
            { label: "Langue", value: lang, set: setLang, options: ["FR", "EN"] },
            {
              label: "Intention",
              value: intent,
              set: setIntent,
              options: ["Peu importe", "Amitié", "Discussion", "Rencontre sérieuse"],
            },
          ].map((row) => (
            <div key={row.label}>
              <p className="mb-1.5 text-[11px] font-semibold tracking-wide text-white/55 uppercase">
                {row.label}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {row.options.map((o) => (
                  <Pressable
                    key={o}
                    onClick={() => {
                      tap();
                      row.set(o);
                    }}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-[12px] font-semibold",
                      row.value === o
                        ? "border-gold/70 bg-gold/15 text-gold"
                        : "border-border bg-surface text-white/70",
                    )}
                  >
                    {o}
                  </Pressable>
                ))}
              </div>
            </div>
          ))}
          <Pressable
            onClick={() => {
              tap();
              setFiltersOpen(false);
              toast.success("Filtres appliqués");
            }}
            className="bg-gold-gradient w-full rounded-2xl py-3 text-[14px] font-bold text-[oklch(0.16_0.02_60)]"
          >
            Voir les profils
          </Pressable>
          <Pressable
            onClick={() => {
              tap();
              resetWorldProfile();
              toast.success("Profil World Room réinitialisé");
              navigate({ to: "/world" });
            }}
            className="w-full py-2 text-center text-[11.5px] text-white/40"
          >
            Recommencer l'onboarding (démo)
          </Pressable>
        </div>
      </BottomSheet>
    </div>
  );
}

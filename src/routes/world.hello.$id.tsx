import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  ChevronLeft,
  Heart,
  MapPin,
  MessageCircle,
  Mic,
  MicOff,
  Sparkles,
  Video,
  VideoOff,
} from "lucide-react";
import { toast } from "sonner";
import { Pressable } from "@/components/zembo/ui";
import { photoUrl } from "@/components/zembo/PhotoAvatar";
import { Confetti } from "@/components/zembo/WorldHelloMatch";
import decor from "@/assets/world-hello-decor.png";
import { loadWorldProfile } from "@/lib/world-profile";
import {
  acceptHello,
  addConnection,
  endMeeting,
  findPerson,
  ignoreHello,
  randomIcebreaker,
} from "@/lib/world-hello";

export const Route = createFileRoute("/world/hello/$id")({
  validateSearch: (search: Record<string, unknown>) => ({
    step:
      search["step"] === "meet" || search["step"] === "celebration"
        ? (search["step"] as Step)
        : ("card" as Step),
  }),
  head: () => ({
    meta: [
      { title: "Hello mutuel — World Room Zembo" },
      {
        name: "description",
        content:
          "Hello mutuel, rencontre vidéo de 60 secondes et décision mutuelle : le twist de World Room.",
      },
      { property: "og:title", content: "Hello mutuel — World Room Zembo" },
      {
        property: "og:description",
        content: "Deux Hellos, une rencontre de 60 secondes, une décision mutuelle.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorldHelloFlow,
});

type Step = "card" | "celebration" | "meet" | "decision" | "connected" | "over";

function tap() {
  if (typeof navigator !== "undefined") navigator.vibrate?.(10);
}

function WorldHelloFlow() {
  const { id } = useParams({ from: "/world/hello/$id" });
  const navigate = useNavigate();
  const person = findPerson(id);
  const { step: initialStep } = Route.useSearch();
  const [step, setStep] = useState<Step>(initialStep ?? "card");

  const me = useMemo(() => {
    const p = loadWorldProfile();
    return {
      name: p.username || "Deena",
      age: Number(p.age) || 27,
      flag: "🌍",
      city: p.city || "Montréal",
      country: p.country || "Canada",
      photo: p.photos?.[0] || photoUrl("deena-world", 320),
    };
  }, []);

  if (!person) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-[14px] text-white/70">Ce Hello n'existe plus.</p>
        <Pressable
          onClick={() => navigate({ to: "/world/hellos" })}
          className="rounded-full bg-gold-gradient px-5 py-2.5 text-[13px] font-black text-[oklch(0.16_0.02_60)]"
        >
          Retour aux Hellos
        </Pressable>
      </div>
    );
  }

  const other = {
    name: person.name,
    age: person.age,
    flag: person.flag,
    city: person.city,
    country: person.country,
    photo: photoUrl(person.id, 320),
  };

  return (
    <div className="relative h-full overflow-hidden bg-[oklch(0.05_0.01_50)] select-none">
      <AnimatePresence mode="wait">
        {step === "card" && (
          <motion.div
            key="card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <img
              src={photoUrl(person.id, 900)}
              alt={`${person.name}, ${person.city}`}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[24%] bg-gradient-to-b from-black/90 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[66%] bg-gradient-to-t from-black via-black/75 to-transparent" />

            <div className="absolute top-4 left-4 flex items-center gap-2">
              <Pressable
                onClick={() => {
                  tap();
                  navigate({ to: "/world/hellos" });
                }}
                aria-label="Retour"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/55 text-gold backdrop-blur-md"
              >
                <ChevronLeft size={18} />
              </Pressable>
              <span className="rounded-full border border-gold/35 bg-black/60 px-3 py-1.5 text-[11px] font-semibold text-white/90 backdrop-blur-md">
                👋 {person.name} t'a envoyé un Hello depuis {person.country}
              </span>
            </div>

            <div className="absolute bottom-[26%] left-[4%] w-[92%] space-y-2">
              <div className="flex items-center gap-1.5">
                <h1 className="text-[27px] leading-none font-black text-white">
                  {person.name}, {person.age}
                </h1>
                <BadgeCheck size={18} className="text-[oklch(0.72_0.14_240)]" />
              </div>
              <p className="flex items-center gap-1 text-[12px] text-white/70">
                <MapPin size={12} className="text-gold" />
                {person.flag} {person.city}, {person.country}
              </p>
              <span className="inline-flex rounded-full border border-gold/30 bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white/90 backdrop-blur-md">
                {person.intent}
              </span>
              <p className="text-[12px] leading-snug text-white/75 italic">« {person.quote} »</p>
              <div className="flex flex-wrap gap-1.5">
                {person.interests.map((it) => (
                  <span
                    key={it}
                    className="rounded-full border border-gold/35 bg-black/40 px-2 py-0.5 text-[10px] text-white/85"
                  >
                    {it}
                  </span>
                ))}
              </div>
              <div className="flex items-stretch gap-1.5 pt-1">
                {[
                  { icon: "✈️", label: "Mon dimanche parfait ?", value: person.sunday },
                  { icon: "🧡", label: "Mon red flag ?", value: person.redFlag },
                  { icon: "🌐", label: "Partir demain ?", value: person.travel },
                ].map((a) => (
                  <div
                    key={a.label}
                    className="min-w-0 flex-1 rounded-2xl border border-white/12 bg-black/55 px-2 py-2 backdrop-blur-md"
                  >
                    <p className="text-[10px] leading-tight font-semibold text-gold/85">
                      {a.icon} {a.label}
                    </p>
                    <p className="mt-1 text-[10px] leading-snug text-white/85">{a.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute bottom-[6%] left-[4%] w-[92%] space-y-2">
              <Pressable
                onClick={() => {
                  tap();
                  acceptHello(person.id);
                  setStep("celebration");
                }}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gold-gradient py-3.5 text-[15px] font-black text-[oklch(0.16_0.02_60)] shadow-[0_10px_30px_-8px_oklch(0.85_0.15_85/70%)]"
              >
                👋 Répondre Hello
              </Pressable>
              <Pressable
                onClick={() => {
                  tap();
                  ignoreHello(person.id);
                  toast("Hello ignoré");
                  navigate({ to: "/world/hellos" });
                }}
                className="w-full rounded-full border border-white/18 py-3 text-center text-[13px] font-semibold text-white/70"
              >
                Ignorer
              </Pressable>
            </div>
          </motion.div>
        )}

        {step === "celebration" && (
          <motion.div
            key="celebration"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 overflow-hidden"
          >
            <img
              src={decor}
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/85" />
            <Confetti />

            <div className="relative flex h-full flex-col items-center px-5 pt-[6%] pb-[5%]">
              <h1 className="text-[14px] leading-none font-black tracking-[0.2em] text-white">
                W<span className="tracking-normal">🌍</span>RLD{" "}
                <span className="text-gold-gradient">ROOM</span>
              </h1>
              <p className="mt-1 text-[10px] text-white/60">Le monde est à un Hello.</p>

              <motion.p
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-[7%] text-center font-serif text-[25px] leading-tight text-gold italic"
              >
                Vous vous êtes dit
              </motion.p>
              <motion.p
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 12 }}
                className="text-gold-gradient text-[44px] leading-none font-black"
              >
                HELLO !
              </motion.p>
              <p className="mt-2 text-center text-[13px] leading-snug text-white/85">
                Une belle connexion commence
                <br />
                peut-être ici…
              </p>
              <span className="mt-3 h-[2px] w-14 rounded-full bg-gold/70" />

              <div className="relative mt-[6%] flex w-full items-start gap-2">
                <MatchCircle person={me} from={-120} delay={0.2} />
                <MatchCircle person={other} from={120} delay={0.3} />
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.25, 1] }}
                  transition={{ delay: 0.55, duration: 0.5 }}
                  className="absolute top-[36px] left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-br from-[oklch(0.62_0.2_25)] to-[oklch(0.85_0.15_85)] text-[26px] shadow-[0_0_36px_-4px_oklch(0.85_0.15_85/85%)]"
                >
                  ❤️
                </motion.span>
              </div>

              <div className="mt-auto w-full">
                <div className="flex items-start justify-between gap-2 text-center">
                  {[
                    { icon: <MessageCircle size={18} />, text: "Découvrez une nouvelle personne" },
                    { icon: <Video size={18} />, text: "Une rencontre vidéo de 60 secondes" },
                    {
                      icon: <Sparkles size={18} />,
                      text: "Et laissez la conversation suivre son cours…",
                    },
                  ].map((it, i) => (
                    <div key={i} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                      <span className="text-gold">{it.icon}</span>
                      <p className="text-[10px] leading-tight text-white/80">{it.text}</p>
                    </div>
                  ))}
                </div>
                <Pressable
                  onClick={() => {
                    tap();
                    setStep("meet");
                  }}
                  className="mt-4 w-full rounded-full bg-gold-gradient py-3.5 text-center text-[15px] font-black text-[oklch(0.16_0.02_60)] shadow-[0_10px_30px_-8px_oklch(0.85_0.15_85/70%)]"
                >
                  📷 Lancer la rencontre 60 secondes
                </Pressable>
                <Pressable
                  onClick={() => {
                    tap();
                    navigate({ to: "/world/hellos" });
                  }}
                  className="mt-2 w-full rounded-full border border-gold/45 py-3 text-center text-[14px] font-semibold text-white/90"
                >
                  Plus tard
                </Pressable>
              </div>
            </div>
          </motion.div>
        )}

        {step === "meet" && (
          <MeetRoom
            key="meet"
            me={me}
            other={other}
            onEnd={() => setStep("decision")}
          />
        )}

        {step === "decision" && (
          <Decision
            key="decision"
            other={other}
            onConnect={() => {
              addConnection(person.id);
              setStep("connected");
            }}
            onOver={() => {
              endMeeting(person.id);
              setStep("over");
            }}
          />
        )}

        {step === "connected" && (
          <motion.div
            key="connected"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 overflow-hidden bg-[oklch(0.08_0.02_60)]"
          >
            <Confetti />
            <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
              <div className="flex items-center gap-3">
                <img
                  src={me.photo}
                  alt={me.name}
                  className="h-20 w-20 rounded-full border-2 border-gold object-cover"
                />
                <Heart size={26} className="fill-gold text-gold" />
                <img
                  src={other.photo}
                  alt={other.name}
                  className="h-20 w-20 rounded-full border-2 border-gold object-cover"
                />
              </div>
              <h2 className="text-gold-gradient mt-6 text-[26px] leading-tight font-black">
                🎉 CONNEXION MUTUELLE
              </h2>
              <p className="mt-2 text-[13px] leading-snug text-white/80">
                {other.name} est maintenant dans tes connexions World Room.
              </p>
              <Pressable
                onClick={() => {
                  tap();
                  navigate({ to: "/world/messages/$id", params: { id: person.id } });
                }}
                className="mt-7 w-full rounded-full bg-gold-gradient py-3.5 text-[15px] font-black text-[oklch(0.16_0.02_60)]"
              >
                Ouvrir la conversation
              </Pressable>
              <Pressable
                onClick={() => {
                  tap();
                  navigate({ to: "/world/discover" });
                }}
                className="mt-2 w-full rounded-full border border-white/18 py-3 text-[13px] font-semibold text-white/70"
              >
                Continuer à découvrir
              </Pressable>
            </div>
          </motion.div>
        )}

        {step === "over" && (
          <motion.div
            key="over"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-[oklch(0.07_0.01_50)] px-6 text-center"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-[26px]">
              🌍
            </span>
            <h2 className="mt-5 text-[20px] font-black text-white">La rencontre est terminée.</h2>
            <p className="mt-2 text-[13px] text-white/60">
              Le monde est grand : une autre belle connexion t'attend peut-être.
            </p>
            <Pressable
              onClick={() => {
                tap();
                navigate({ to: "/world/discover" });
              }}
              className="mt-7 w-full rounded-full bg-gold-gradient py-3.5 text-[15px] font-black text-[oklch(0.16_0.02_60)]"
            >
              Découvrir d'autres profils
            </Pressable>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type Persona = {
  name: string;
  age: number;
  flag: string;
  city: string;
  country: string;
  photo: string;
};

function MatchCircle({
  person,
  from,
  delay,
}: {
  person: Persona;
  from: number;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ x: from, opacity: 0, scale: 0.7 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 180, damping: 16 }}
      className="flex min-w-0 flex-1 flex-col items-center"
    >
      <span className="h-[124px] w-[124px] overflow-hidden rounded-full border-[3px] border-gold shadow-[0_0_40px_-6px_oklch(0.85_0.15_85/75%)]">
        <img src={person.photo} alt={person.name} className="h-full w-full object-cover" />
      </span>
      <p className="mt-2 truncate text-[15px] font-black text-white">
        {person.name}, {person.age}
      </p>
      <p className="truncate text-[11px] text-white/75">
        {person.flag} {person.city}
      </p>
    </motion.div>
  );
}

function MeetRoom({
  me,
  other,
  onEnd,
}: {
  me: Persona;
  other: Persona;
  onEnd: () => void;
}) {
  const [left, setLeft] = useState(60);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [question, setQuestion] = useState(() => randomIcebreaker());

  useEffect(() => {
    const t = window.setInterval(() => {
      setLeft((v) => {
        if (v <= 1) {
          window.clearInterval(t);
          onEnd();
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, [onEnd]);

  useEffect(() => {
    const t = window.setTimeout(() => setQuestion(randomIcebreaker()), 30000);
    return () => window.clearTimeout(t);
  }, []);

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col bg-[oklch(0.06_0.01_50)] px-4 pt-4 pb-5"
    >
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-black tracking-wide text-white">🌍 WORLD HELLO</span>
        <span
          className={`rounded-full border px-3 py-1 text-[15px] font-black tabular-nums ${
            left <= 10
              ? "border-[oklch(0.62_0.2_25)]/60 bg-[oklch(0.62_0.2_25)]/15 text-[oklch(0.75_0.19_25)]"
              : "border-gold/45 bg-black/50 text-gold"
          }`}
        >
          {mm}:{ss}
        </span>
      </div>

      <div className="mt-3 flex gap-2">
        {[
          { p: other, tag: `${other.flag} ${other.name}`, off: false },
          { p: me, tag: "Toi", off: camOff },
        ].map((v) => (
          <div
            key={v.tag}
            className="relative min-w-0 flex-1 overflow-hidden rounded-3xl border border-gold/25 bg-black"
            style={{ aspectRatio: "9 / 14" }}
          >
            {v.off ? (
              <div className="flex h-full w-full items-center justify-center bg-white/[0.04] text-white/40">
                <VideoOff size={22} />
              </div>
            ) : (
              <img src={v.p.photo} alt={v.tag} className="h-full w-full object-cover" />
            )}
            <span className="absolute bottom-2 left-2 rounded-full bg-black/65 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
              {v.tag}
            </span>
          </div>
        ))}
      </div>

      <motion.div
        key={question}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 rounded-3xl border border-gold/30 bg-gradient-to-b from-gold/12 to-transparent px-4 py-4 text-center"
      >
        <p className="text-[10px] font-black tracking-[0.2em] text-gold/80">BRISE-GLACE</p>
        <p className="mt-1.5 text-[15px] leading-snug font-bold text-white">{question}</p>
      </motion.div>

      <div className="mt-auto">
        <div className="flex items-center justify-center gap-3">
          <Pressable
            onClick={() => {
              tap();
              setMuted((m) => !m);
            }}
            aria-label={muted ? "Réactiver le micro" : "Couper le micro"}
            className={`flex h-12 w-12 items-center justify-center rounded-full border ${
              muted ? "border-white/20 bg-white/10 text-white/60" : "border-gold/40 bg-black/50 text-gold"
            }`}
          >
            {muted ? <MicOff size={19} /> : <Mic size={19} />}
          </Pressable>
          <Pressable
            onClick={() => {
              tap();
              setCamOff((c) => !c);
            }}
            aria-label={camOff ? "Réactiver la caméra" : "Couper la caméra"}
            className={`flex h-12 w-12 items-center justify-center rounded-full border ${
              camOff ? "border-white/20 bg-white/10 text-white/60" : "border-gold/40 bg-black/50 text-gold"
            }`}
          >
            {camOff ? <VideoOff size={19} /> : <Video size={19} />}
          </Pressable>
          <Pressable
            onClick={() => {
              tap();
              setQuestion(randomIcebreaker());
            }}
            aria-label="Autre question"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-black/50 text-gold"
          >
            <Sparkles size={19} />
          </Pressable>
        </div>
        <Pressable
          onClick={() => {
            tap();
            onEnd();
          }}
          className="mt-3 w-full rounded-full border border-white/18 py-3 text-center text-[13px] font-semibold text-white/70"
        >
          Terminer la rencontre
        </Pressable>
      </div>
    </motion.div>
  );
}

function Decision({
  other,
  onConnect,
  onOver,
}: {
  other: Persona;
  onConnect: () => void;
  onOver: () => void;
}) {
  const [waiting, setWaiting] = useState(false);

  const choose = (mine: "connect" | "next") => {
    tap();
    if (mine === "next") {
      onOver();
      return;
    }
    setWaiting(true);
    // Démo : la réponse de l'autre arrive après un court instant.
    window.setTimeout(() => {
      const theirs = Math.random() < 0.75 ? "connect" : "next";
      if (theirs === "connect") onConnect();
      else onOver();
    }, 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-[oklch(0.07_0.01_50)] px-6 text-center"
    >
      <img
        src={other.photo}
        alt={other.name}
        className="h-24 w-24 rounded-full border-2 border-gold object-cover"
      />
      <h2 className="mt-5 text-[24px] leading-tight font-black text-white">Envie de continuer ?</h2>
      <p className="mt-2 text-[12px] text-white/60">
        Vous répondez chacun de votre côté. La conversation ne s'ouvre que si vous choisissez tous
        les deux Connecter.
      </p>

      {waiting ? (
        <div className="mt-8 flex flex-col items-center gap-3">
          <motion.span
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="text-[30px]"
          >
            ⏳
          </motion.span>
          <p className="text-[13px] text-white/70">
            En attente de la réponse de {other.name}…
          </p>
        </div>
      ) : (
        <div className="mt-8 w-full space-y-2">
          <Pressable
            onClick={() => choose("connect")}
            className="w-full rounded-full bg-gold-gradient py-3.5 text-[15px] font-black text-[oklch(0.16_0.02_60)] shadow-[0_10px_30px_-8px_oklch(0.85_0.15_85/70%)]"
          >
            ❤️ CONNECTER
          </Pressable>
          <Pressable
            onClick={() => choose("next")}
            className="w-full rounded-full border border-white/18 py-3.5 text-[14px] font-semibold text-white/75"
          >
            👋 MERCI, AU SUIVANT
          </Pressable>
        </div>
      )}
    </motion.div>
  );
}

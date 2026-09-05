/** Mécanique du Hello mutuel World Room (100 % mock, persisté en local). */

export type WorldPerson = {
  id: string;
  name: string;
  age: number;
  flag: string;
  city: string;
  country: string;
  intent: string;
  quote: string;
  interests: string[];
  sunday: string;
  redFlag: string;
  travel: string;
};

export const WORLD_PEOPLE: WorldPerson[] = [
  {
    id: "moussa",
    name: "Moussa",
    age: 30,
    flag: "🇨🇮",
    city: "Abidjan",
    country: "Côte d'Ivoire",
    intent: "💜 Rencontre sérieuse",
    quote: "Je crois aux vraies conversations, pas aux petits jeux.",
    interests: ["🎧 Musique", "⚽ Foot", "🌍 Voyage", "🧑‍💻 Tech"],
    sunday: "Plage + musique jusqu'au coucher du soleil",
    redFlag: "Le mensonge, même petit",
    travel: "Zanzibar, sans hésiter",
  },
  {
    id: "awa",
    name: "Awa",
    age: 26,
    flag: "🇸🇳",
    city: "Dakar",
    country: "Sénégal",
    intent: "❤️ Rencontre sérieuse",
    quote: "La douceur, l'humour et la famille avant tout.",
    interests: ["🌊 Océan", "🍲 Cuisine", "💃 Danse", "🎨 Art"],
    sunday: "Thiéboudienne en famille puis Corniche",
    redFlag: "Le manque de respect",
    travel: "Bali, pour apprendre à surfer",
  },
  {
    id: "elena",
    name: "Elena",
    age: 27,
    flag: "🇬🇷",
    city: "Santorin",
    country: "Grèce",
    intent: "💜 Rencontre sérieuse",
    quote: "Bonne énergie, belles discussions et grands projets.",
    interests: ["✈️ Voyage", "🍴 Cuisine", "📷 Photographie"],
    sunday: "Plage, bon repas et coucher de soleil",
    redFlag: "Le manque de communication",
    travel: "Le Japon",
  },
  {
    id: "chloe",
    name: "Chloé",
    age: 25,
    flag: "🇫🇷",
    city: "Lyon",
    country: "France",
    intent: "💬 Discussion",
    quote: "J'aime les gens qui racontent bien les choses.",
    interests: ["📚 Lecture", "🎬 Cinéma", "🍷 Gastronomie"],
    sunday: "Marché le matin, ciné le soir",
    redFlag: "L'arrogance",
    travel: "Le Pérou",
  },
  {
    id: "kenji",
    name: "Kenji",
    age: 31,
    flag: "🇯🇵",
    city: "Osaka",
    country: "Japon",
    intent: "👥 Amitié",
    quote: "Le monde est petit quand on ose dire bonjour.",
    interests: ["🍜 Cuisine", "🎮 Jeux", "🚲 Vélo"],
    sunday: "Ramen puis balade en vélo",
    redFlag: "Le manque de ponctualité",
    travel: "L'Islande",
  },
];

/** Aperçus mock de conversations World (dernier message + heure + non-lus). */
export const CONVERSATION_PREVIEWS: Record<
  string,
  { last: string; time: string; unread: number }
> = {
  moussa: { last: "Trop cool cette rencontre !", time: "09:42", unread: 2 },
  elena: { last: "Hâte de te reparler 😊", time: "Hier", unread: 1 },
  awa: { last: "Tu fais quoi ce week-end ?", time: "Lun", unread: 0 },
  chloe: { last: "Ravie d'avoir discuté !", time: "Mar", unread: 0 },
  kenji: { last: "こんにちは 👋", time: "Mer", unread: 0 },
};

export function conversationPreview(id: string) {
  return CONVERSATION_PREVIEWS[id] ?? { last: "Conversation ouverte, à toi de jouer.", time: "Maintenant", unread: 0 };
}

/** Depuis quand le Hello a été reçu (mock). */
export const HELLO_AGES: Record<string, string> = {
  moussa: "il y a 12 min",
  awa: "il y a 2 h",
  elena: "il y a 1 j",
  chloe: "il y a 5 h",
  kenji: "il y a 1 j",
};

export function helloAge(id: string) {
  return HELLO_AGES[id] ?? "à l'instant";
}

export function findPerson(id: string) {
  return WORLD_PEOPLE.find((p) => p.id === id);
}

export const ICEBREAKERS = [
  "💬 Quel endroit dans le monde rêves-tu de visiter ?",
  "💬 C'est quoi ton plus beau souvenir de voyage ?",
  "💬 Une passion que peu de gens connaissent chez toi ?",
  "💬 Si tu partais demain, tu emmènerais quoi ?",
  "💬 Ton rêve le plus fou, tu le dirais tout haut ?",
];

export function randomIcebreaker() {
  return ICEBREAKERS[Math.floor(Math.random() * ICEBREAKERS.length)]!;
}

type HelloState = {
  /** Hellos reçus encore en attente de réponse. */
  pending: string[];
  ignored: string[];
  /** Hello mutuel confirmé (rencontre 60s dispo). */
  mutual: string[];
  /** Connexions mutuelles → messagerie débloquée. */
  connections: string[];
};

const KEY = "zembo-world-hello";

const DEFAULT_STATE: HelloState = {
  pending: ["moussa", "awa"],
  ignored: [],
  mutual: [],
  connections: [],
};

export function loadHelloState(): HelloState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...(JSON.parse(raw) as Partial<HelloState>) };
  } catch {
    return DEFAULT_STATE;
  }
}

function save(state: HelloState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function pendingHellos() {
  const s = loadHelloState();
  return s.pending
    .filter((id) => !s.ignored.includes(id))
    .map((id) => findPerson(id))
    .filter((p): p is WorldPerson => !!p);
}

export function ignoreHello(id: string) {
  const s = loadHelloState();
  save({ ...s, pending: s.pending.filter((p) => p !== id), ignored: [...s.ignored, id] });
}

/** Répondre Hello → Hello mutuel. */
export function acceptHello(id: string) {
  const s = loadHelloState();
  save({
    ...s,
    pending: s.pending.filter((p) => p !== id),
    mutual: s.mutual.includes(id) ? s.mutual : [...s.mutual, id],
  });
}

export function addConnection(id: string) {
  const s = loadHelloState();
  save({
    ...s,
    connections: s.connections.includes(id) ? s.connections : [...s.connections, id],
    mutual: s.mutual.filter((m) => m !== id),
  });
}

export function endMeeting(id: string) {
  const s = loadHelloState();
  save({ ...s, mutual: s.mutual.filter((m) => m !== id) });
}

export function connections() {
  return loadHelloState()
    .connections.map((id) => findPerson(id))
    .filter((p): p is WorldPerson => !!p);
}

export function isConnected(id: string) {
  return loadHelloState().connections.includes(id);
}

export function resetHelloDemo() {
  save(DEFAULT_STATE);
}

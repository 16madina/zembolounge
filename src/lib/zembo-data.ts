import mic from "@/assets/mic.jpg";
import tableImg from "@/assets/table.jpg";
import play from "@/assets/play.jpg";
import world from "@/assets/world.jpg";

export const IMG = { mic, table: tableImg, play, world };

export type Live = {
  id: string;
  title: string;
  category: string;
  host: string;
  viewers: number;
  image: string;
  tint: "gold" | "violet" | "emerald" | "azure";
};

export const lives: Live[] = [
  {
    id: "1",
    title: "L'argent et l'amour : peut-on tout partager ?",
    category: "Débat",
    host: "Sarah",
    viewers: 342,
    image: mic,
    tint: "gold",
  },
  {
    id: "2",
    title: "Montre ton talent 🎤",
    category: "Open Mic",
    host: "Nadia",
    viewers: 281,
    image: mic,
    tint: "violet",
  },
  {
    id: "3",
    title: "Mon pire date… j'ai tout raconté 😂",
    category: "Storytime",
    host: "Yann",
    viewers: 187,
    image: tableImg,
    tint: "azure",
  },
  {
    id: "4",
    title: "Ce que je n'ai jamais dit à personne…",
    category: "Confessions",
    host: "Leila",
    viewers: 154,
    image: mic,
    tint: "violet",
  },
  {
    id: "5",
    title: "Red flags : lesquels ignorer ou fuir ?",
    category: "Relations",
    host: "Marc",
    viewers: 132,
    image: tableImg,
    tint: "gold",
  },
  {
    id: "6",
    title: "Côte d'Ivoire vs Canada : mêmes valeurs ?",
    category: "Culture",
    host: "Inès",
    viewers: 98,
    image: world,
    tint: "emerald",
  },
];

export const categories = [
  { id: "tous", label: "Tous" },
  { id: "debats", label: "Débats" },
  { id: "openmic", label: "Open Mic" },
  { id: "confessions", label: "Confessions" },
  { id: "jeux", label: "Jeux" },
  { id: "culture", label: "Culture" },
  { id: "lifestyle", label: "Lifestyle" },
];

export const stories = [
  { id: "1", label: "Débat du jour", viewers: "1.2K", image: mic },
  { id: "2", label: "Story Time", viewers: "856", image: tableImg },
  { id: "3", label: "Open Mic", viewers: "643", image: mic },
  { id: "4", label: "Jeux & Fun", viewers: "987", image: play },
  { id: "5", label: "World Room", viewers: "1.5K", image: world },
];

export const tables = [
  {
    id: "1",
    title: "Red Flags Table",
    theme: "Relations ❤️",
    seats: 6,
    capacity: 6,
    image: tableImg,
  },
  {
    id: "2",
    title: "Parents célibataires",
    theme: "Discussion",
    seats: 4,
    capacity: 10,
    image: tableImg,
  },
  { id: "3", title: "World Room : Abidjan", theme: "Culture", seats: 8, capacity: 10, image: world },
];

export const recommended = [
  { id: "1", title: "Parents célibataires : nos réalités", kind: "Discussion", min: 45, live: 220 },
  { id: "2", title: "Jeux de couple : on s'amuse en live", kind: "Jeux", min: 30, live: 175 },
  { id: "3", title: "Entrepreneuriat et amour : gérer les deux", kind: "Débat", min: 60, live: 146 },
];

export const trends = [
  { id: "1", title: "L'argent et l'amour", live: 342 },
  { id: "2", title: "Mon pire date", live: 187 },
  { id: "3", title: "Red flags", live: 132 },
  { id: "4", title: "Confessions", live: 98 },
  { id: "5", title: "Montre ton talent", live: 281 },
];

export const forYou = [
  { id: "1", tag: "LIVE", title: "Red Flags ? On en parle !", views: 740, image: mic },
  { id: "2", tag: "Hot Topic", title: "Secrets inavoués", views: 620, image: tableImg },
  { id: "3", tag: "Fun Game", title: "Qui est le plus drôle ?", views: 580, image: play },
  { id: "4", tag: "Conseils Love", title: "Attirer ce que tu mérites", views: 915, image: world },
];

export const conversations = [
  {
    id: "1",
    name: "Sarah",
    badge: "HÔTE",
    lines: ["Merci pour ta réponse tout à l'heure 🙌", "On devrait continuer la discussion…"],
    time: "21:42",
    unread: 2,
  },
  {
    id: "2",
    name: "Yann",
    lines: ["C'était un débat incroyable 🔥", "À refaire bientôt !"],
    time: "21:15",
    unread: 0,
    dot: true,
  },
  {
    id: "3",
    name: "Leila",
    lines: ["Tu veux rejoindre ma table demain ?", "Le sujet est super intéressant."],
    time: "20:58",
    unread: 1,
  },
  {
    id: "4",
    name: "Red Flags Table",
    group: "Groupe · 8 membres",
    lines: ["Marc : 😂😂 trop fort !"],
    time: "20:34",
    unread: 0,
    muted: true,
  },
  {
    id: "5",
    name: "Aïcha",
    lines: ["Merci beaucoup pour ton conseil 🙏"],
    time: "19:47",
    unread: 0,
  },
  {
    id: "6",
    name: "ZEMBO Team",
    badge: "OFFICIEL",
    lines: ["🎉 Bienvenue dans la communauté ZEMBO !", "N'hésite pas si tu as des questions."],
    time: "18:30",
    unread: 0,
    dot: true,
  },
  { id: "7", name: "Kader", lines: ["À demain sur le Live alors !"], time: "Hier", unread: 0 },
];

export const people = ["Sarah", "Yann", "Leila", "Marc", "Aïcha", "Kader"];

export const creations = [
  {
    id: "1",
    kind: "LIVE" as const,
    title: "L'argent et l'amour : peut-on tout partager ?",
    meta: "342 ont participé",
    when: "Il y a 2 jours",
    image: mic,
  },
  {
    id: "2",
    kind: "TABLE" as const,
    title: "Red Flags Table",
    meta: "6/6 participants",
    when: "Il y a 3 jours",
    image: tableImg,
  },
  {
    id: "3",
    kind: "LIVE" as const,
    title: "Open Mic : Montre ton talent",
    meta: "281 ont participé",
    when: "Il y a 5 jours",
    image: mic,
  },
  {
    id: "4",
    kind: "TABLE" as const,
    title: "World Room : Abidjan",
    meta: "8/10 participants",
    when: "Il y a 1 semaine",
    image: world,
  },
];

export const tableSeats = [
  { n: 1, name: "Deena (Toi)", you: true },
  { n: 2, name: "Sarah", host: true },
  { n: 3, name: "Leila" },
  { n: 4, name: "Yann" },
  { n: 5, name: "Aïcha" },
  { n: 6, name: "Marc" },
];

export const tableChat = [
  { id: "1", name: "Ben", text: "Intéressant ça Deena ! Hâte d'entendre ta réponse 👀", time: "21:33" },
  { id: "2", name: "Emma", text: "Moi je ne pardonne pas l'infidélité.", time: "21:34" },
  { id: "3", name: "Kader", text: "On a tous nos limites, et c'est OK.", time: "21:35" },
  { id: "4", name: "Nadia", text: "L'argent change beaucoup de choses malheureusement.", time: "21:36" },
];

export const showChat = [
  { id: "1", name: "Fatouu", tag: "Top Fan", text: "Deena pose toujours les meilleures questions 👏" },
  { id: "2", name: "Ben Z", text: "Team Moussa 💪" },
  { id: "3", name: "QueenVee", tag: "Top Fan", text: "Je ne suis pas d'accord du tout !" },
  { id: "4", name: "Le Tigre", text: "Sarah a tout dit 🔥" },
  { id: "5", name: "Nina92", text: "Peut-on voter ?" },
];

export const guests = [
  { name: "Moussa", role: "INVITÉ" as const },
  { name: "Sarah", role: "INVITÉ" as const },
  { name: "Yann", role: "INVITÉ" as const },
  { name: "Aïcha", role: "CO-HOST" as const },
];

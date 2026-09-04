import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  AlertCircle,
  AtSign,
  Camera,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Globe,
  Loader2,
  Lock,
  Mail,
  Phone,
  User as UserIcon,
} from "lucide-react";
import { Pressable } from "@/components/zembo/ui";
import {
  AuthBrand,
  AuthDivider,
  AuthField,
  COUNTRIES,
  GoldButton,
  SocialRow,
  inputClass,
} from "@/components/zembo/AuthUI";
import { zembo } from "@/lib/zembo-supabase";

type AuthSearch = { redirect?: "/world" };

export const Route = createFileRoute("/signup")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>): AuthSearch =>
    search['redirect'] === "/world" ? { redirect: "/world" } : {},
  head: () => ({
    meta: [
      { title: "Créer un compte — Zembo" },
      {
        name: "description",
        content: "Rejoins la communauté Zembo : crée ton compte en quelques secondes.",
      },
      { property: "og:title", content: "Créer un compte — Zembo" },
      { property: "og:description", content: "Inscris-toi et lance tes premiers lives sur Zembo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignupScreen,
});

function SignupScreen() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const fileRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("CA");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const country = COUNTRIES.find((c) => c.code === countryCode) ?? COUNTRIES[0];
  const pseudoOk = pseudo.replace("@", "").trim().length > 2;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError(null);

    if (!prenom.trim() || !nom.trim() || !pseudo.trim() || !email.trim()) {
      setError("Remplis ton nom, prénom, pseudo et email.");
      return;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setSubmitting(true);
    const { error: signUpError } = await zembo.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          nom: nom.trim(),
          prenom: prenom.trim(),
          pseudo: pseudo.trim().replace(/^@/, ""),
          pays: country.name,
          pays_code: country.code,
          telephone: `${country.dial} ${phone.trim()}`.trim(),
          full_name: `${prenom.trim()} ${nom.trim()}`,
        },
      },
    });
    setSubmitting(false);

    if (signUpError) {
      const msg = signUpError.message.toLowerCase();
      setError(
        msg.includes("already") || msg.includes("registered") || msg.includes("exists")
          ? "Cet email est déjà utilisé. Connecte-toi plutôt."
          : msg.includes("password")
            ? "Mot de passe trop court (6 caractères minimum)."
            : "Création impossible pour le moment. Réessaie.",
      );
      return;
    }

    setDone(true);
    setTimeout(() => navigate({ to: redirect ?? "/", replace: true }), 1200);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="app-scroll h-full px-5 pt-[max(env(safe-area-inset-top),16px)] pb-[max(env(safe-area-inset-bottom),28px)]"
    >
      <AuthBrand />

      <h1 className="mt-6 text-[26px] leading-tight font-extrabold text-white">Crée ton compte</h1>
      <p className="mt-1 text-[13.5px] text-muted-foreground">Rejoins la communauté Zembo.</p>

      {redirect === "/world" && (
        <p className="mt-4 rounded-2xl border border-gold/30 bg-gold/[0.07] p-3.5 text-[12.5px] leading-relaxed text-foreground/90">
          🌍 Crée ou connecte ton compte Zembo pour accéder à World Room.
        </p>
      )}

      {/* Photo */}
      <div className="mt-5 flex flex-col items-center">
        <Pressable
          type="button"
          onClick={() => fileRef.current?.click()}
          className="relative"
          aria-label="Ajouter une photo"
        >
          <span className="flex h-[92px] w-[92px] items-center justify-center overflow-hidden rounded-full border-2 border-gold bg-[oklch(0.145_0.006_60)]">
            {photo ? (
              <img src={photo} alt="Aperçu de ta photo de profil" className="h-full w-full object-cover" />
            ) : (
              <UserIcon size={40} className="text-gold/60" />
            )}
          </span>
          <span className="bg-gold-gradient absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full text-[oklch(0.16_0.02_60)] ring-2 ring-background">
            <Camera size={16} />
          </span>
        </Pressable>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) setPhoto(URL.createObjectURL(f));
          }}
        />
        <p className="mt-2 text-[13px] font-semibold text-gold">Ajouter une photo</p>
        <p className="text-[11.5px] text-muted-foreground">
          Optionnel – tu pourras le faire plus tard
        </p>
      </div>

      <div className="mt-5 space-y-3.5">
        <AuthField label="Nom" icon={<UserIcon size={17} />}>
          <input className={inputClass} placeholder="Diallo" value={nom} onChange={(e) => setNom(e.target.value)} autoComplete="family-name" />
        </AuthField>

        <AuthField label="Prénom" icon={<UserIcon size={17} />}>
          <input className={inputClass} placeholder="Deena" value={prenom} onChange={(e) => setPrenom(e.target.value)} autoComplete="given-name" />
        </AuthField>

        <AuthField
          label="Pseudo"
          icon={<AtSign size={17} />}
          trailing={
            pseudoOk ? (
              <span className="flex items-center gap-1 text-[11.5px] font-semibold text-emerald">
                <Check size={12} /> Pseudo disponible
              </span>
            ) : null
          }
        >
          <input className={inputClass} placeholder="@deena" value={pseudo} onChange={(e) => setPseudo(e.target.value)} autoCapitalize="none" />
        </AuthField>

        <AuthField label="Email" icon={<Mail size={17} />}>
          <input className={inputClass} type="email" placeholder="deena@email.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" autoCapitalize="none" />
        </AuthField>

        <AuthField label="Pays" icon={<Globe size={17} />}>
          <span className="relative flex min-w-0 flex-1 items-center gap-2">
            <span className="text-[16px]">{country.flag}</span>
            <select
              className="min-w-0 flex-1 appearance-none bg-transparent text-[15px] text-white outline-none"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-[oklch(0.145_0.006_60)]">
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="shrink-0 text-muted-foreground" />
          </span>
        </AuthField>

        <AuthField label="Téléphone" icon={<Phone size={17} />}>
          <span className="flex shrink-0 items-center gap-1 rounded-xl bg-[oklch(0.2_0.006_60)] px-2 py-1 text-[13px] font-semibold text-white">
            {country.flag} {country.dial}
          </span>
          <input className={inputClass} type="tel" placeholder="(514) 123-4567" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
        </AuthField>

        <AuthField label="Mot de passe" icon={<Lock size={17} />}>
          <input
            className={inputClass}
            type={show ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <Pressable
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            className="shrink-0 text-muted-foreground"
          >
            {show ? <EyeOff size={17} /> : <Eye size={17} />}
          </Pressable>
        </AuthField>
      </div>

      <GoldButton type="submit" disabled={submitting} className="mt-5">
        {submitting && <Loader2 size={16} className="animate-spin" />}
        CRÉER MON COMPTE
      </GoldButton>

      {error && (
        <p className="mt-2.5 flex items-start gap-1.5 text-[12.5px] text-[oklch(0.7_0.19_25)]">
          <AlertCircle size={14} className="mt-[1px] shrink-0" /> {error}
        </p>
      )}
      {done && <p className="mt-2.5 text-[13px] font-semibold text-emerald">Compte créé 🎉</p>}

      <p className="mt-3 text-center text-[11.5px] leading-relaxed text-muted-foreground">
        En créant un compte, tu acceptes les <span className="text-gold">Conditions d'utilisation</span> et
        la <span className="text-gold">Politique de confidentialité</span>.
      </p>

      <div className="mt-5">
        <AuthDivider />
      </div>
      <div className="mt-3.5">
        <SocialRow />
      </div>

      <p className="mt-6 text-center text-[13px] text-muted-foreground">
        Tu as déjà un compte ?{" "}
        <Link to="/login" search={redirect ? { redirect } : {}} className="font-semibold text-gold">
          Se connecter ›
        </Link>
      </p>
    </form>
  );
}

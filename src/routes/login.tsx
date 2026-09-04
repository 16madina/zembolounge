import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { Pressable } from "@/components/zembo/ui";
import {
  AuthBrand,
  AuthDivider,
  AuthField,
  GoldButton,
  SocialRow,
  inputClass,
} from "@/components/zembo/AuthUI";
import { zembo } from "@/lib/zembo-supabase";

type AuthSearch = { redirect?: "/world" };

export const Route = createFileRoute("/login")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>): AuthSearch =>
    search['redirect'] === "/world" ? { redirect: "/world" } : {},
  head: () => ({
    meta: [
      { title: "Se connecter — Zembo" },
      {
        name: "description",
        content: "Connecte-toi à ton compte Zembo pour retrouver tes lives, tables et messages.",
      },
      { property: "og:title", content: "Se connecter — Zembo" },
      { property: "og:description", content: "Content de te revoir sur Zembo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginScreen,
});

function LoginScreen() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError(null);

    if (!email.trim() || !password) {
      setError("Renseigne ton email et ton mot de passe.");
      return;
    }

    setSubmitting(true);
    const { error: signInError } = await zembo.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setSubmitting(false);

    if (signInError) {
      setError(
        signInError.message.toLowerCase().includes("invalid")
          ? "Email ou mot de passe incorrect."
          : "Connexion impossible pour le moment. Réessaie.",
      );
      return;
    }

    navigate({ to: redirect ?? "/", replace: true });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="app-scroll h-full px-5 pt-[max(env(safe-area-inset-top),16px)] pb-[max(env(safe-area-inset-bottom),28px)]"
    >
      <AuthBrand />

      <h1 className="mt-7 text-[26px] leading-tight font-extrabold text-white">
        Content de te revoir
      </h1>
      <p className="mt-1 text-[13.5px] text-muted-foreground">Connecte-toi à ton compte.</p>

      {redirect === "/world" && (
        <p className="mt-4 rounded-2xl border border-gold/30 bg-gold/[0.07] p-3.5 text-[12.5px] leading-relaxed text-foreground/90">
          🌍 Crée ou connecte ton compte Zembo pour accéder à World Room.
        </p>
      )}

      <div className="mt-6 space-y-3.5">
        <AuthField label="Email" icon={<Mail size={17} />}>
          <input
            className={inputClass}
            type="email"
            placeholder="deena@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            autoCapitalize="none"
          />
        </AuthField>

        <AuthField label="Mot de passe" icon={<Lock size={17} />}>
          <input
            className={inputClass}
            type={show ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
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

      <div className="mt-2.5 text-right">
        <Pressable
          type="button"
          onClick={() => toast("Bientôt disponible", { description: "La réinitialisation arrive." })}
          className="text-[12.5px] font-semibold text-gold"
        >
          Mot de passe oublié ?
        </Pressable>
      </div>

      <GoldButton type="submit" disabled={submitting} className="mt-4">
        {submitting && <Loader2 size={16} className="animate-spin" />}
        SE CONNECTER
      </GoldButton>

      {error && (
        <p className="mt-2.5 flex items-start gap-1.5 text-[12.5px] text-[oklch(0.7_0.19_25)]">
          <AlertCircle size={14} className="mt-[1px] shrink-0" /> {error}
        </p>
      )}

      <div className="mt-6">
        <AuthDivider />
      </div>
      <div className="mt-3.5">
        <SocialRow />
      </div>

      <p className="mt-7 text-center text-[13px] text-muted-foreground">
        Pas encore de compte ?{" "}
        <Link to="/signup" className="font-semibold text-gold">
          Crée ton compte ›
        </Link>
      </p>
    </form>
  );
}

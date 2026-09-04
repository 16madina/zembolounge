import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2, LogOut, Mail, ShieldCheck } from "lucide-react";
import { Pressable } from "@/components/zembo/ui";
import { ZemboWordmark } from "@/components/zembo/ZemboMark";
import { zembo } from "@/lib/zembo-supabase";
import { useZemboAuth } from "@/lib/use-zembo-auth";

export const Route = createFileRoute("/connexion")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Connexion — Zembo" },
      {
        name: "description",
        content: "Connecte-toi à ton compte Zembo avec ton email et ton mot de passe.",
      },
      { property: "og:title", content: "Connexion — Zembo" },
      {
        property: "og:description",
        content: "Accède à tes lives, tables et messages avec ton compte Zembo.",
      },
    ],
  }),
  component: ConnexionScreen,
});

function ConnexionScreen() {
  const { user, loading, signOut } = useZemboAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

    setPassword("");
  }

  return (
    <div className="min-h-full px-5 pb-16 pt-[calc(env(safe-area-inset-top)+40px)]">
      <div className="flex flex-col items-center text-center">
        <ZemboWordmark />
        <p className="mt-3 text-sm text-muted-foreground">
          Talk shows, tables et jeux — avec ton compte Zembo.
        </p>
      </div>

      {loading ? (
        <div className="mt-16 flex justify-center">
          <Loader2 className="size-6 animate-spin text-gold" />
        </div>
      ) : user ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 rounded-3xl border border-border bg-surface p-6 text-center"
        >
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-gold-gradient">
            <ShieldCheck className="size-6 text-[oklch(0.16_0.02_60)]" />
          </div>
          <h1 className="mt-4 text-lg font-semibold text-foreground">Tu es connectée</h1>
          <p className="mt-1 break-all text-sm text-muted-foreground">{user.email}</p>

          <Link
            to="/"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gold-gradient px-5 py-3 text-sm font-semibold text-[oklch(0.16_0.02_60)]"
          >
            Entrer dans Zembo
            <ArrowRight className="size-4" />
          </Link>

          <Pressable
            type="button"
            onClick={() => void signOut()}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground"
          >
            <LogOut className="size-4" />
            Se déconnecter
          </Pressable>
        </motion.div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-3xl border border-border bg-surface p-5"
        >
          <h1 className="text-lg font-semibold text-foreground">Connexion</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Utilise l'email et le mot de passe de ton compte.
          </p>

          <label className="mt-5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Email
          </label>
          <div className="mt-2 flex items-center gap-2 rounded-2xl border border-border bg-background px-3">
            <Mail className="size-4 shrink-0 text-muted-foreground" />
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ton@email.com"
              className="w-full bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>

          <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Mot de passe
          </label>
          <div className="mt-2 flex items-center gap-2 rounded-2xl border border-border bg-background px-3">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <Pressable
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="shrink-0 p-1 text-muted-foreground"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </Pressable>
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-2xl border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gold-gradient px-5 py-3.5 text-sm font-semibold text-[oklch(0.16_0.02_60)] disabled:opacity-60"
          >
            {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
            Se connecter
          </button>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Tes identifiants sont vérifiés par le serveur Zembo.
          </p>
        </form>
      )}

      <div className="mt-8 text-center">
        <Link to="/" className="text-sm text-muted-foreground underline">
          Continuer sans compte
        </Link>
      </div>
    </div>
  );
}

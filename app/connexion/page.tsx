"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ConnexionPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"connexion" | "inscription">("connexion");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);
    setChargement(true);

    const { error } =
      mode === "connexion"
        ? await supabase.auth.signInWithPassword({ email, password: motDePasse })
        : await supabase.auth.signUp({ email, password: motDePasse });

    setChargement(false);

    if (error) {
      setErreur(error.message);
      return;
    }

    router.push("/compte");
  }

  return (
    <div className="max-w-sm mx-auto py-10">
      <h1 className="text-lg font-semibold mb-1">
        {mode === "connexion" ? "Connexion" : "Créer un compte"}
      </h1>
      <p className="text-sm text-ink-900/60 mb-6">
        {mode === "connexion"
          ? "Accédez à vos commandes et votre historique."
          : "Suivez vos commandes et gagnez du temps à chaque achat."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-ink-900/15 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            className="w-full rounded-md border border-ink-900/15 px-3 py-2 text-sm"
          />
        </div>

        {erreur && <p className="text-sm text-clay-600">{erreur}</p>}

        <button
          type="submit"
          disabled={chargement}
          className="w-full h-10 rounded-md bg-ink-950 text-white text-sm font-medium disabled:opacity-60"
        >
          {chargement ? "Chargement..." : mode === "connexion" ? "Se connecter" : "Créer mon compte"}
        </button>
      </form>

      <button
        onClick={() => setMode(mode === "connexion" ? "inscription" : "connexion")}
        className="text-sm underline mt-4"
      >
        {mode === "connexion" ? "Pas encore de compte ? Inscrivez-vous" : "Déjà un compte ? Connectez-vous"}
      </button>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { supabase, type ProductReviewRow } from "@/lib/supabase";

export default function ProductReviewsList({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<ProductReviewRow[]>([]);
  const [note, setNote] = useState(5);
  const [commentaire, setCommentaire] = useState("");
  const [nom, setNom] = useState("");
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function chargerAvis() {
    const { data } = await supabase
      .from("product_reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });
    if (data) setReviews(data as ProductReviewRow[]);
  }

  useEffect(() => {
    chargerAvis();
  }, [productId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnvoiEnCours(true);
    setMessage(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Connectez-vous pour laisser un avis.");
      setEnvoiEnCours(false);
      return;
    }

    const { error } = await supabase.from("product_reviews").insert({
      product_id: productId,
      client_id: user.id,
      client_nom: nom || "Client",
      note,
      commentaire,
    });

    setEnvoiEnCours(false);

    if (error) {
      setMessage("Impossible d'enregistrer votre avis pour le moment.");
      return;
    }

    setCommentaire("");
    setNom("");
    setNote(5);
    setMessage("Merci pour votre avis !");
    chargerAvis();
  }

  return (
    <div>
      <p className="text-sm font-medium mb-3">Avis clients ({reviews.length})</p>

      <div className="space-y-3 mb-6">
        {reviews.length === 0 ? (
          <p className="text-sm text-ink-900/50">Aucun avis pour l&apos;instant. Soyez le premier à donner votre avis.</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="border-b border-ink-900/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{r.client_nom}</span>
                <span className="text-clay-500 text-sm">{"★".repeat(r.note)}{"☆".repeat(5 - r.note)}</span>
              </div>
              {r.commentaire && <p className="text-sm text-ink-900/70 mt-1">{r.commentaire}</p>}
              <p className="text-xs text-ink-900/40 mt-1">
                {new Date(r.created_at).toLocaleDateString("fr-FR")}
              </p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-2 border border-ink-900/10 rounded-md p-4">
        <p className="text-sm font-medium">Laisser un avis</p>
        <input
          placeholder="Votre nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="w-full rounded-md border border-ink-900/15 px-3 py-2 text-sm"
        />
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              type="button"
              key={n}
              onClick={() => setNote(n)}
              aria-label={`${n} étoiles`}
              className={`text-lg ${n <= note ? "text-clay-500" : "text-ink-900/20"}`}
            >
              ★
            </button>
          ))}
        </div>
        <textarea
          placeholder="Votre commentaire (optionnel)"
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-ink-900/15 px-3 py-2 text-sm"
        />
        {message && <p className="text-sm text-ink-900/70">{message}</p>}
        <button
          type="submit"
          disabled={envoiEnCours}
          className="h-9 px-4 rounded-md bg-ink-950 text-white text-sm disabled:opacity-60"
        >
          {envoiEnCours ? "Envoi..." : "Publier mon avis"}
        </button>
      </form>
    </div>
  );
}

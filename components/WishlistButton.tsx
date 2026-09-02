"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function WishlistButton({ productId }: { productId: string }) {
  const [isFavori, setIsFavori] = useState(false);
  const [chargement, setChargement] = useState(false);
  const [connecte, setConnecte] = useState(true);

  useEffect(() => {
    async function verifier() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setConnecte(false);
        return;
      }

      const { data } = await supabase
        .from("wishlist")
        .select("id")
        .eq("client_id", user.id)
        .eq("product_id", productId)
        .maybeSingle();

      setIsFavori(!!data);
    }
    verifier();
  }, [productId]);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/connexion";
      return;
    }

    setChargement(true);

    if (isFavori) {
      await supabase.from("wishlist").delete().eq("client_id", user.id).eq("product_id", productId);
      setIsFavori(false);
    } else {
      await supabase.from("wishlist").insert({ client_id: user.id, product_id: productId });
      setIsFavori(true);
    }

    setChargement(false);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={chargement}
      aria-label={isFavori ? "Retirer des favoris" : "Ajouter aux favoris"}
      className={`w-8 h-8 rounded-full flex items-center justify-center border ${
        isFavori ? "bg-clay-100 border-clay-500 text-clay-600" : "bg-white border-ink-900/15 text-ink-900/40"
      }`}
    >
      {isFavori ? "♥" : "♡"}
    </button>
  );
}

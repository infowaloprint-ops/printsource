"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase, type Product } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import CategorySidebar from "@/components/CategorySidebar";

type Tri = "recent" | "prix_asc" | "prix_desc";

export default function HomePage() {
  return (
    <Suspense fallback={<p className="text-sm text-ink-900/60">Chargement...</p>}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const categorie = searchParams.get("categorie") ?? "tous";

  const [products, setProducts] = useState<Product[]>([]);
  const [tri, setTri] = useState<Tri>("recent");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      let request = supabase.from("products").select("*").eq("actif", true);

      const vueParDefaut = categorie === "tous" && !query.trim();

      if (vueParDefaut) {
        // Sans catégorie ni recherche précisée : on ne montre que la sélection
        // "en vedette", pas tout le catalogue d'un coup.
        request = request.eq("en_vedette", true);
      }
      if (categorie !== "tous") {
        request = request.eq("categorie", categorie);
      }
      if (query.trim()) {
        request = request.ilike("nom", `%${query.trim()}%`);
      }
      if (tri === "prix_asc") {
        request = request.order("prix_vente", { ascending: true });
      } else if (tri === "prix_desc") {
        request = request.order("prix_vente", { ascending: false });
      } else {
        request = request.order("created_at", { ascending: false });
      }

      const { data, error } = await request;
      if (!error && data) setProducts(data as Product[]);
      setLoading(false);
    }
    loadProducts();
  }, [categorie, tri, query]);

  const vueParDefaut = categorie === "tous" && !query.trim();

  return (
    <div className="flex gap-6">
      <CategorySidebar />

      <div className="flex-1 min-w-0">
        {!query && (
          <div className="rounded-xl bg-clay-600 text-white px-6 py-8 mb-6">
            <p className="text-xs uppercase tracking-wide text-clay-100 mb-2 font-medium">Import direct Chine</p>
            <h1 className="text-2xl font-semibold mb-2">Des produits variés au meilleur prix</h1>
            <p className="text-sm text-white/85 max-w-md">
              Impression, sécurité, emballage et plus — sans intermédiaire, livraison transparente.
            </p>
          </div>
        )}

        {query && (
          <p className="text-sm text-ink-900/60 mb-4">
            Résultats pour <span className="font-medium text-ink-950">&laquo;{query}&raquo;</span>
          </p>
        )}

        {vueParDefaut && !loading && products.length > 0 && (
          <p className="text-sm font-medium mb-3">Produits en vedette</p>
        )}

        <div className="flex items-center justify-end mb-3">
          <select
            value={tri}
            onChange={(e) => setTri(e.target.value as Tri)}
            className="text-sm border border-ink-900/15 rounded-md px-2 py-1.5 bg-white"
          >
            <option value="recent">Plus récents</option>
            <option value="prix_asc">Prix croissant</option>
            <option value="prix_desc">Prix décroissant</option>
          </select>
        </div>

        {loading ? (
          <p className="text-sm text-ink-900/60">Chargement du catalogue...</p>
        ) : products.length === 0 ? (
          <p className="text-sm text-ink-900/60">
            {vueParDefaut
              ? "Aucun produit en vedette pour l'instant. Parcours une catégorie dans le menu pour voir tout le catalogue."
              : "Aucun article ne correspond à cette recherche."}
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

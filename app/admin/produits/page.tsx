"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase, type Product } from "@/lib/supabase";

function formatFcfa(n: number) {
  return Math.round(n).toLocaleString("fr-FR") + " FCFA";
}

export default function AdminProduitsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);

  async function charger() {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts((data as Product[]) ?? []);
  }

  useEffect(() => {
    charger();
  }, []);

  async function toggleActif(product: Product) {
    await supabase.from("products").update({ actif: !product.actif }).eq("id", product.id);
    charger();
  }

  async function supprimer(product: Product) {
    if (!confirm(`Supprimer "${product.nom}" définitivement ?`)) return;
    await supabase.from("products").delete().eq("id", product.id);
    charger();
  }

  if (products === null) return <p className="text-sm text-ink-900/60">Chargement...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Produits ({products.length})</h1>
        <Link
          href="/admin/produits/nouveau"
          className="h-9 px-4 rounded-md bg-ink-950 text-white text-sm flex items-center"
        >
          + Nouveau produit
        </Link>
      </div>

      <div className="space-y-2">
        {products.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between border border-ink-900/10 rounded-md p-3"
          >
            <div>
              <p className="text-sm font-medium">{p.nom}</p>
              <p className="text-xs text-ink-900/50">
                {p.categorie} · {formatFcfa(p.prix_vente)} · MOQ {p.moq}
                {!p.actif && <span className="text-clay-600"> · Inactif</span>}
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <button onClick={() => toggleActif(p)} className="underline">
                {p.actif ? "Désactiver" : "Activer"}
              </button>
              <Link href={`/admin/produits/${p.id}`} className="underline">
                Modifier
              </Link>
              <button onClick={() => supprimer(p)} className="text-clay-600 underline">
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

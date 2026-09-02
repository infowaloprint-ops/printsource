"use client";

import { useEffect, useState } from "react";
import { supabase, type Product } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";

export default function RelatedProducts({
  categorie,
  excludeId,
}: {
  categorie: string;
  excludeId: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("categorie", categorie)
      .eq("actif", true)
      .neq("id", excludeId)
      .limit(4)
      .then(({ data }) => setProducts((data as Product[]) ?? []));
  }, [categorie, excludeId]);

  if (products.length === 0) return null;

  return (
    <div>
      <p className="text-sm font-medium mb-3">Produits similaires</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

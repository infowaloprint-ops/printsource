"use client";

import { useEffect, useState } from "react";
import { supabase, type Product } from "@/lib/supabase";
import ProductForm from "@/components/ProductForm";

export default function EditProduitPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("id", params.id)
      .single()
      .then(({ data }) => setProduct(data as Product));
  }, [params.id]);

  if (!product) return <p className="text-sm text-ink-900/60">Chargement...</p>;

  return (
    <div>
      <h1 className="text-lg font-semibold mb-4">Modifier : {product.nom}</h1>
      <ProductForm produitExistant={product} />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { supabase, type Product } from "@/lib/supabase";
import ShippingCalculator from "@/components/ShippingCalculator";
import ProductVariants from "@/components/ProductVariants";
import TrustBadges from "@/components/TrustBadges";
import ProductCharacteristics from "@/components/ProductCharacteristics";
import ProductImageCarousel from "@/components/ProductImageCarousel";
import ProductReviewsList from "@/components/ProductReviewsList";
import WishlistButton from "@/components/WishlistButton";
import RelatedProducts from "@/components/RelatedProducts";

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("id", params.id)
      .single()
      .then(({ data }) => setProduct(data as Product));
  }, [params.id]);

  if (!product) return <p className="text-sm text-ink-900/60">Chargement du produit...</p>;

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <ProductImageCarousel
          images={product.images && product.images.length > 0 ? product.images : product.image_url ? [product.image_url] : []}
          nom={product.nom}
        />

        <div>
          <p className="text-sm text-ink-900/60">{product.categorie}</p>
          <div className="flex items-start justify-between gap-2">
            <h1 className="text-xl font-semibold mb-2">{product.nom}</h1>
            <WishlistButton productId={product.id} />
          </div>
          <p className="text-2xl font-semibold mb-1">
            {Math.round(product.prix_vente).toLocaleString("fr-FR")} FCFA
          </p>
          {product.prix_marche_reference && (
            <p className="text-sm text-ink-900/40 line-through mb-4">
              {Math.round(product.prix_marche_reference).toLocaleString("fr-FR")} FCFA
            </p>
          )}

          {product.variantes && product.variantes.length > 0 && (
            <div className="mb-6">
              <ProductVariants groups={product.variantes} />
            </div>
          )}

          <div className="mt-6">
            <ShippingCalculator product={product} />
          </div>

          <a
            href={`https://wa.me/?text=${encodeURIComponent("Bonjour, j'ai une question sur : " + product.nom)}`}
            className="mt-3 flex items-center justify-center gap-2 h-10 rounded-md border border-ink-900/15 text-sm"
          >
            Une question ? Écrire sur WhatsApp
          </a>
        </div>
      </div>

      <TrustBadges />

      {product.caracteristiques && product.caracteristiques.length > 0 && (
        <ProductCharacteristics items={product.caracteristiques} />
      )}

      <ProductReviewsList productId={product.id} />

      <RelatedProducts categorie={product.categorie} excludeId={product.id} />
    </div>
  );
}

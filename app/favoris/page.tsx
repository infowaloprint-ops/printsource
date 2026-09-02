"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, type Product } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";

export default function FavorisPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/connexion");
        return;
      }

      const { data: wishlistRows } = await supabase
        .from("wishlist")
        .select("product_id")
        .eq("client_id", user.id);

      const productIds = (wishlistRows ?? []).map((w) => w.product_id);

      if (productIds.length === 0) {
        setProducts([]);
        return;
      }

      const { data: productsData } = await supabase.from("products").select("*").in("id", productIds);
      setProducts((productsData as Product[]) ?? []);
    }
    load();
  }, [router]);

  if (products === null) {
    return <p className="text-sm text-ink-900/60">Chargement...</p>;
  }

  return (
    <div>
      <h1 className="text-lg font-semibold mb-4">Mes favoris</h1>
      {products.length === 0 ? (
        <p className="text-sm text-ink-900/60">Vous n&apos;avez pas encore ajouté de favoris.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

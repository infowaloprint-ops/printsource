import Link from "next/link";
import type { Product } from "@/lib/supabase";
import WishlistButton from "@/components/WishlistButton";

function formatFcfa(n: number) {
  return Math.round(n).toLocaleString("fr-FR") + " FCFA";
}

export default function ProductCard({ product }: { product: Product }) {
  const reduction =
    product.prix_marche_reference && product.prix_marche_reference > product.prix_vente
      ? Math.round(100 - (product.prix_vente / product.prix_marche_reference) * 100)
      : null;

  return (
    <Link
      href={`/produits/${product.id}`}
      className="block rounded-lg border border-ink-900/10 bg-white overflow-hidden hover:border-ink-900/25 transition-colors"
    >
      <div className="relative h-28 bg-paper flex items-center justify-center">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image_url} alt={product.nom} className="h-full w-full object-cover" />
        ) : (
          <span className="text-ink-900/30 text-xs">Photo à venir</span>
        )}
        {reduction && (
          <span className="absolute top-2 left-2 bg-clay-100 text-clay-600 text-xs px-2 py-0.5 rounded">
            -{reduction}%
          </span>
        )}
        <div className="absolute top-2 right-2">
          <WishlistButton productId={product.id} />
        </div>
      </div>
      <div className="p-3">
        <p className="text-sm leading-snug min-h-[2.5rem]">{product.nom}</p>
        <p className="text-base font-semibold mt-1">{formatFcfa(product.prix_vente)}</p>
      </div>
    </Link>
  );
}

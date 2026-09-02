"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useCartTotals } from "@/lib/use-cart-totals";

function formatFcfa(n: number) {
  return Math.round(n).toLocaleString("fr-FR") + " FCFA";
}

export default function PanierPage() {
  const { updateQuantite, removeItem } = useCart();
  const {
    items,
    rates,
    selectedMode,
    setSelectedMode,
    poidsTotal,
    volumeTotal,
    totalProduits,
    totalFret,
    montantTotal,
    moqNonRespecte,
  } = useCartTotals();

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-ink-900/60 mb-4">Votre panier est vide.</p>
        <Link href="/" className="text-sm underline">
          Retourner au catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-[1fr_320px] gap-8">
      <div className="space-y-3">
        <h1 className="text-lg font-semibold mb-2">Votre panier</h1>

        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center justify-between border border-ink-900/10 rounded-md p-3"
          >
            <div>
              <p className="text-sm font-medium">{item.nom}</p>
              <p className="text-xs text-ink-900/50">Minimum : {item.moq}</p>
              {item.quantite < item.moq && (
                <p className="text-xs text-clay-600 mt-1">
                  Quantité en dessous du minimum requis ({item.moq})
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  aria-label="Diminuer"
                  onClick={() => updateQuantite(item.productId, item.quantite - 1)}
                  className="w-7 h-7 rounded border border-ink-900/20"
                >
                  −
                </button>
                <span className="text-sm w-6 text-center">{item.quantite}</span>
                <button
                  aria-label="Augmenter"
                  onClick={() => updateQuantite(item.productId, item.quantite + 1)}
                  className="w-7 h-7 rounded border border-ink-900/20"
                >
                  +
                </button>
              </div>
              <p className="text-sm font-medium w-24 text-right">
                {formatFcfa(item.prixVente * item.quantite)}
              </p>
              <button
                onClick={() => removeItem(item.productId)}
                aria-label="Retirer l'article"
                className="text-ink-900/40 text-sm"
              >
                Retirer
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border border-ink-900/10 rounded-lg p-4 h-fit space-y-4">
        <p className="text-sm font-medium">Mode de livraison</p>
        <div className="space-y-2">
          {rates.map((rate) => {
            const coutUnitaire = rate.cout_reel + rate.marge_fixe;
            const cout = coutUnitaire * (rate.unite === "cbm" ? volumeTotal : poidsTotal);
            const isActive = rate.mode === selectedMode;
            return (
              <label
                key={rate.mode}
                className={`flex items-center justify-between rounded-md border px-3 py-2 cursor-pointer ${
                  isActive ? "border-clay-500 bg-clay-100" : "border-ink-900/15"
                }`}
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="fret-panier"
                    checked={isActive}
                    onChange={() => setSelectedMode(rate.mode)}
                  />
                  <span>
                    <span className="block text-sm capitalize">{rate.mode}</span>
                    <span className="block text-xs text-ink-900/60">{rate.delai_estime}</span>
                  </span>
                </span>
                <span className="text-sm font-medium">{formatFcfa(cout)}</span>
              </label>
            );
          })}
        </div>

        <div className="border-t border-ink-900/10 pt-3 space-y-1">
          <div className="flex justify-between text-sm text-ink-900/70">
            <span>Produits</span>
            <span>{formatFcfa(totalProduits)}</span>
          </div>
          <div className="flex justify-between text-sm text-ink-900/70">
            <span>Fret</span>
            <span>{formatFcfa(totalFret)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatFcfa(montantTotal)}</span>
          </div>
        </div>

        {moqNonRespecte.length > 0 ? (
          <p className="text-xs text-clay-600">
            Ajustez les quantités en dessous du minimum requis avant de passer commande.
          </p>
        ) : (
          <Link
            href="/checkout"
            className="block text-center w-full h-10 leading-10 rounded-md bg-ink-950 text-white text-sm font-medium"
          >
            Passer commande
          </Link>
        )}
      </div>
    </div>
  );
}

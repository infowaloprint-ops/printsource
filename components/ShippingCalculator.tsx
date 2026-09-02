"use client";

import { useEffect, useState } from "react";
import { supabase, type Product, type ShippingRate } from "@/lib/supabase";
import { useCart } from "@/lib/cart-context";

function formatFcfa(n: number) {
  return Math.round(n).toLocaleString("fr-FR") + " FCFA";
}

export default function ShippingCalculator({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [selectedMode, setSelectedMode] = useState<string>("aerien");
  const [quantite, setQuantite] = useState(product.moq);
  const [ajoute, setAjoute] = useState(false);

  useEffect(() => {
    supabase
      .from("shipping_rates")
      .select("*")
      .then(({ data }) => {
        if (data) {
          setRates(data as ShippingRate[]);
          if (data.length > 0) setSelectedMode(data[0].mode);
        }
      });
  }, []);

  function coutFret(rate: ShippingRate) {
    const coutUnitaire = rate.cout_reel + rate.marge_fixe;
    if (rate.unite === "cbm") {
      return coutUnitaire * product.volume_unitaire * quantite;
    }
    return coutUnitaire * product.poids_unitaire * quantite;
  }

  const rateActif = rates.find((r) => r.mode === selectedMode);
  const totalProduits = product.prix_vente * quantite;
  const totalFret = rateActif ? coutFret(rateActif) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-paper rounded-md px-3 py-2">
        <span className="text-sm">Quantité</span>
        <div className="flex items-center gap-3">
          <button
            aria-label="Diminuer"
            onClick={() => setQuantite((q) => Math.max(product.moq, q - 1))}
            className="w-7 h-7 rounded border border-ink-900/20"
          >
            −
          </button>
          <span className="text-sm font-medium w-6 text-center">{quantite}</span>
          <button
            aria-label="Augmenter"
            onClick={() => setQuantite((q) => q + 1)}
            className="w-7 h-7 rounded border border-ink-900/20"
          >
            +
          </button>
        </div>
      </div>
      <p className="text-xs text-ink-900/50 -mt-2">Minimum de commande : {product.moq}</p>

      <p className="text-sm font-medium">Mode de livraison</p>
      <div className="space-y-2">
        {rates.map((rate) => {
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
                  name="fret"
                  checked={isActive}
                  onChange={() => setSelectedMode(rate.mode)}
                />
                <span>
                  <span className="block text-sm capitalize">{rate.mode}</span>
                  <span className="block text-xs text-ink-900/60">{rate.delai_estime}</span>
                </span>
              </span>
              <span className="text-sm font-medium">{formatFcfa(coutFret(rate))}</span>
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
          <span>{formatFcfa(totalProduits + totalFret)}</span>
        </div>
      </div>

      <button
        onClick={() => {
          addItem(
            {
              productId: product.id,
              nom: product.nom,
              prixVente: product.prix_vente,
              poidsUnitaire: product.poids_unitaire,
              volumeUnitaire: product.volume_unitaire,
              moq: product.moq,
            },
            quantite
          );
          setAjoute(true);
          setTimeout(() => setAjoute(false), 2000);
        }}
        className="w-full h-10 rounded-md bg-ink-950 text-white text-sm font-medium"
      >
        {ajoute ? "Ajouté au panier" : "Ajouter au panier"}
      </button>
    </div>
  );
}

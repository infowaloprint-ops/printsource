"use client";

import { useEffect, useState } from "react";
import { supabase, type ShippingRate } from "@/lib/supabase";
import { useCart } from "@/lib/cart-context";

export function useCartTotals() {
  const { items, selectedMode, setSelectedMode } = useCart();
  const [rates, setRates] = useState<ShippingRate[]>([]);

  useEffect(() => {
    supabase
      .from("shipping_rates")
      .select("*")
      .then(({ data }) => {
        if (data) setRates(data as ShippingRate[]);
      });
  }, []);

  const poidsTotal = items.reduce((sum, i) => sum + i.poidsUnitaire * i.quantite, 0);
  const volumeTotal = items.reduce((sum, i) => sum + i.volumeUnitaire * i.quantite, 0);
  const totalProduits = items.reduce((sum, i) => sum + i.prixVente * i.quantite, 0);

  const rateActif = rates.find((r) => r.mode === selectedMode);
  const totalFret = rateActif
    ? (rateActif.cout_reel + rateActif.marge_fixe) *
      (rateActif.unite === "cbm" ? volumeTotal : poidsTotal)
    : 0;

  const moqNonRespecte = items.filter((i) => i.quantite < i.moq);

  return {
    items,
    rates,
    selectedMode,
    setSelectedMode,
    poidsTotal,
    volumeTotal,
    totalProduits,
    totalFret,
    montantTotal: totalProduits + totalFret,
    delaiEstime: rateActif?.delai_estime,
    moqNonRespecte,
  };
}

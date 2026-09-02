"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

function formatFcfa(n: number) {
  return Math.round(n).toLocaleString("fr-FR") + " FCFA";
}

const ETAPES = [
  { id: "en_attente_paiement", label: "Commande créée" },
  { id: "paye", label: "Paiement reçu" },
  { id: "commande_en_chine", label: "Commandé chez le fournisseur" },
  { id: "expedie", label: "Expédié depuis la Chine" },
  { id: "arrive_dakar", label: "Arrivé à Dakar" },
  { id: "dedouane", label: "Dédouané" },
  { id: "livre", label: "Livré" },
];

type Order = {
  id: string;
  statut: string;
  montant_produits: number;
  prix_fret: number;
  montant_total: number;
  mode_fret: string;
  delai_estime: string | null;
  ville_client: string;
};

export default function CommandePage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    supabase
      .from("orders")
      .select("*")
      .eq("id", params.id)
      .single()
      .then(({ data }) => setOrder(data as Order));
  }, [params.id]);

  if (!order) return <p className="text-sm text-ink-900/60">Chargement de la commande...</p>;

  const etapeActive = ETAPES.findIndex((e) => e.id === order.statut);

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Commande #{order.id.slice(0, 8)}</h1>
        <p className="text-sm text-ink-900/60">Merci pour votre commande.</p>
      </div>

      <div className="space-y-3">
        {ETAPES.map((etape, i) => (
          <div key={etape.id} className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full flex-shrink-0 ${
                i <= etapeActive ? "bg-ink-950" : "bg-ink-900/15"
              }`}
            />
            <p className={`text-sm ${i <= etapeActive ? "text-ink-950" : "text-ink-900/40"}`}>
              {etape.label}
            </p>
          </div>
        ))}
      </div>

      <div className="border border-ink-900/10 rounded-lg p-4 space-y-1">
        <div className="flex justify-between text-sm text-ink-900/70">
          <span>Produits</span>
          <span>{formatFcfa(order.montant_produits)}</span>
        </div>
        <div className="flex justify-between text-sm text-ink-900/70">
          <span>Fret ({order.mode_fret})</span>
          <span>{formatFcfa(order.prix_fret)}</span>
        </div>
        <div className="flex justify-between text-base font-semibold pt-1">
          <span>Total</span>
          <span>{formatFcfa(order.montant_total)}</span>
        </div>
        {order.delai_estime && (
          <p className="text-xs text-ink-900/50 pt-2">Délai estimé : {order.delai_estime}</p>
        )}
      </div>

      {order.statut === "en_attente_paiement" && (
        <p className="text-sm text-clay-600">
          En attente de confirmation de votre paiement. Vous recevrez une notification WhatsApp dès
          réception.
        </p>
      )}
    </div>
  );
}

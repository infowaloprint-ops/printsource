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

const LABELS_PAIEMENT: Record<string, string> = {
  wave: "Wave",
  orange_money: "Orange Money",
};

type Order = {
  id: string;
  statut: string;
  client_nom: string;
  client_telephone: string;
  ville_client: string;
  region_client: string | null;
  montant_produits: number;
  prix_fret: number;
  reduction_appliquee: number | null;
  code_promo: string | null;
  montant_total: number;
  mode_fret: string;
  mode_paiement: string | null;
  delai_estime: string | null;
  created_at: string;
};

type LigneCommande = {
  id: string;
  quantite: number;
  prix_unitaire: number;
  products: { nom: string } | null;
};

export default function CommandePage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [lignes, setLignes] = useState<LigneCommande[]>([]);

  useEffect(() => {
    supabase
      .from("orders")
      .select("*")
      .eq("id", params.id)
      .single()
      .then(({ data }) => setOrder(data as Order));

    supabase
      .from("order_items")
      .select("id, quantite, prix_unitaire, products(nom)")
      .eq("order_id", params.id)
      .then(({ data }) => setLignes((data as unknown as LigneCommande[]) ?? []));
  }, [params.id]);

  if (!order) return <p className="text-sm text-ink-900/60">Chargement de la commande...</p>;

  const etapeActive = ETAPES.findIndex((e) => e.id === order.statut);

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="no-print flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Commande #{order.id.slice(0, 8)}</h1>
          <p className="text-sm text-ink-900/60">Merci pour votre commande.</p>
        </div>
        <button
          onClick={() => window.print()}
          className="text-sm border border-ink-900/15 rounded-md px-3 py-1.5"
        >
          Télécharger le reçu
        </button>
      </div>

      <div className="no-print space-y-3">
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

      {order.statut === "en_attente_paiement" && (
        <p className="no-print text-sm text-clay-600">
          En attente de confirmation de votre paiement. Vous recevrez une notification WhatsApp dès
          réception.
        </p>
      )}

      {/* Reçu — visible à l'écran et à l'impression/téléchargement */}
      <div className="border border-ink-900/10 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-ink-900/10">
          <div>
            <p className="text-lg font-semibold text-clay-600">SourceTeranga</p>
            <p className="text-xs text-ink-900/50">Reçu de commande</p>
          </div>
          <div className="text-right text-xs text-ink-900/60">
            <p>Commande #{order.id.slice(0, 8)}</p>
            <p>{new Date(order.created_at).toLocaleDateString("fr-FR", {
              day: "2-digit", month: "long", year: "numeric",
            })}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <p className="text-xs text-ink-900/50 mb-1">Client</p>
            <p>{order.client_nom}</p>
            <p className="text-ink-900/60">{order.client_telephone}</p>
          </div>
          <div>
            <p className="text-xs text-ink-900/50 mb-1">Livraison</p>
            <p>{order.ville_client}</p>
            {order.region_client && <p className="text-ink-900/60">{order.region_client}</p>}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs text-ink-900/50 mb-2">Articles</p>
          <div className="space-y-1.5">
            {lignes.map((ligne) => (
              <div key={ligne.id} className="flex justify-between text-sm">
                <span>
                  {ligne.products?.nom ?? "Article"} × {ligne.quantite}
                </span>
                <span>{formatFcfa(ligne.prix_unitaire * ligne.quantite)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-1 pt-3 border-t border-ink-900/10">
          <div className="flex justify-between text-sm text-ink-900/70">
            <span>Sous-total produits</span>
            <span>{formatFcfa(order.montant_produits)}</span>
          </div>
          <div className="flex justify-between text-sm text-ink-900/70">
            <span>Fret ({order.mode_fret})</span>
            <span>{formatFcfa(order.prix_fret)}</span>
          </div>
          {order.reduction_appliquee ? (
            <div className="flex justify-between text-sm text-green-700">
              <span>Réduction {order.code_promo ? `(${order.code_promo})` : ""}</span>
              <span>-{formatFcfa(order.reduction_appliquee)}</span>
            </div>
          ) : null}
          <div className="flex justify-between text-base font-semibold pt-1">
            <span>Total payé</span>
            <span>{formatFcfa(order.montant_total)}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-ink-900/10 text-sm text-ink-900/70">
          <div className="flex justify-between">
            <span>Mode de paiement</span>
            <span>{order.mode_paiement ? LABELS_PAIEMENT[order.mode_paiement] : "—"}</span>
          </div>
          {order.delai_estime && (
            <div className="flex justify-between mt-1">
              <span>Délai de livraison estimé</span>
              <span>{order.delai_estime}</span>
            </div>
          )}
        </div>

        <p className="text-xs text-ink-900/40 text-center mt-5 pt-3 border-t border-ink-900/10">
          Merci pour votre confiance — SourceTeranga
        </p>
      </div>
    </div>
  );
}

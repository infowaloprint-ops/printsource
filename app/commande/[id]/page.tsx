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
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="no-print flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Commande #{order.id.slice(0, 8)}</h1>
          <p className="text-sm text-ink-900/60">Merci pour votre commande.</p>
        </div>
        <button
          onClick={() => window.print()}
          className="text-sm border border-ink-900/15 rounded-md px-3 py-1.5 hover:bg-paper"
        >
          Télécharger le reçu
        </button>
      </div>

      <div className="no-print flex items-center gap-2 overflow-x-auto pb-1">
        {ETAPES.map((etape, i) => (
          <div key={etape.id} className="flex items-center gap-2 shrink-0">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                i <= etapeActive ? "bg-ink-950 text-white" : "bg-ink-900/10 text-ink-900/30"
              }`}
            >
              {i < etapeActive ? "✓" : i + 1}
            </div>
            <p className={`text-xs whitespace-nowrap ${i <= etapeActive ? "text-ink-950" : "text-ink-900/35"}`}>
              {etape.label}
            </p>
            {i < ETAPES.length - 1 && <div className="w-4 h-px bg-ink-900/10 shrink-0" />}
          </div>
        ))}
      </div>

      {order.statut === "en_attente_paiement" && (
        <p className="no-print text-sm text-clay-600">
          En attente de confirmation de votre paiement. Vous recevrez une notification WhatsApp dès
          réception.
        </p>
      )}

      {/* ============ REÇU — visible à l'écran et à l'impression ============ */}
      <div className="border border-ink-900/10 rounded-xl overflow-hidden bg-white shadow-sm print:shadow-none print:border-0">
        {/* En-tête */}
        <div className="bg-clay-600 px-6 py-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center font-semibold text-lg">
              S
            </div>
            <div>
              <p className="font-semibold leading-tight">SourceTeranga</p>
              <p className="text-xs text-white/75">Reçu de commande</p>
            </div>
          </div>
          <div className="text-right text-xs text-white/85">
            <p className="font-medium">#{order.id.slice(0, 8).toUpperCase()}</p>
            <p>
              {new Date(order.created_at).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Client & livraison */}
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-ink-900/40 mb-1.5">Facturé à</p>
              <p className="font-medium">{order.client_nom}</p>
              <p className="text-ink-900/60">{order.client_telephone}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-ink-900/40 mb-1.5">Livraison</p>
              <p className="font-medium">{order.ville_client}</p>
              {order.region_client && <p className="text-ink-900/60">{order.region_client}</p>}
            </div>
          </div>

          {/* Tableau articles */}
          <div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wide text-ink-900/40 border-b border-ink-900/10">
                  <th className="text-left font-medium pb-2">Article</th>
                  <th className="text-center font-medium pb-2">Qté</th>
                  <th className="text-right font-medium pb-2">Prix unit.</th>
                  <th className="text-right font-medium pb-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {lignes.map((ligne) => (
                  <tr key={ligne.id} className="border-b border-ink-900/5">
                    <td className="py-2">{ligne.products?.nom ?? "Article"}</td>
                    <td className="py-2 text-center text-ink-900/60">{ligne.quantite}</td>
                    <td className="py-2 text-right text-ink-900/60">{formatFcfa(ligne.prix_unitaire)}</td>
                    <td className="py-2 text-right font-medium">
                      {formatFcfa(ligne.prix_unitaire * ligne.quantite)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totaux */}
          <div className="flex justify-end">
            <div className="w-full max-w-[240px] space-y-1.5 text-sm">
              <div className="flex justify-between text-ink-900/70">
                <span>Sous-total</span>
                <span>{formatFcfa(order.montant_produits)}</span>
              </div>
              <div className="flex justify-between text-ink-900/70">
                <span>Fret ({order.mode_fret})</span>
                <span>{formatFcfa(order.prix_fret)}</span>
              </div>
              {order.reduction_appliquee ? (
                <div className="flex justify-between text-green-700">
                  <span>Réduction {order.code_promo ? `(${order.code_promo})` : ""}</span>
                  <span>-{formatFcfa(order.reduction_appliquee)}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-base font-semibold pt-2 border-t border-ink-900/10">
                <span>Total payé</span>
                <span>{formatFcfa(order.montant_total)}</span>
              </div>
            </div>
          </div>

          {/* Paiement & livraison */}
          <div className="grid grid-cols-2 gap-6 text-sm pt-4 border-t border-ink-900/10">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-ink-900/40 mb-1">Mode de paiement</p>
              <p>{order.mode_paiement ? LABELS_PAIEMENT[order.mode_paiement] : "—"}</p>
            </div>
            {order.delai_estime && (
              <div>
                <p className="text-[11px] uppercase tracking-wide text-ink-900/40 mb-1">Délai estimé</p>
                <p>{order.delai_estime}</p>
              </div>
            )}
          </div>
        </div>

        {/*
          Pied de page légal — à compléter dès que le NINEA/RCCM et la raison
          sociale officielle sont confirmés (entreprise individuelle).
          Exemple à activer plus tard :
          <p>NINEA XXXXXXX · RCCM SN-DKR-XXXX-X-XXXX · [Nom légal de l'entreprise]</p>
        */}
        <div className="bg-paper px-6 py-4 text-center">
          <p className="text-xs text-ink-900/40">Merci pour votre confiance — SourceTeranga</p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

function formatFcfa(n: number) {
  return Math.round(n).toLocaleString("fr-FR") + " FCFA";
}

const STATUTS = [
  "en_attente_paiement",
  "paye",
  "commande_en_chine",
  "expedie",
  "arrive_dakar",
  "dedouane",
  "livre",
  "annule",
];

const LABELS: Record<string, string> = {
  en_attente_paiement: "En attente de paiement",
  paye: "Paiement reçu",
  commande_en_chine: "Commandé chez le fournisseur",
  expedie: "Expédié depuis la Chine",
  arrive_dakar: "Arrivé à Dakar",
  dedouane: "Dédouané",
  livre: "Livré",
  annule: "Annulé",
};

type Order = {
  id: string;
  client_nom: string;
  client_telephone: string;
  ville_client: string;
  statut: string;
  montant_total: number;
  mode_fret: string;
  created_at: string;
};

export default function AdminCommandesPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);

  async function charger() {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders((data as Order[]) ?? []);
  }

  useEffect(() => {
    charger();
  }, []);

  async function changerStatut(orderId: string, nouveauStatut: string) {
    const updates: Record<string, unknown> = { statut: nouveauStatut };
    if (nouveauStatut === "livre") updates.date_livraison = new Date().toISOString();
    if (nouveauStatut === "paye") updates.date_paiement = new Date().toISOString();

    await supabase.from("orders").update(updates).eq("id", orderId);
    charger();
  }

  if (orders === null) return <p className="text-sm text-ink-900/60">Chargement...</p>;

  return (
    <div>
      <h1 className="text-lg font-semibold mb-4">Commandes ({orders.length})</h1>

      <div className="space-y-2">
        {orders.length === 0 ? (
          <p className="text-sm text-ink-900/60">Aucune commande pour l&apos;instant.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="border border-ink-900/10 rounded-md p-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium">
                    #{order.id.slice(0, 8)} — {order.client_nom}
                  </p>
                  <p className="text-xs text-ink-900/50">
                    {order.client_telephone} · {order.ville_client} ·{" "}
                    {new Date(order.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <p className="text-sm font-medium">{formatFcfa(order.montant_total)}</p>
              </div>

              <select
                value={order.statut}
                onChange={(e) => changerStatut(order.id, e.target.value)}
                className="text-sm border border-ink-900/15 rounded-md px-2 py-1.5"
              >
                {STATUTS.map((s) => (
                  <option key={s} value={s}>
                    {LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

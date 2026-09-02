"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

function formatFcfa(n: number) {
  return Math.round(n).toLocaleString("fr-FR") + " FCFA";
}

const LABELS_STATUT: Record<string, string> = {
  en_attente_paiement: "En attente de paiement",
  paye: "Paiement reçu",
  commande_en_chine: "Commandé chez le fournisseur",
  expedie: "Expédié depuis la Chine",
  arrive_dakar: "Arrivé à Dakar",
  dedouane: "Dédouané",
  livre: "Livré",
};

type Order = {
  id: string;
  statut: string;
  montant_total: number;
  created_at: string;
};

export default function ComptePage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/connexion");
        return;
      }

      setEmail(user.email ?? null);

      const { data } = await supabase
        .from("orders")
        .select("id, statut, montant_total, created_at")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });

      setOrders((data as Order[]) ?? []);
    }
    load();
  }, [router]);

  async function handleDeconnexion() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (orders === null) {
    return <p className="text-sm text-ink-900/60">Chargement...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Mon compte</h1>
          {email && <p className="text-sm text-ink-900/60">{email}</p>}
        </div>
        <button onClick={handleDeconnexion} className="text-sm underline">
          Se déconnecter
        </button>
      </div>

      <div>
        <p className="text-sm font-medium mb-3">Mes commandes</p>

        {orders.length === 0 ? (
          <p className="text-sm text-ink-900/60">Vous n'avez pas encore passé de commande.</p>
        ) : (
          <div className="space-y-2">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/commande/${order.id}`}
                className="flex items-center justify-between border border-ink-900/10 rounded-md p-3 hover:border-ink-900/25"
              >
                <div>
                  <p className="text-sm font-medium">Commande #{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-ink-900/50">
                    {new Date(order.created_at).toLocaleDateString("fr-FR")} ·{" "}
                    {LABELS_STATUT[order.statut] ?? order.statut}
                  </p>
                </div>
                <p className="text-sm font-medium">{formatFcfa(order.montant_total)}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

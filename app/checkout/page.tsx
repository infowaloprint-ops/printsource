"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, type PromoCode } from "@/lib/supabase";
import { useCart } from "@/lib/cart-context";
import { useCartTotals } from "@/lib/use-cart-totals";

function formatFcfa(n: number) {
  return Math.round(n).toLocaleString("fr-FR") + " FCFA";
}

const REGIONS_SENEGAL = [
  "Dakar",
  "Thiès",
  "Saint-Louis",
  "Kaolack",
  "Ziguinchor",
  "Diourbel",
  "Louga",
  "Fatick",
  "Kolda",
  "Tambacounda",
  "Kaffrine",
  "Kédougou",
  "Matam",
  "Sédhiou",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { clearCart } = useCart();
  const { items, selectedMode, totalProduits, totalFret, montantTotal, delaiEstime, moqNonRespecte } =
    useCartTotals();

  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [ville, setVille] = useState("Dakar");
  const [adresse, setAdresse] = useState("");
  const [modePaiement, setModePaiement] = useState<"wave" | "orange_money">("wave");
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [codePromo, setCodePromo] = useState("");
  const [codeApplique, setCodeApplique] = useState<PromoCode | null>(null);
  const [erreurPromo, setErreurPromo] = useState<string | null>(null);
  const [verifPromoEnCours, setVerifPromoEnCours] = useState(false);

  const reduction = codeApplique
    ? codeApplique.type === "pourcentage"
      ? (totalProduits * codeApplique.valeur) / 100
      : Math.min(codeApplique.valeur, totalProduits)
    : 0;
  const montantTotalAvecPromo = montantTotal - reduction;

  async function appliquerCodePromo() {
    setErreurPromo(null);
    setVerifPromoEnCours(true);

    const { data, error } = await supabase
      .from("promo_codes")
      .select("*")
      .eq("code", codePromo.trim().toUpperCase())
      .eq("actif", true)
      .single();

    setVerifPromoEnCours(false);

    if (error || !data) {
      setErreurPromo("Code promo invalide ou expiré.");
      setCodeApplique(null);
      return;
    }

    const promo = data as PromoCode;

    if (promo.date_expiration && new Date(promo.date_expiration) < new Date()) {
      setErreurPromo("Ce code promo a expiré.");
      setCodeApplique(null);
      return;
    }
    if (promo.usage_max != null && promo.usage_actuel >= promo.usage_max) {
      setErreurPromo("Ce code promo a atteint sa limite d'utilisation.");
      setCodeApplique(null);
      return;
    }

    setCodeApplique(promo);
  }

  if (items.length === 0) {
    return <p className="text-sm text-ink-900/60">Votre panier est vide.</p>;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);

    if (moqNonRespecte.length > 0) {
      setErreur("Certains articles n'atteignent pas la quantité minimum requise.");
      return;
    }
    if (!nom || !telephone || !adresse) {
      setErreur("Merci de remplir tous les champs.");
      return;
    }

    setEnvoiEnCours(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          client_id: user?.id ?? null,
          client_nom: nom,
          client_telephone: telephone,
          client_email: user?.email ?? null,
          ville_client: ville,
          adresse_client: adresse,
          region_client: ville === "Dakar" ? null : ville,
          mode_fret: selectedMode,
          mode_paiement: modePaiement,
          montant_produits: totalProduits,
          prix_fret: totalFret,
          montant_total: montantTotalAvecPromo,
          code_promo: codeApplique?.code ?? null,
          reduction_appliquee: reduction || null,
          delai_estime: delaiEstime,
          statut: "en_attente_paiement",
        })
        .select()
        .single();

      if (error) throw error;

      const orderItemsPayload = items.map((i) => ({
        order_id: order.id,
        product_id: i.productId,
        quantite: i.quantite,
      }));
      const { error: itemsError } = await supabase.from("order_items").insert(orderItemsPayload);
      if (itemsError) throw itemsError;

      if (codeApplique) {
        await supabase
          .from("promo_codes")
          .update({ usage_actuel: codeApplique.usage_actuel + 1 })
          .eq("code", codeApplique.code);
      }

      // Déclenche le workflow n8n "Nouvelle commande" (notifications, calcul fret, etc.)
      // Si NEXT_PUBLIC_N8N_WEBHOOK_NOUVELLE_COMMANDE n'est pas encore configuré (n8n pas
      // encore en ligne), cet appel échoue silencieusement — la commande reste créée
      // normalement dans Supabase, ce n'est jamais bloquant pour le client.
      const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_NOUVELLE_COMMANDE;
      if (webhookUrl) {
        try {
          await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              order_id: order.id,
              client_telephone: telephone,
              client_email: user?.email ?? null,
              mode_fret: selectedMode,
            }),
          });
        } catch (webhookErr) {
          console.error("Webhook n8n indisponible :", webhookErr);
        }
      }

      clearCart();
      router.push(`/commande/${order.id}`);
    } catch (err) {
      console.error(err);
      setErreur("Une erreur est survenue lors de la création de la commande. Merci de réessayer.");
    } finally {
      setEnvoiEnCours(false);
    }
  }

  return (
    <div className="grid md:grid-cols-[1fr_320px] gap-8">
      <form onSubmit={handleSubmit} className="space-y-5">
        <h1 className="text-lg font-semibold">Finaliser la commande</h1>

        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Nom complet</label>
            <input
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full rounded-md border border-ink-900/15 px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Téléphone</label>
            <input
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="77 000 00 00"
              className="w-full rounded-md border border-ink-900/15 px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Ville</label>
            <select
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              className="w-full rounded-md border border-ink-900/15 px-3 py-2 text-sm"
            >
              {REGIONS_SENEGAL.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <p className="text-xs text-ink-900/50 mt-1">
              {ville === "Dakar"
                ? "Un livreur vous contactera pour la remise en main propre."
                : "Votre colis sera acheminé par car vers votre région ; vous serez informé du point et de l'horaire de retrait."}
            </p>
          </div>
          <div>
            <label className="block text-sm mb-1">Adresse / point de repère</label>
            <input
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              className="w-full rounded-md border border-ink-900/15 px-3 py-2 text-sm"
              required
            />
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Mode de paiement</p>
          <div className="flex gap-3">
            {(["wave", "orange_money"] as const).map((mode) => (
              <label
                key={mode}
                className={`flex-1 flex items-center justify-center gap-2 border rounded-md py-2.5 text-sm cursor-pointer ${
                  modePaiement === mode ? "border-clay-500 bg-clay-100" : "border-ink-900/15"
                }`}
              >
                <input
                  type="radio"
                  name="paiement"
                  value={mode}
                  checked={modePaiement === mode}
                  onChange={() => setModePaiement(mode)}
                  className="hidden"
                />
                {mode === "wave" ? (
                  <>
                    <span className="w-6 h-6 rounded-full bg-[#1DC8E4] text-white text-xs font-bold flex items-center justify-center">
                      W
                    </span>
                    <span>Wave</span>
                  </>
                ) : (
                  <>
                    <span className="w-6 h-6 rounded-full bg-[#FF6600] text-white text-[10px] font-bold flex items-center justify-center">
                      OM
                    </span>
                    <span>Orange Money</span>
                  </>
                )}
              </label>
            ))}
          </div>
        </div>

        {erreur && <p className="text-sm text-clay-600">{erreur}</p>}

        <button
          type="submit"
          disabled={envoiEnCours}
          className="w-full h-10 rounded-md bg-ink-950 text-white text-sm font-medium disabled:opacity-60"
        >
          {envoiEnCours ? "Création de la commande..." : `Payer ${formatFcfa(montantTotalAvecPromo)}`}
        </button>
      </form>

      <div className="border border-ink-900/10 rounded-lg p-4 h-fit space-y-3">
        <p className="text-sm font-medium">Récapitulatif</p>
        {items.map((i) => (
          <div key={i.productId} className="flex justify-between text-sm text-ink-900/70">
            <span>
              {i.nom} × {i.quantite}
            </span>
            <span>{formatFcfa(i.prixVente * i.quantite)}</span>
          </div>
        ))}
        <div className="border-t border-ink-900/10 pt-3 space-y-2">
          <p className="text-sm font-medium">Code promo</p>
          <div className="flex gap-2">
            <input
              value={codePromo}
              onChange={(e) => setCodePromo(e.target.value)}
              placeholder="Entrez un code"
              className="flex-1 rounded-md border border-ink-900/15 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={appliquerCodePromo}
              disabled={!codePromo.trim() || verifPromoEnCours}
              className="px-3 rounded-md border border-ink-900/15 text-sm disabled:opacity-50"
            >
              {verifPromoEnCours ? "..." : "Appliquer"}
            </button>
          </div>
          {erreurPromo && <p className="text-xs text-clay-600">{erreurPromo}</p>}
          {codeApplique && (
            <p className="text-xs text-green-700">
              Code {codeApplique.code} appliqué : -{formatFcfa(reduction)}
            </p>
          )}
        </div>

        <div className="border-t border-ink-900/10 pt-2 space-y-1">
          <div className="flex justify-between text-sm text-ink-900/70">
            <span>Fret ({selectedMode})</span>
            <span>{formatFcfa(totalFret)}</span>
          </div>
          {reduction > 0 && (
            <div className="flex justify-between text-sm text-green-700">
              <span>Réduction</span>
              <span>-{formatFcfa(reduction)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatFcfa(montantTotalAvecPromo)}</span>
          </div>
        </div>
        {delaiEstime && <p className="text-xs text-ink-900/50">Délai estimé : {delaiEstime}</p>}
      </div>
    </div>
  );
}

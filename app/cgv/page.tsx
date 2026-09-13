export default function CGVPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 text-sm text-ink-900/80 leading-relaxed">
      <div>
        <h1 className="text-lg font-semibold text-ink-950 mb-1">Conditions générales de vente</h1>
        <p className="text-xs text-ink-900/40">Dernière mise à jour : septembre 2026</p>
      </div>

      <section className="space-y-2">
        <h2 className="font-medium text-ink-950">1. Objet</h2>
        <p>
          Les présentes conditions régissent les ventes réalisées sur le site SourceTeranga, exploité en
          tant qu&apos;entreprise individuelle basée au Sénégal. Toute commande passée sur le site implique
          l&apos;acceptation pleine et entière des présentes conditions.
          {" "}
          <span className="text-ink-900/40">
            [Informations légales complètes — NINEA, RCCM, raison sociale — à ajouter ici une fois
            confirmées]
          </span>
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-medium text-ink-950">2. Produits et prix</h2>
        <p>
          Les prix sont indiqués en Francs CFA (FCFA), hors frais de livraison qui sont calculés
          séparément selon le mode choisi (aérien, express, maritime). Les prix peuvent évoluer selon les
          coûts d&apos;approvisionnement ; le prix applicable est celui affiché au moment de la validation
          de la commande.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-medium text-ink-950">3. Quantité minimum de commande (MOQ)</h2>
        <p>
          Certains articles sont soumis à une quantité minimale de commande (MOQ), indiquée sur chaque
          fiche produit. Toute commande ne respectant pas ce minimum ne pourra pas être validée.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-medium text-ink-950">4. Commande et paiement</h2>
        <p>
          Les commandes sont réglées via Wave ou Orange Money au moment de la validation. Le paiement
          déclenche la mise en préparation de votre commande auprès de nos fournisseurs. Aucune donnée
          bancaire n&apos;est stockée ou traitée directement par SourceTeranga.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-medium text-ink-950">5. Livraison</h2>
        <p>
          Les délais de livraison varient selon le mode choisi (2 jours en express, 1 à 2 semaines en
          aérien, 4 à 8 semaines en maritime) et sont donnés à titre indicatif, dépendant de facteurs
          externes (dédouanement, transporteur). La livraison s&apos;effectue à Dakar via un livreur, et
          dans les autres régions via les compagnies de transport routier, avec retrait au point
          d&apos;arrivée.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-medium text-ink-950">6. Responsabilité</h2>
        <p>
          SourceTeranga s&apos;engage à fournir des articles conformes à leur description. Les produits
          étant importés, un délai raisonnable de traitement des réclamations est nécessaire. Notre
          responsabilité ne saurait être engagée pour des retards liés à des événements hors de notre
          contrôle (douane, transporteur, force majeure).
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-medium text-ink-950">7. Réclamations et litiges</h2>
        <p>
          Toute réclamation doit être adressée via WhatsApp dans les meilleurs délais après réception de
          la commande. En l&apos;absence de résolution amiable, les présentes conditions sont soumises au
          droit sénégalais.
        </p>
      </section>

      <p className="text-xs text-ink-900/40 pt-4 border-t border-ink-900/10">
        Pour toute question, contactez-nous via WhatsApp depuis le menu du site.
      </p>
    </div>
  );
}

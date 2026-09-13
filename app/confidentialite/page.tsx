export default function ConfidentialitePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 text-sm text-ink-900/80 leading-relaxed">
      <div>
        <h1 className="text-lg font-semibold text-ink-950 mb-1">Politique de confidentialité</h1>
        <p className="text-xs text-ink-900/40">Dernière mise à jour : septembre 2026</p>
      </div>

      <section className="space-y-2">
        <h2 className="font-medium text-ink-950">1. Données que nous collectons</h2>
        <p>
          Lors de votre navigation et de vos commandes sur SourceTeranga, nous collectons : votre nom,
          numéro de téléphone, adresse email (si vous créez un compte), ville et adresse de livraison,
          ainsi que l&apos;historique de vos commandes.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-medium text-ink-950">2. Pourquoi nous les utilisons</h2>
        <p>
          Ces informations servent uniquement à traiter vos commandes, calculer les frais de livraison,
          vous contacter en cas de besoin (WhatsApp, appel), et vous informer de l&apos;avancement de votre
          commande. Nous ne vendons ni ne louons vos données à des tiers.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-medium text-ink-950">3. Où sont stockées vos données</h2>
        <p>
          Vos données sont hébergées sur Supabase, une infrastructure sécurisée, avec un accès restreint
          protégé par des règles de sécurité strictes (row level security). Seules les personnes
          autorisées de SourceTeranga peuvent consulter les informations nécessaires au traitement de
          votre commande.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-medium text-ink-950">4. Paiement</h2>
        <p>
          Nous ne stockons aucune information de carte bancaire ou de compte Wave/Orange Money. Les
          transactions sont traitées directement par ces prestataires de paiement, selon leurs propres
          conditions de sécurité.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-medium text-ink-950">5. Partage avec des tiers</h2>
        <p>
          Vos coordonnées (nom, téléphone, adresse) peuvent être partagées avec nos transporteurs
          (livreur local ou compagnie de transport régional) dans la seule mesure nécessaire à
          l&apos;acheminement de votre commande.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-medium text-ink-950">6. Vos droits</h2>
        <p>
          Vous pouvez à tout moment demander à consulter, corriger ou supprimer vos données personnelles
          en nous contactant via WhatsApp ou par email. Nous traiterons votre demande dans les meilleurs
          délais.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-medium text-ink-950">7. Cookies et stockage local</h2>
        <p>
          Le site utilise le stockage local de votre navigateur uniquement pour conserver le contenu de
          votre panier entre deux visites. Aucune donnée de suivi publicitaire n&apos;est utilisée.
        </p>
      </section>

      <p className="text-xs text-ink-900/40 pt-4 border-t border-ink-900/10">
        Pour exercer vos droits ou pour toute question, contactez-nous via WhatsApp depuis le menu du
        site.
      </p>
    </div>
  );
}

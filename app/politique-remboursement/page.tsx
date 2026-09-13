export default function PolitiqueRemboursementPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 text-sm text-ink-900/80 leading-relaxed">
      <div>
        <h1 className="text-lg font-semibold text-ink-950 mb-1">Politique de remboursement et de retour</h1>
        <p className="text-xs text-ink-900/40">Dernière mise à jour : septembre 2026</p>
      </div>

      <section className="space-y-2">
        <h2 className="font-medium text-ink-950">1. Conditions de retour</h2>
        <p>
          Un article peut être retourné dans un délai de <strong>48 heures après réception</strong>,
          uniquement s&apos;il est non conforme à la commande (mauvaise référence, quantité incorrecte)
          ou endommagé à la livraison. L&apos;article doit être dans son état d&apos;origine, non utilisé,
          avec son emballage.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-medium text-ink-950">2. Articles non retournables</h2>
        <p>
          Les produits importés sur commande spécifique (personnalisation, variante configurée à la
          demande) ne peuvent pas être retournés sauf défaut de fabrication avéré, en raison de leur
          nature importée directement depuis nos fournisseurs.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-medium text-ink-950">3. Comment signaler un problème</h2>
        <p>
          Contactez-nous directement via WhatsApp (bouton disponible sur le site) dans les 48 heures
          suivant la réception, en précisant votre numéro de commande et en joignant une photo du
          produit reçu. Notre service client répond généralement sous 24 heures ouvrées.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-medium text-ink-950">4. Remboursement</h2>
        <p>
          Une fois la réclamation validée, le remboursement est effectué sur le même moyen de paiement
          utilisé (Wave ou Orange Money) sous 3 à 7 jours ouvrés. Un échange contre le bon article peut
          également être proposé selon la disponibilité.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-medium text-ink-950">5. Frais de retour</h2>
        <p>
          Si le problème est de notre fait (erreur d&apos;expédition, article endommagé), les frais de
          retour sont à notre charge. Dans les autres cas, les frais de retour restent à la charge du
          client.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-medium text-ink-950">6. Délais de livraison</h2>
        <p>
          Les délais annoncés (aérien, express, maritime) sont indicatifs et dépendent de facteurs
          externes (douane, transporteur). Un retard de livraison ne constitue pas en soi un motif de
          remboursement automatique, mais nous restons disponibles pour vous informer de l&apos;avancement
          de votre commande à tout moment.
        </p>
      </section>

      <p className="text-xs text-ink-900/40 pt-4 border-t border-ink-900/10">
        Pour toute question, contactez-nous via WhatsApp depuis le menu du site.
      </p>
    </div>
  );
}

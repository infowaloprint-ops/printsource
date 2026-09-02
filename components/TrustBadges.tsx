const BADGES = [
  { label: "Paiement sécurisé", detail: "Wave & Orange Money" },
  { label: "Politique de remboursement", detail: "Si article non conforme" },
  { label: "Service client", detail: "Réponse rapide sur WhatsApp" },
  { label: "Confidentialité", detail: "Vos données restent privées" },
];

export default function TrustBadges() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border-t border-b border-ink-900/10 py-4">
      {BADGES.map((badge) => (
        <div key={badge.label}>
          <p className="text-sm font-medium">{badge.label}</p>
          <p className="text-xs text-ink-900/50">{badge.detail}</p>
        </div>
      ))}
    </div>
  );
}

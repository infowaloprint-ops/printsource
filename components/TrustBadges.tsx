const BADGES = [
  { label: "Politique de remboursement", detail: "Si article non conforme" },
  { label: "Service client", detail: "Réponse rapide sur WhatsApp" },
  { label: "Confidentialité", detail: "Vos données restent privées" },
];

export default function TrustBadges() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border-t border-b border-ink-900/10 py-4">
      <div>
        <p className="text-sm font-medium mb-1.5">Paiement sécurisé</p>
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/wave-logo.png" alt="Wave" className="h-5 w-auto" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/orange-money-logo.png" alt="Orange Money" className="h-5 w-auto" />
        </div>
      </div>
      {BADGES.map((badge) => (
        <div key={badge.label}>
          <p className="text-sm font-medium">{badge.label}</p>
          <p className="text-xs text-ink-900/50">{badge.detail}</p>
        </div>
      ))}
    </div>
  );
}

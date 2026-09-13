const BADGES = [
  { label: "Politique de remboursement", detail: "Si article non conforme", href: "/politique-remboursement" },
  { label: "Service client", detail: "Réponse rapide sur WhatsApp", href: null },
  { label: "Confidentialité", detail: "Vos données restent privées", href: "/confidentialite" },
];

export default function TrustBadges() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border-t border-b border-ink-900/10 py-4">
      <div>
        <p className="text-sm font-medium mb-2">Paiement sécurisé</p>
        <div className="flex items-center gap-2">
          <span className="border border-ink-900/10 rounded-md px-2 py-1.5 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/wave-logo.png" alt="Wave" className="h-8 w-auto" />
          </span>
          <span className="border border-ink-900/10 rounded-md px-2 py-1.5 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/orange-money-logo.png" alt="Orange Money" className="h-8 w-auto" />
          </span>
        </div>
      </div>
      {BADGES.map((badge) =>
        badge.href ? (
          <a key={badge.label} href={badge.href} className="hover:opacity-70">
            <p className="text-sm font-medium underline decoration-ink-900/20">{badge.label}</p>
            <p className="text-xs text-ink-900/50">{badge.detail}</p>
          </a>
        ) : (
          <div key={badge.label}>
            <p className="text-sm font-medium">{badge.label}</p>
            <p className="text-xs text-ink-900/50">{badge.detail}</p>
          </div>
        )
      )}
    </div>
  );
}

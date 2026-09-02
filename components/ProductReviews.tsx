export default function ProductReviews({
  moyenne,
  service,
  livraison,
  qualite,
  nombre,
}: {
  moyenne: number;
  service: number;
  livraison: number;
  qualite: number;
  nombre: number;
}) {
  return (
    <div>
      <p className="text-sm font-medium mb-2">Avis clients</p>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl font-semibold">{moyenne.toFixed(1)}</span>
        <span className="text-clay-500">{"★".repeat(Math.round(moyenne))}</span>
        <span className="text-sm text-ink-900/50">({nombre} avis)</span>
      </div>
      <div className="flex gap-6 text-sm text-ink-900/70">
        <span>Service : <strong className="text-ink-950">{service.toFixed(1)}</strong></span>
        <span>Livraison : <strong className="text-ink-950">{livraison.toFixed(1)}</strong></span>
        <span>Qualité : <strong className="text-ink-950">{qualite.toFixed(1)}</strong></span>
      </div>
    </div>
  );
}

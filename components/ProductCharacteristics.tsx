import type { ProductCharacteristic } from "@/lib/supabase";

export default function ProductCharacteristics({ items }: { items: ProductCharacteristic[] }) {
  return (
    <div>
      <p className="text-sm font-medium mb-2">Caractéristiques</p>
      <div className="border border-ink-900/10 rounded-md overflow-hidden">
        {items.map((item, i) => (
          <div
            key={item.label}
            className={`grid grid-cols-2 text-sm ${i % 2 === 0 ? "bg-paper" : "bg-white"}`}
          >
            <div className="px-3 py-2 text-ink-900/60">{item.label}</div>
            <div className="px-3 py-2 border-l border-ink-900/10">{item.valeur}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import type { ProductVariantGroup, ProductVariantOption } from "@/lib/supabase";

function optionLabel(option: ProductVariantOption): string {
  return typeof option === "string" ? option : option.label;
}

export default function ProductVariants({
  groups,
  onChange,
}: {
  groups: ProductVariantGroup[];
  onChange?: (selection: Record<string, string>) => void;
}) {
  const [selection, setSelection] = useState<Record<string, string>>(
    Object.fromEntries(groups.map((g) => [g.label, optionLabel(g.options[0])]))
  );

  function select(groupLabel: string, option: ProductVariantOption) {
    const next = { ...selection, [groupLabel]: optionLabel(option) };
    setSelection(next);
    onChange?.(next);
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="text-sm font-medium mb-2">
            {group.label} <span className="text-ink-900/40 font-normal">({group.options.length})</span>
          </p>

          {typeof group.options[0] === "object" ? (
            // Options avec image (ex. Couleur) : affichées en vignettes
            <div className="flex flex-wrap gap-2">
              {group.options.map((option) => {
                const label = optionLabel(option);
                const imageUrl = typeof option === "object" ? option.image_url : null;
                const isActive = selection[group.label] === label;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => select(group.label, option)}
                    aria-label={label}
                    className={`w-14 h-14 rounded-md overflow-hidden border-2 ${
                      isActive ? "border-ink-950" : "border-transparent"
                    }`}
                  >
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imageUrl} alt={label} className="w-full h-full object-cover" />
                    ) : (
                      <span className="w-full h-full flex items-center justify-center bg-paper text-[10px] text-ink-900/40">
                        {label}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            // Options simples (ex. Taille, Emballage) : boutons texte
            <div className="flex flex-wrap gap-2">
              {group.options.map((option) => {
                const label = optionLabel(option);
                const isActive = selection[group.label] === label;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => select(group.label, option)}
                    className={`px-3 h-9 rounded-md border text-sm ${
                      isActive
                        ? "border-ink-950 bg-ink-950 text-white"
                        : "border-ink-900/15 text-ink-900"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

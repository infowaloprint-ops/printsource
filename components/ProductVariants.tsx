"use client";

import { useState } from "react";
import type { ProductVariantGroup } from "@/lib/supabase";

function formatFcfa(n: number) {
  return Math.round(n).toLocaleString("fr-FR") + " FCFA";
}

export default function ProductVariants({
  groups,
  onChange,
  onPrixChange,
}: {
  groups: ProductVariantGroup[];
  onChange?: (selection: Record<string, string>) => void;
  onPrixChange?: (prix: number | undefined) => void;
}) {
  const [selection, setSelection] = useState<Record<string, string>>(
    Object.fromEntries(groups.map((g) => [g.label, g.options[0]?.label ?? ""]))
  );

  function select(groupLabel: string, optionLabel: string, prix: number | undefined) {
    const next = { ...selection, [groupLabel]: optionLabel };
    setSelection(next);
    onChange?.(next);
    onPrixChange?.(prix);
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => {
        const optionsAvecImage = group.options.some((o) => o.image_url);

        return (
          <div key={group.label}>
            <p className="text-sm font-medium mb-2">
              {group.label} <span className="text-ink-900/40 font-normal">({group.options.length})</span>
            </p>

            {optionsAvecImage ? (
              // Options avec image (ex. Couleur) : affichées en vignettes
              <div className="flex flex-wrap gap-2">
                {group.options.map((option) => {
                  const isActive = selection[group.label] === option.label;
                  return (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => select(group.label, option.label, option.prix)}
                      aria-label={option.label}
                      className={`w-14 h-14 rounded-md overflow-hidden border-2 ${
                        isActive ? "border-ink-950" : "border-transparent"
                      }`}
                    >
                      {option.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={option.image_url} alt={option.label} className="w-full h-full object-cover" />
                      ) : (
                        <span className="w-full h-full flex items-center justify-center bg-paper text-[10px] text-ink-900/40">
                          {option.label}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              // Options simples (ex. Taille, Têtes d'impression) : boutons texte,
              // avec le prix affiché si cette option a son propre tarif.
              <div className="flex flex-wrap gap-2">
                {group.options.map((option) => {
                  const isActive = selection[group.label] === option.label;
                  return (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => select(group.label, option.label, option.prix)}
                      className={`px-3 h-9 rounded-md border text-sm flex items-center gap-1.5 ${
                        isActive
                          ? "border-ink-950 bg-ink-950 text-white"
                          : "border-ink-900/15 text-ink-900"
                      }`}
                    >
                      {option.label}
                      {option.prix != null && (
                        <span className={isActive ? "text-white/70" : "text-ink-900/40"}>
                          · {formatFcfa(option.prix)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

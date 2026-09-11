"use client";

import { useState } from "react";
import type { ProductVariantGroup } from "@/lib/supabase";

export default function VariantsEditor({
  variantes,
  onChange,
}: {
  variantes: ProductVariantGroup[];
  onChange: (variantes: ProductVariantGroup[]) => void;
}) {
  const [nouveauGroupeLabel, setNouveauGroupeLabel] = useState("");
  const [nouvelleOption, setNouvelleOption] = useState<Record<number, { label: string; prix: string }>>({});

  function ajouterGroupe() {
    if (!nouveauGroupeLabel.trim()) return;
    onChange([...variantes, { label: nouveauGroupeLabel.trim(), options: [] }]);
    setNouveauGroupeLabel("");
  }

  function retirerGroupe(index: number) {
    onChange(variantes.filter((_, i) => i !== index));
  }

  function ajouterOption(groupeIndex: number) {
    const saisie = nouvelleOption[groupeIndex];
    if (!saisie?.label?.trim()) return;
    const next = [...variantes];
    next[groupeIndex] = {
      ...next[groupeIndex],
      options: [
        ...next[groupeIndex].options,
        {
          label: saisie.label.trim(),
          ...(saisie.prix.trim() ? { prix: Number(saisie.prix) } : {}),
        },
      ],
    };
    onChange(next);
    setNouvelleOption((prev) => ({ ...prev, [groupeIndex]: { label: "", prix: "" } }));
  }

  function retirerOption(groupeIndex: number, optionIndex: number) {
    const next = [...variantes];
    next[groupeIndex] = {
      ...next[groupeIndex],
      options: next[groupeIndex].options.filter((_, i) => i !== optionIndex),
    };
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {variantes.map((groupe, gi) => (
        <div key={gi} className="border border-ink-900/10 rounded-md p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">{groupe.label}</p>
            <button type="button" onClick={() => retirerGroupe(gi)} className="text-xs text-clay-600">
              Supprimer ce groupe
            </button>
          </div>

          {groupe.options.length > 0 && (
            <ul className="space-y-1 mb-2">
              {groupe.options.map((opt, oi) => (
                <li
                  key={oi}
                  className="flex items-center justify-between bg-paper rounded-md px-3 py-1.5 text-xs"
                >
                  <span>
                    {opt.label}
                    {opt.prix != null && (
                      <span className="text-ink-900/50"> — {opt.prix.toLocaleString("fr-FR")} FCFA</span>
                    )}
                  </span>
                  <button type="button" onClick={() => retirerOption(gi, oi)} className="text-clay-600">
                    Retirer
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="flex gap-2">
            <input
              value={nouvelleOption[gi]?.label ?? ""}
              onChange={(e) =>
                setNouvelleOption((prev) => ({
                  ...prev,
                  [gi]: { label: e.target.value, prix: prev[gi]?.prix ?? "" },
                }))
              }
              placeholder="Ex. 2 têtes"
              className="flex-1 rounded-md border border-ink-900/15 px-2 py-1.5 text-xs"
            />
            <input
              value={nouvelleOption[gi]?.prix ?? ""}
              onChange={(e) =>
                setNouvelleOption((prev) => ({
                  ...prev,
                  [gi]: { label: prev[gi]?.label ?? "", prix: e.target.value },
                }))
              }
              type="number"
              placeholder="Prix (optionnel)"
              className="w-32 rounded-md border border-ink-900/15 px-2 py-1.5 text-xs"
            />
            <button
              type="button"
              onClick={() => ajouterOption(gi)}
              className="px-3 rounded-md border border-ink-900/15 text-xs"
            >
              + Ajouter
            </button>
          </div>
          <p className="text-[11px] text-ink-900/40 mt-1">
            Laisse le prix vide si cette option ne doit pas changer le prix affiché.
          </p>
        </div>
      ))}

      <div className="flex gap-2">
        <input
          value={nouveauGroupeLabel}
          onChange={(e) => setNouveauGroupeLabel(e.target.value)}
          placeholder="Nouveau groupe (ex. Têtes d'impression, Couleur, Taille)"
          className="flex-1 rounded-md border border-ink-900/15 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={ajouterGroupe}
          className="px-4 rounded-md border border-ink-900/15 text-sm"
        >
          + Groupe
        </button>
      </div>
    </div>
  );
}

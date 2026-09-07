"use client";

import { useEffect, useState } from "react";
import { supabase, type Category } from "@/lib/supabase";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [nouveauSecteurLabel, setNouveauSecteurLabel] = useState("");
  const [nouvelleSousCategorie, setNouvelleSousCategorie] = useState<Record<string, string>>({});

  async function charger() {
    const { data } = await supabase.from("categories").select("*").order("ordre", { ascending: true });
    setCategories((data as Category[]) ?? []);
  }

  useEffect(() => {
    charger();
  }, []);

  function slugify(texte: string) {
    return texte
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  async function ajouterSecteur() {
    if (!nouveauSecteurLabel.trim()) return;
    const slug = slugify(nouveauSecteurLabel);
    await supabase.from("categories").insert({
      slug,
      label: nouveauSecteurLabel.trim(),
      parent_id: null,
      disponible: true,
      ordre: (secteurs?.length ?? 0) + 1,
    });
    setNouveauSecteurLabel("");
    charger();
  }

  async function ajouterSousCategorie(secteurId: string) {
    const label = nouvelleSousCategorie[secteurId];
    if (!label || !label.trim()) return;
    const slug = slugify(label);
    await supabase.from("categories").insert({
      slug,
      label: label.trim(),
      parent_id: secteurId,
      disponible: true,
      ordre: 0,
    });
    setNouvelleSousCategorie((prev) => ({ ...prev, [secteurId]: "" }));
    charger();
  }

  async function toggleDisponible(cat: Category) {
    await supabase.from("categories").update({ disponible: !cat.disponible }).eq("id", cat.id);
    charger();
  }

  async function supprimer(cat: Category) {
    const estSecteur = cat.parent_id === null;
    const message = estSecteur
      ? `Supprimer le secteur "${cat.label}" et toutes ses sous-catégories ?`
      : `Supprimer la sous-catégorie "${cat.label}" ?`;
    if (!confirm(message)) return;
    await supabase.from("categories").delete().eq("id", cat.id);
    charger();
  }

  if (categories === null) return <p className="text-sm text-ink-900/60">Chargement...</p>;

  const secteurs = categories.filter((c) => c.parent_id === null);

  return (
    <div>
      <h1 className="text-lg font-semibold mb-1">Catégories</h1>
      <p className="text-sm text-ink-900/60 mb-4">
        Un secteur (ex. Imprimerie) regroupe des sous-catégories (ex. DTF, Encres). Un secteur sans
        sous-catégorie s&apos;affiche comme &laquo;Bientôt&raquo; sur le site.
      </p>

      <div className="space-y-4 mb-6">
        {secteurs.map((secteur) => {
          const sousCategories = categories.filter((c) => c.parent_id === secteur.id);
          return (
            <div key={secteur.id} className="border border-ink-900/10 rounded-md p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{secteur.label}</span>
                  {!secteur.disponible && (
                    <span className="text-xs bg-clay-100 text-clay-600 px-2 py-0.5 rounded">Masqué</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <button onClick={() => toggleDisponible(secteur)} className="underline">
                    {secteur.disponible ? "Masquer" : "Afficher"}
                  </button>
                  <button onClick={() => supprimer(secteur)} className="text-clay-600 underline">
                    Supprimer
                  </button>
                </div>
              </div>

              <div className="pl-4 space-y-1 mb-3">
                {sousCategories.length === 0 ? (
                  <p className="text-xs text-ink-900/40">Aucune sous-catégorie pour l&apos;instant.</p>
                ) : (
                  sousCategories.map((sc) => (
                    <div key={sc.id} className="flex items-center justify-between text-sm py-1">
                      <span className={sc.disponible ? "" : "text-ink-900/40"}>{sc.label}</span>
                      <div className="flex items-center gap-3 text-xs">
                        <button onClick={() => toggleDisponible(sc)} className="underline">
                          {sc.disponible ? "Masquer" : "Afficher"}
                        </button>
                        <button onClick={() => supprimer(sc)} className="text-clay-600 underline">
                          Retirer
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-2 pl-4">
                <input
                  value={nouvelleSousCategorie[secteur.id] ?? ""}
                  onChange={(e) =>
                    setNouvelleSousCategorie((prev) => ({ ...prev, [secteur.id]: e.target.value }))
                  }
                  placeholder="Nouvelle sous-catégorie"
                  className="flex-1 rounded-md border border-ink-900/15 px-3 py-1.5 text-sm"
                />
                <button
                  onClick={() => ajouterSousCategorie(secteur.id)}
                  className="px-3 rounded-md border border-ink-900/15 text-sm"
                >
                  + Ajouter
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-ink-900/10 pt-4">
        <p className="text-sm font-medium mb-2">Ajouter un nouveau secteur</p>
        <div className="flex gap-2 max-w-md">
          <input
            value={nouveauSecteurLabel}
            onChange={(e) => setNouveauSecteurLabel(e.target.value)}
            placeholder="Ex. Sécurité, Emballage, Textile..."
            className="flex-1 rounded-md border border-ink-900/15 px-3 py-2 text-sm"
          />
          <button
            onClick={ajouterSecteur}
            className="px-4 rounded-md bg-ink-950 text-white text-sm"
          >
            + Créer
          </button>
        </div>
      </div>
    </div>
  );
}

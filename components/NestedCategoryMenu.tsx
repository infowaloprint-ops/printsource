"use client";

import { useState, useRef, useEffect } from "react";
import { supabase, type Category } from "@/lib/supabase";

export default function NestedCategoryMenu() {
  const [ouvert, setOuvert] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [secteurActifId, setSecteurActifId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase
      .from("categories")
      .select("*")
      .eq("disponible", true)
      .order("ordre", { ascending: true })
      .then(({ data }) => {
        const cats = (data as Category[]) ?? [];
        setCategories(cats);
        const premierSecteur = cats.find((c) => c.parent_id === null);
        if (premierSecteur) setSecteurActifId(premierSecteur.id);
      });
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOuvert(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const secteurs = categories.filter((c) => c.parent_id === null);
  const secteurActif = secteurs.find((s) => s.id === secteurActifId);
  const sousCategoriesActives = categories.filter((c) => c.parent_id === secteurActifId);

  if (secteurs.length === 0) return null;

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOuvert((o) => !o)}
        className={`text-xs font-medium whitespace-nowrap flex items-center gap-1 ${
          ouvert ? "text-clay-600" : "text-ink-900"
        }`}
      >
        <span>☰</span> Toutes les catégories
      </button>

      {ouvert && (
        <div className="absolute left-0 top-full mt-2 flex flex-col sm:flex-row bg-white border border-ink-900/10 rounded-md shadow-lg z-30 w-[85vw] max-w-[420px] max-h-[70vh] overflow-y-auto sm:overflow-visible">
          <div className="sm:w-40 border-b sm:border-b-0 sm:border-r border-ink-900/10 py-2 shrink-0">
            {secteurs.map((secteur) => (
              <button
                key={secteur.id}
                type="button"
                onMouseEnter={() => setSecteurActifId(secteur.id)}
                onClick={() => setSecteurActifId(secteur.id)}
                className={`w-full text-left px-4 py-2 text-sm ${
                  secteurActifId === secteur.id ? "bg-paper text-clay-600 font-medium" : "text-ink-900/80"
                }`}
              >
                {secteur.label}
              </button>
            ))}
          </div>

          <div className="flex-1 p-4">
            {sousCategoriesActives.length === 0 ? (
              <p className="text-sm text-ink-900/50">
                Ce secteur arrive bientôt sur SourceTeranga.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href="/?categorie=tous"
                  onClick={() => setOuvert(false)}
                  className="text-sm text-ink-900/70 hover:text-clay-600 py-1"
                >
                  Tout {secteurActif?.label}
                </a>
                {sousCategoriesActives.map((sc) => (
                  <a
                    key={sc.id}
                    href={`/?categorie=${sc.slug}`}
                    onClick={() => setOuvert(false)}
                    className="text-sm text-ink-900/70 hover:text-clay-600 py-1"
                  >
                    {sc.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

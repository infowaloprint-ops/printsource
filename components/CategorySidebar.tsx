"use client";

import { useEffect, useState } from "react";
import { supabase, type Category } from "@/lib/supabase";

export default function CategorySidebar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [secteurSurvole, setSecteurSurvole] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("categories")
      .select("*")
      .eq("disponible", true)
      .order("ordre", { ascending: true })
      .then(({ data }) => setCategories((data as Category[]) ?? []));
  }, []);

  const secteurs = categories.filter((c) => c.parent_id === null);

  if (secteurs.length === 0) return null;

  return (
    <div className="hidden md:block w-56 shrink-0">
      <div className="border border-ink-900/10 rounded-lg overflow-visible bg-white">
        {secteurs.map((secteur) => {
          const sousCategories = categories.filter((c) => c.parent_id === secteur.id);
          const estSurvole = secteurSurvole === secteur.id;

          return (
            <div
              key={secteur.id}
              className="relative border-b border-ink-900/5 last:border-b-0"
              onMouseEnter={() => setSecteurSurvole(secteur.id)}
              onMouseLeave={() => setSecteurSurvole(null)}
            >
              <a
                href={`/?categorie=${sousCategories[0]?.slug ?? "tous"}`}
                className={`flex items-center justify-between px-4 py-2.5 text-sm ${
                  estSurvole ? "bg-paper text-clay-600" : "text-ink-900/80"
                }`}
              >
                {secteur.label}
                {sousCategories.length > 0 && <span className="text-xs">›</span>}
              </a>

              {/* Panneau des sous-catégories au survol */}
              {estSurvole && sousCategories.length > 0 && (
                <div className="absolute left-full top-0 ml-1 w-48 bg-white border border-ink-900/10 rounded-lg shadow-lg py-2 z-20">
                  {sousCategories.map((sc) => (
                    <a
                      key={sc.id}
                      href={`/?categorie=${sc.slug}`}
                      className="block px-4 py-1.5 text-sm text-ink-900/70 hover:text-clay-600 hover:bg-paper"
                    >
                      {sc.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

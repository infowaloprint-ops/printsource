"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, type Product, type Category } from "@/lib/supabase";

export default function ProductForm({ produitExistant }: { produitExistant?: Product }) {
  const router = useRouter();
  const [nom, setNom] = useState(produitExistant?.nom ?? "");
  const [categorie, setCategorie] = useState(produitExistant?.categorie ?? "");
  const [sousCategories, setSousCategories] = useState<Category[]>([]);
  const [prixVente, setPrixVente] = useState(produitExistant?.prix_vente ?? 0);
  const [prixMarche, setPrixMarche] = useState(produitExistant?.prix_marche_reference ?? 0);
  const [poidsUnitaire, setPoidsUnitaire] = useState(produitExistant?.poids_unitaire ?? 0);
  const [volumeUnitaire, setVolumeUnitaire] = useState(produitExistant?.volume_unitaire ?? 0);
  const [moq, setMoq] = useState(produitExistant?.moq ?? 1);
  const [enVedette, setEnVedette] = useState(produitExistant?.en_vedette ?? false);
  const [imageUrl, setImageUrl] = useState(produitExistant?.image_url ?? "");
  const [imagesSecondaires, setImagesSecondaires] = useState<string[]>(
    (produitExistant?.images ?? []).filter((img) => img !== produitExistant?.image_url)
  );
  const [nouvelleImage, setNouvelleImage] = useState("");
  const [caracteristiques, setCaracteristiques] = useState<{ label: string; valeur: string }[]>(
    produitExistant?.caracteristiques ?? []
  );
  const [nouveauLabel, setNouveauLabel] = useState("");
  const [nouvelleValeur, setNouvelleValeur] = useState("");
  const [enregistrement, setEnregistrement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  function ajouterCaracteristique() {
    if (nouveauLabel.trim() && nouvelleValeur.trim()) {
      setCaracteristiques((prev) => [...prev, { label: nouveauLabel.trim(), valeur: nouvelleValeur.trim() }]);
      setNouveauLabel("");
      setNouvelleValeur("");
    }
  }

  function retirerCaracteristique(index: number) {
    setCaracteristiques((prev) => prev.filter((_, i) => i !== index));
  }

  function ajouterImageSecondaire() {
    if (nouvelleImage.trim()) {
      setImagesSecondaires((prev) => [...prev, nouvelleImage.trim()]);
      setNouvelleImage("");
    }
  }

  function retirerImageSecondaire(index: number) {
    setImagesSecondaires((prev) => prev.filter((_, i) => i !== index));
  }

  useEffect(() => {
    supabase
      .from("categories")
      .select("*")
      .not("parent_id", "is", null)
      .order("ordre", { ascending: true })
      .then(({ data }) => {
        const cats = (data as Category[]) ?? [];
        setSousCategories(cats);
        if (!categorie && cats.length > 0) setCategorie(cats[0].slug);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);
    setEnregistrement(true);

    const toutesLesImages = [imageUrl, ...imagesSecondaires].filter(Boolean);

    const payload = {
      nom,
      categorie,
      prix_vente: prixVente,
      prix_marche_reference: prixMarche || null,
      poids_unitaire: poidsUnitaire,
      volume_unitaire: volumeUnitaire,
      moq,
      en_vedette: enVedette,
      image_url: imageUrl || null,
      images: toutesLesImages.length > 0 ? toutesLesImages : null,
      caracteristiques: caracteristiques.length > 0 ? caracteristiques : null,
    };

    const { error } = produitExistant
      ? await supabase.from("products").update(payload).eq("id", produitExistant.id)
      : await supabase.from("products").insert(payload);

    setEnregistrement(false);

    if (error) {
      setErreur("Erreur lors de l'enregistrement : " + error.message);
      return;
    }

    router.push("/admin/produits");
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-3">
      <div>
        <label className="block text-sm mb-1">Nom du produit</label>
        <input
          required
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="w-full rounded-md border border-ink-900/15 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Catégorie</label>
        <select
          value={categorie}
          onChange={(e) => setCategorie(e.target.value)}
          className="w-full rounded-md border border-ink-900/15 px-3 py-2 text-sm"
        >
          {sousCategories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.label}
            </option>
          ))}
        </select>
        {sousCategories.length === 0 && (
          <p className="text-xs text-clay-600 mt-1">
            Aucune sous-catégorie créée. Ajoutes-en une dans l&apos;onglet &laquo;Catégories&raquo;.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">Prix de vente (FCFA)</label>
          <input
            required
            type="number"
            value={prixVente}
            onChange={(e) => setPrixVente(Number(e.target.value))}
            className="w-full rounded-md border border-ink-900/15 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Prix marché (optionnel)</label>
          <input
            type="number"
            value={prixMarche}
            onChange={(e) => setPrixMarche(Number(e.target.value))}
            className="w-full rounded-md border border-ink-900/15 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm mb-1">Poids unitaire (kg)</label>
          <input
            required
            type="number"
            step="0.001"
            value={poidsUnitaire}
            onChange={(e) => setPoidsUnitaire(Number(e.target.value))}
            className="w-full rounded-md border border-ink-900/15 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Volume unitaire (CBM)</label>
          <input
            required
            type="number"
            step="0.0001"
            value={volumeUnitaire}
            onChange={(e) => setVolumeUnitaire(Number(e.target.value))}
            className="w-full rounded-md border border-ink-900/15 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">MOQ</label>
          <input
            required
            type="number"
            value={moq}
            onChange={(e) => setMoq(Number(e.target.value))}
            className="w-full rounded-md border border-ink-900/15 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 bg-paper rounded-md px-3 py-2.5">
        <input
          type="checkbox"
          id="en_vedette"
          checked={enVedette}
          onChange={(e) => setEnVedette(e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="en_vedette" className="text-sm">
          Produit en vedette (affiché sur la page d&apos;accueil)
        </label>
      </div>

      <div>
        <label className="block text-sm mb-1">URL image principale</label>
        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://..."
          className="w-full rounded-md border border-ink-900/15 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Images secondaires (détails, zoom, utilisation...)</label>
        <div className="flex gap-2 mb-2">
          <input
            value={nouvelleImage}
            onChange={(e) => setNouvelleImage(e.target.value)}
            placeholder="https://..."
            className="flex-1 rounded-md border border-ink-900/15 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={ajouterImageSecondaire}
            className="px-4 rounded-md border border-ink-900/15 text-sm"
          >
            + Ajouter
          </button>
        </div>

        {imagesSecondaires.length > 0 && (
          <ul className="space-y-1">
            {imagesSecondaires.map((img, i) => (
              <li
                key={i}
                className="flex items-center justify-between bg-paper rounded-md px-3 py-1.5 text-xs"
              >
                <span className="truncate flex-1">{img}</span>
                <button
                  type="button"
                  onClick={() => retirerImageSecondaire(i)}
                  className="text-clay-600 ml-2"
                >
                  Retirer
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label className="block text-sm mb-1">Caractéristiques (matière, origine, température...)</label>
        <div className="flex gap-2 mb-2">
          <input
            value={nouveauLabel}
            onChange={(e) => setNouveauLabel(e.target.value)}
            placeholder="Nom (ex. Origine)"
            className="w-1/3 rounded-md border border-ink-900/15 px-3 py-2 text-sm"
          />
          <input
            value={nouvelleValeur}
            onChange={(e) => setNouvelleValeur(e.target.value)}
            placeholder="Valeur (ex. Guangdong, Chine)"
            className="flex-1 rounded-md border border-ink-900/15 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={ajouterCaracteristique}
            className="px-4 rounded-md border border-ink-900/15 text-sm"
          >
            + Ajouter
          </button>
        </div>

        {caracteristiques.length > 0 && (
          <ul className="space-y-1">
            {caracteristiques.map((carac, i) => (
              <li
                key={i}
                className="flex items-center justify-between bg-paper rounded-md px-3 py-1.5 text-xs"
              >
                <span className="flex-1">
                  <span className="font-medium">{carac.label}</span> — {carac.valeur}
                </span>
                <button
                  type="button"
                  onClick={() => retirerCaracteristique(i)}
                  className="text-clay-600 ml-2"
                >
                  Retirer
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {erreur && <p className="text-sm text-clay-600">{erreur}</p>}

      <button
        type="submit"
        disabled={enregistrement}
        className="h-10 px-5 rounded-md bg-ink-950 text-white text-sm font-medium disabled:opacity-60"
      >
        {enregistrement ? "Enregistrement..." : produitExistant ? "Mettre à jour" : "Créer le produit"}
      </button>
    </form>
  );
}

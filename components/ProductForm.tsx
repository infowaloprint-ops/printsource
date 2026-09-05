"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, type Product } from "@/lib/supabase";

export default function ProductForm({ produitExistant }: { produitExistant?: Product }) {
  const router = useRouter();
  const [nom, setNom] = useState(produitExistant?.nom ?? "");
  const [categorie, setCategorie] = useState(produitExistant?.categorie ?? "dtf");
  const [prixVente, setPrixVente] = useState(produitExistant?.prix_vente ?? 0);
  const [prixMarche, setPrixMarche] = useState(produitExistant?.prix_marche_reference ?? 0);
  const [poidsUnitaire, setPoidsUnitaire] = useState(produitExistant?.poids_unitaire ?? 0);
  const [volumeUnitaire, setVolumeUnitaire] = useState(produitExistant?.volume_unitaire ?? 0);
  const [moq, setMoq] = useState(produitExistant?.moq ?? 1);
  const [imageUrl, setImageUrl] = useState(produitExistant?.image_url ?? "");
  const [imagesSecondaires, setImagesSecondaires] = useState<string[]>(
    (produitExistant?.images ?? []).filter((img) => img !== produitExistant?.image_url)
  );
  const [nouvelleImage, setNouvelleImage] = useState("");
  const [enregistrement, setEnregistrement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  function ajouterImageSecondaire() {
    if (nouvelleImage.trim()) {
      setImagesSecondaires((prev) => [...prev, nouvelleImage.trim()]);
      setNouvelleImage("");
    }
  }

  function retirerImageSecondaire(index: number) {
    setImagesSecondaires((prev) => prev.filter((_, i) => i !== index));
  }

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
      image_url: imageUrl || null,
      images: toutesLesImages.length > 0 ? toutesLesImages : null,
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
          <option value="encres">Encres</option>
          <option value="dtf">DTF</option>
          <option value="supports">Supports</option>
          <option value="machines">Machines</option>
        </select>
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

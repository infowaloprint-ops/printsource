import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client public : utilisé côté navigateur, respecte les policies RLS.
// Ne jamais utiliser la clé service_role ici.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ProductVariantOption =
  | string
  | { label: string; image_url: string };

export type ProductVariantGroup = {
  label: string; // ex. "Couleur", "Taille", "Emballage"
  options: ProductVariantOption[];
};

export type ProductCharacteristic = {
  label: string;
  valeur: string;
};

export type Product = {
  id: string;
  nom: string;
  categorie: string;
  prix_vente: number;
  prix_marche_reference: number | null;
  poids_unitaire: number;
  volume_unitaire: number;
  moq: number;
  image_url: string | null;
  images: string[] | null;
  variantes: ProductVariantGroup[] | null;
  caracteristiques: ProductCharacteristic[] | null;
  avis_moyenne: number | null;
  avis_service: number | null;
  avis_livraison: number | null;
  avis_qualite: number | null;
  avis_nombre: number | null;
};

export type ShippingRate = {
  mode: "aerien" | "express" | "maritime";
  unite: "kg" | "cbm";
  cout_reel: number;
  marge_fixe: number;
  delai_estime: string;
};

export type ProductReviewRow = {
  id: string;
  product_id: string;
  client_nom: string;
  note: number;
  commentaire: string | null;
  created_at: string;
};

export type PromoCode = {
  code: string;
  type: "pourcentage" | "montant_fixe";
  valeur: number;
  actif: boolean;
  date_expiration: string | null;
  usage_max: number | null;
  usage_actuel: number;
};

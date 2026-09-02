"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminGuard } from "@/lib/use-admin-guard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const statut = useAdminGuard();
  const pathname = usePathname();

  if (statut === "chargement") {
    return <p className="text-sm text-ink-900/60">Vérification des droits...</p>;
  }

  if (statut === "refuse") {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <p className="text-sm text-ink-900/60">
          Cette section est réservée aux administrateurs. Connectez-vous avec un compte admin pour continuer.
        </p>
        <Link href="/connexion" className="text-sm underline mt-2 inline-block">
          Se connecter
        </Link>
      </div>
    );
  }

  const liens = [
    { href: "/admin/produits", label: "Produits" },
    { href: "/admin/commandes", label: "Commandes" },
  ];

  return (
    <div>
      <div className="flex gap-2 border-b border-ink-900/10 mb-6 pb-2">
        {liens.map((lien) => (
          <Link
            key={lien.href}
            href={lien.href}
            className={`text-sm px-3 py-1.5 rounded-md ${
              pathname?.startsWith(lien.href) ? "bg-ink-950 text-white" : "text-ink-900/70"
            }`}
          >
            {lien.label}
          </Link>
        ))}
      </div>
      {children}
    </div>
  );
}

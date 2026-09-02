import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import SearchBar from "@/components/SearchBar";
import NotificationsBell from "@/components/NotificationsBell";

export const metadata: Metadata = {
  title: "PrintSource — Consommables d'imprimerie au meilleur prix",
  description: "Consommables et machines d'impression importés directement, sans intermédiaire.",
};

const CATEGORIES_NAV = [
  { href: "/?categorie=tous", label: "Tous les articles" },
  { href: "/?categorie=dtf", label: "Imprimerie" },
  { href: "/?categorie=machines", label: "Sécurité" },
  { href: "/?categorie=supports", label: "Emballage" },
  { href: "/?categorie=encres", label: "Textile" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="font-sans">
        <CartProvider>
        <header className="sticky top-0 z-10">
          <div className="bg-clay-600 text-white text-xs">
            <div className="mx-auto max-w-6xl px-4 py-1.5 flex justify-end gap-4">
              <span>Livraison au Sénégal</span>
              <a href="/compte">Aide</a>
            </div>
          </div>

          <div className="bg-white border-b border-ink-900/10">
            <div className="mx-auto max-w-6xl flex items-center gap-4 px-4 py-3">
              <a href="/" className="text-lg font-semibold text-clay-600 whitespace-nowrap">PrintSource</a>
              <Suspense fallback={<div className="flex-1" />}>
                <SearchBar />
              </Suspense>
              <nav className="flex items-center gap-4 text-sm text-ink-900 whitespace-nowrap">
                <a href="/favoris">Favoris</a>
                <a href="/compte">Mon compte</a>
                <a href="/panier">Panier</a>
                <NotificationsBell />
              </nav>
            </div>
          </div>

          <div className="bg-paper border-b border-ink-900/10">
            <div className="mx-auto max-w-6xl px-4 py-2 flex gap-5 overflow-x-auto">
              {CATEGORIES_NAV.map((cat, i) => (
                <a
                  key={cat.href}
                  href={cat.href}
                  className={`text-xs whitespace-nowrap ${i === 0 ? "text-clay-600 font-medium" : "text-ink-900/60"}`}
                >
                  {cat.label}
                </a>
              ))}
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        <footer className="border-t border-ink-900/10 mt-16 py-8 text-sm text-ink-900/70">
          <div className="mx-auto max-w-6xl px-4">
            PrintSource — Import direct Chine, consommables et machines d&apos;impression.
          </div>
        </footer>
        </CartProvider>
      </body>
    </html>
  );
}

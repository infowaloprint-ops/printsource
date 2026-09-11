import type { Metadata } from "next";
import { Suspense } from "react";
import { Heart, User, ShoppingCart, MessageCircle } from "lucide-react";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import SearchBar from "@/components/SearchBar";
import NotificationsBell from "@/components/NotificationsBell";
import CartCountBadge from "@/components/CartCountBadge";
import NestedCategoryMenu from "@/components/NestedCategoryMenu";
import { NUMERO_WHATSAPP } from "@/lib/config";

export const metadata: Metadata = {
  title: "SourceTeranga — Import direct Chine au meilleur prix",
  description: "Consommables, machines et équipements professionnels importés directement, sans intermédiaire.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="font-sans">
        <CartProvider>
        <header className="no-print sticky top-0 z-10">
          <div className="bg-clay-600 text-white text-xs">
            <div className="mx-auto max-w-6xl px-4 py-1.5 flex justify-end gap-4">
              <span>Livraison au Sénégal</span>
              <a href="/compte">Aide</a>
            </div>
          </div>

          <div className="bg-white border-b border-ink-900/10">
            <div className="mx-auto max-w-6xl flex flex-wrap md:flex-nowrap items-center gap-3 md:gap-4 px-4 py-3">
              <div className="flex items-center justify-between w-full md:w-auto md:contents">
                <a href="/" className="text-lg font-semibold text-clay-600 whitespace-nowrap md:order-1">
                  SourceTeranga
                </a>
                <nav className="flex items-center gap-4 text-sm text-ink-900 whitespace-nowrap md:order-3">
                  <a href="/favoris" aria-label="Favoris" title="Favoris">
                    <Heart size={20} />
                  </a>
                  <a href="/compte" aria-label="Mon compte" title="Mon compte">
                    <User size={20} />
                  </a>
                  <a href="/panier" aria-label="Panier" title="Panier" className="flex items-center">
                    <ShoppingCart size={20} />
                    <CartCountBadge />
                  </a>
                  <a
                    href={`https://wa.me/${NUMERO_WHATSAPP}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Nous écrire sur WhatsApp"
                    title="Nous écrire sur WhatsApp"
                    className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center"
                  >
                    <MessageCircle size={18} fill="white" strokeWidth={0} />
                  </a>
                  <NotificationsBell />
                </nav>
              </div>
              <div className="w-full md:w-auto md:flex-1 md:order-2">
                <Suspense fallback={<div className="w-full h-10" />}>
                  <SearchBar />
                </Suspense>
              </div>
            </div>
          </div>

          <div className="bg-paper border-b border-ink-900/10">
            <div className="mx-auto max-w-6xl px-4 py-2 flex items-center gap-4 md:gap-6">
              <NestedCategoryMenu />
              <a href="/?categorie=tous" className="text-xs text-ink-900/60 whitespace-nowrap">
                Tous les articles
              </a>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        <footer className="no-print border-t border-ink-900/10 mt-16 py-8 text-sm text-ink-900/70">
          <div className="mx-auto max-w-6xl px-4">
            SourceTeranga — Import direct Chine, consommables et équipements professionnels.
          </div>
        </footer>
        </CartProvider>
      </body>
    </html>
  );
}

"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CartItem = {
  productId: string;
  nom: string;
  prixVente: number;
  poidsUnitaire: number;
  volumeUnitaire: number;
  moq: number;
  quantite: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantite">, quantite: number) => void;
  updateQuantite: (productId: string, quantite: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  selectedMode: string;
  setSelectedMode: (mode: string) => void;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "printsource_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedMode, setSelectedMode] = useState<string>("aerien");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setItems(JSON.parse(stored));
    const storedMode = localStorage.getItem(STORAGE_KEY + "_mode");
    if (storedMode) setSelectedMode(storedMode);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + "_mode", selectedMode);
  }, [selectedMode]);

  function addItem(item: Omit<CartItem, "quantite">, quantite: number) {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId ? { ...i, quantite: i.quantite + quantite } : i
        );
      }
      return [...prev, { ...item, quantite }];
    });
  }

  function updateQuantite(productId: string, quantite: number) {
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantite: Math.max(i.moq, quantite) } : i))
    );
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantite, removeItem, clearCart, selectedMode, setSelectedMode }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé à l'intérieur de <CartProvider>");
  return ctx;
}

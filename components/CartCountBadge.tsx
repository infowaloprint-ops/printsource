"use client";

import { useCart } from "@/lib/cart-context";

export default function CartCountBadge() {
  const { items } = useCart();
  const count = items.reduce((sum, i) => sum + i.quantite, 0);

  if (count === 0) return null;

  return (
    <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-clay-600 text-white text-[10px]">
      {count}
    </span>
  );
}

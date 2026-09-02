"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (value.trim()) params.set("q", value.trim());
    router.push(`/?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex max-w-xl">
      <input
        type="text"
        placeholder="Rechercher un article ou un modèle d'imprimante"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 rounded-l-md border-2 border-clay-600 border-r-0 px-3 text-sm h-10"
      />
      <button
        type="submit"
        className="bg-clay-600 text-white px-5 rounded-r-md text-sm font-medium h-10"
      >
        Rechercher
      </button>
    </form>
  );
}

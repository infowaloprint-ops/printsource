"use client";

const categories = [
  { id: "tous", label: "Tous les articles" },
  { id: "encres", label: "Encres" },
  { id: "dtf", label: "DTF" },
  { id: "supports", label: "Supports" },
  { id: "machines", label: "Machines" },
];

export default function CategoryFilter({
  active,
  onChange,
}: {
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`text-left text-sm px-3 py-2 rounded-md whitespace-nowrap transition-colors ${
            active === cat.id
              ? "bg-ink-950 text-white"
              : "text-ink-900 hover:bg-ink-900/5"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}

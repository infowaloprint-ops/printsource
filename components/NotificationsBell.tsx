"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Notification = {
  id: string;
  order_id: string | null;
  message: string;
  lue: boolean;
  created_at: string;
};

export default function NotificationsBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [ouvert, setOuvert] = useState(false);
  const [connecte, setConnecte] = useState(false);

  async function charger() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setConnecte(false);
      return;
    }
    setConnecte(true);

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("client_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    setNotifications((data as Notification[]) ?? []);
  }

  useEffect(() => {
    charger();
    // Rafraîchit toutes les 30 secondes pour simuler du temps réel simple
    const interval = setInterval(charger, 30000);
    return () => clearInterval(interval);
  }, []);

  async function ouvrirEtMarquerLues() {
    setOuvert((o) => !o);
    const nonLues = notifications.filter((n) => !n.lue);
    if (nonLues.length > 0) {
      await supabase
        .from("notifications")
        .update({ lue: true })
        .in("id", nonLues.map((n) => n.id));
      setNotifications((prev) => prev.map((n) => ({ ...n, lue: true })));
    }
  }

  if (!connecte) return null;

  const nonLuesCount = notifications.filter((n) => !n.lue).length;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={ouvrirEtMarquerLues}
        aria-label="Notifications"
        className="relative w-8 h-8 flex items-center justify-center"
      >
        🔔
        {nonLuesCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-clay-600 text-white text-[10px] flex items-center justify-center">
            {nonLuesCount}
          </span>
        )}
      </button>

      {ouvert && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-ink-900/10 rounded-md shadow-lg z-20 max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-sm text-ink-900/50 p-3">Aucune notification pour l&apos;instant.</p>
          ) : (
            notifications.map((n) => (
              <Link
                key={n.id}
                href={n.order_id ? `/commande/${n.order_id}` : "/compte"}
                onClick={() => setOuvert(false)}
                className="block p-3 text-sm border-b border-ink-900/5 hover:bg-paper"
              >
                <p>{n.message}</p>
                <p className="text-xs text-ink-900/40 mt-1">
                  {new Date(n.created_at).toLocaleDateString("fr-FR")}
                </p>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}

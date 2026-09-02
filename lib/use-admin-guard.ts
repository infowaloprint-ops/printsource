"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useAdminGuard() {
  const [statut, setStatut] = useState<"chargement" | "autorise" | "refuse">("chargement");

  useEffect(() => {
    async function verifier() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setStatut("refuse");
        return;
      }

      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

      setStatut(profile?.role === "admin" ? "autorise" : "refuse");
    }
    verifier();
  }, []);

  return statut;
}

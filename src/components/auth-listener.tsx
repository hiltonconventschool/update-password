
"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function AuthListener() {
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'USER_UPDATED' && session?.user) {
        toast({
          title: "Success!",
          description: "Your email address has been successfully updated.",
        });
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [toast]);

  return null;
}

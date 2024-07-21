import Header from "@/components/layout/header";
import Sidebar from "../components/layout/sidebar";
import { createContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/component";
import { Session } from "@supabase/supabase-js";

export const SessionContext = createContext<Session | null>(null);

const supabase = createClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <SessionContext.Provider value={session}>
      <div className="flex w-full min-h-screen bg-muted/40">
        <Sidebar />
        <div className="flex flex-col w-full sm:gap-4 sm:py-4 sm:pl-14">
          <Header />
          {children}
        </div>
      </div>
    </SessionContext.Provider>
  );
}

import Header from "@/components/layout/header";
import Sidebar from "../components/layout/sidebar";
import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/component";
import { Session } from "@supabase/supabase-js";
import {
  ApiResponseActiveHousehold,
  ActiveHousehold,
} from "./api/households/active";
import { AppContext } from "@/components/app-context";

export const SessionContext = createContext<Session | null>(null);

export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSessionContext must be used within SessionContext");
  }
  return context;
};

const supabase = createClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      <AppContext.Provider
        value={{ isRefreshing, setIsRefreshing, isSubmitting, setIsSubmitting }}
      >
        <div className="flex w-full min-h-screen bg-muted/40">
          <Sidebar />
          <div className="flex flex-col w-full sm:gap-4 sm:py-4 sm:pl-14">
            <Header />
            {children}
          </div>
        </div>
      </AppContext.Provider>
    </SessionContext.Provider>
  );
}

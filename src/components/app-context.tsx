import { createContext, useContext } from "react";

interface AppContext {
  isRefreshing: boolean;
  setIsRefreshing: (isRefreshing: boolean) => void;

  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
}

export const AppContext = createContext<AppContext | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a AppContextProvider");
  }

  return context;
};

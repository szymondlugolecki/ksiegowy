import { createContext, useContext } from "react";

interface HouseholdContext {
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  isLimitReached: boolean;
  setIsLimitReached: (isLimitReached: boolean) => void;
  ownerId: string | null;
}

export const HouseholdContext = createContext<HouseholdContext | undefined>(
  undefined
);

export const useHouseholdContext = () => {
  const context = useContext(HouseholdContext);
  if (!context) {
    throw new Error(
      "useHouseholdContext must be used within a HouseholdContextProvider"
    );
  }

  return context;
};

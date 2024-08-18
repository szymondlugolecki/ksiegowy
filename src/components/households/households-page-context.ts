import { createContext, useContext } from "react";

interface HouseholdsPageContext {
  isLimitReached: boolean;
  setIsLimitReached: (isLimitReached: boolean) => void;
  ownerId: string | null;
}

export const HouseholdsPageContext = createContext<
  HouseholdsPageContext | undefined
>(undefined);

export const useHouseholdsPageContext = () => {
  const context = useContext(HouseholdsPageContext);
  if (!context) {
    throw new Error(
      "useHouseholdsPageContext must be used within a HouseholdsPageContextProvider"
    );
  }

  return context;
};

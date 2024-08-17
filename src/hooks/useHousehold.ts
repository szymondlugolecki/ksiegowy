import {
  ActiveHousehold,
  ApiResponseActiveHousehold,
} from "@/pages/api/households/active";
import { useQuery } from "@tanstack/react-query";

const fetchActiveHousehold = async (): Promise<ActiveHousehold> => {
  const response = await fetch("/api/households/active");
  if (!response.ok) {
    throw new Error("Błąd serwera podczas pobierania aktualnego domostwa");
  }

  const data: ApiResponseActiveHousehold = await response.json();

  if (!("success" in data) || !data.data) {
    throw new Error("Błąd serwera podczas pobierania aktualnego domostwa");
  }

  console.log("data.data", data.data);

  return data.data;
};

const useActiveHousehold = (initialData?: ActiveHousehold) => {
  return useQuery({
    queryKey: ["household"],
    queryFn: () => fetchActiveHousehold(),
    initialData,
  });
};

export { useActiveHousehold, fetchActiveHousehold };

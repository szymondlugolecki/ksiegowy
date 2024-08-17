import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SelectHousehold } from "@/lib/db/tables/households";

import HouseholdListRow from "./row-form";
import { useActiveHousehold } from "@/hooks/useHousehold";

interface HouseholdListProps {
  households: Pick<SelectHousehold, "id" | "name" | "invitationCode">[];
}

export default function HouseholdList({ households }: HouseholdListProps) {
  const {
    data: activeHousehold,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useActiveHousehold();

  if (isLoading) {
    return null;
  }

  if (isError) {
    return <span>Błąd: {error.message}</span>;
  }

  if (isSuccess) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Domostwa {households.length ? `(${households.length})` : ""}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-48 overflow-y-auto">
          {households.map((household, index) => (
            <HouseholdListRow
              household={household}
              key={index}
              active={!!activeHousehold && household.id === activeHousehold.id}
            />
          ))}
        </CardContent>
      </Card>
    );
  }
}

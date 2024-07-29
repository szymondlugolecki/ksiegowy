import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SelectHousehold } from "@/lib/db/tables/households";

import HouseholdListRow from "./row-form";

interface HouseholdListProps {
  households: Pick<SelectHousehold, "id" | "name" | "invitationCode">[];
  activeHousehold: SelectHousehold["id"] | undefined;
}
export default function HouseholdList({
  households,
  activeHousehold,
}: HouseholdListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Domostwa</CardTitle>
      </CardHeader>
      <CardContent>
        {households.map((household, index) => (
          <HouseholdListRow
            household={household}
            key={index}
            active={!!activeHousehold && household.id === activeHousehold}
          />
        ))}
      </CardContent>
    </Card>
  );
}

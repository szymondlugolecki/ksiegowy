import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SelectHousehold } from "@/lib/db/tables/households";

import HouseholdListRow from "./row-form";
import { useActiveHousehold } from "@/hooks/useHousehold";
import HouseholdDeleteForm from "./delete-form";
import { createClient } from "@/lib/supabase/component";
import { useContext } from "react";
import { SessionContext, useSessionContext } from "@/pages/layout";
import { DeleteHouseholdDialog } from "./delete-dialog";

interface HouseholdListProps {
  households: Pick<
    SelectHousehold,
    "id" | "name" | "invitationCode" | "ownerId"
  >[];
}

export default function HouseholdList({ households }: HouseholdListProps) {
  const session = useSessionContext();

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
            <div className="flex items-end gap-x-1" key={index}>
              <HouseholdListRow
                household={household}
                active={
                  !!activeHousehold && household.id === activeHousehold.id
                }
              />
              {session?.user.id === household.ownerId}
              <DeleteHouseholdDialog>
                <HouseholdDeleteForm householdId={household.id} />
              </DeleteHouseholdDialog>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }
}

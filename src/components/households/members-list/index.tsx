import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { HouseholdMember } from "@/pages/households";
import { UserPlus } from "lucide-react";
import HouseholdMembersTable from "./table";
import InviteUserDialog from "./invite-user-dialog";
import { useActiveHousehold } from "@/hooks/useHousehold";

export default function HouseholdMembersList({
  householdMembers,
}: {
  householdMembers: HouseholdMember[];
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          Członkowie domostwa
        </CardTitle>
        <InviteUserDialog>
          <Button variant="outline" size="sm" className="gap-1">
            <UserPlus className="w-4 h-4" />
            Zaproś członka
          </Button>
        </InviteUserDialog>
      </CardHeader>
      <CardContent>
        <HouseholdMembersTable householdMembers={householdMembers} />
      </CardContent>
    </Card>
  );
}

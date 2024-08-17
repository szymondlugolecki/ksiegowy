import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { HouseholdMember } from "@/pages/households";
import {
  CircleHelp,
  Crown,
  EllipsisIcon,
  HomeIcon,
  MessageCircleQuestion,
  PlusIcon,
  UserPlus,
} from "lucide-react";
import { useHouseholdsPageContext } from "../households-page-context";

export default function HouseholdMembersTable({
  householdMembers,
}: {
  householdMembers: HouseholdMember[];
}) {
  const { ownerId } = useHouseholdsPageContext();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Imię i nazwisko</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="text-right">Akcje</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {householdMembers
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map(({ id, fullName, email, avatarURL }, index) => (
            <TableRow key={index}>
              <TableCell className="flex items-center gap-x-1.5">
                {fullName}{" "}
                {id === ownerId ? (
                  <Crown className="w-4 h-4 text-yellow-500" />
                ) : null}{" "}
              </TableCell>
              <TableCell>{email}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <EllipsisIcon className="w-5 h-5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}

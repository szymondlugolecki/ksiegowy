import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  CircleHelp,
  EllipsisIcon,
  HomeIcon,
  MessageCircleQuestion,
  PlusIcon,
  UserPlus,
} from "lucide-react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { createClient } from "@/lib/supabase/server-props";
import HouseholdCreateForm from "@/components/households/create/form";
import HouseholdJoinForm from "@/components/households/join/form";
import { db } from "@/lib/db";
import { trytm } from "@/lib/utils";
import HouseholdList from "@/components/households/list";
import { eq } from "drizzle-orm";
import { profilesTable } from "@/lib/db/tables/profiles";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = createClient(context);

  const { data, error } = await supabase.auth.getUser();
  // console.log("get user", data, error);

  if (error || !data) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const [householdsRaw, fetchHouseholdsError] = await trytm(
    db.query.householdsTable.findMany({
      columns: {
        id: true,
        name: true,
        invitationCode: true,
      },
      with: {
        usersWithActiveHousehold: {
          where: eq(profilesTable.id, data.user.id),
          columns: {
            id: true,
          },
        },
      },
    })
  );
  if (fetchHouseholdsError) {
    console.error("fetchHouseholdsError", fetchHouseholdsError);
    throw new Error("Błąd serwera podczas pobierania listy domostw");
  }

  const households = householdsRaw.map(
    ({ usersWithActiveHousehold, ...rest }) => ({ ...rest })
  );

  return {
    props: {
      user: data.user,
      households,
      activeHousehold: householdsRaw.find(
        ({ usersWithActiveHousehold }) => usersWithActiveHousehold.length > 0
      )?.id,
    },
  };
}

export default function HouseholdsPage({
  user,
  households,
  activeHousehold,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main className="grid items-start flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Households List */}
        <HouseholdList
          households={households}
          activeHousehold={activeHousehold}
        />

        {/* Create Household */}
        <HouseholdCreateForm />

        {/* Join Household */}
        <HouseholdJoinForm />
      </div>

      {/* Household Members */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Członkowie domostwa
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-1">
            <UserPlus className="w-4 h-4" />
            Zaproś członka
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imię i nazwisko</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>John Smith</TableCell>
                <TableCell>john@example.com</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <EllipsisIcon className="w-5 h-5" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Jane Smith</TableCell>
                <TableCell>jane@example.com</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <EllipsisIcon className="w-5 h-5" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Johnny Smith</TableCell>
                <TableCell>johnny@example.com</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <EllipsisIcon className="w-5 h-5" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Janie Smith</TableCell>
                <TableCell>janie@example.com</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <EllipsisIcon className="w-5 h-5" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}

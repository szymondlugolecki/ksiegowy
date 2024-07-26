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
import HouseholdCreateForm from "@/components/forms/expenses/households/create/form";
import HouseholdJoinForm from "@/components/forms/expenses/households/join/form";
import { db } from "@/lib/db";
import { trytm } from "@/lib/utils";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = createClient(context);

  const { data, error } = await supabase.auth.getUser();
  console.log("get user", data, error);

  if (error || !data) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const [households, fetchHouseholdsError] = await trytm(
    db.query.householdsTable.findMany({
      columns: {
        id: true,
        name: true,
        invitationCode: true,
      },
    })
  );

  console.log("households", households);

  if (fetchHouseholdsError) {
    console.error("fetchHouseholdsError", fetchHouseholdsError);
    throw new Error("Błąd serwera podczas pobierania listy domostw");
  }

  return {
    props: {
      user: data.user,
      households,
    },
  };
}

export default function HouseholdsPage({
  user,
  households,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main className="grid items-start flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Households List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Domostwa</CardTitle>
            <Button variant="outline" size="sm" className="gap-1">
              <PlusIcon className="w-4 h-4" />
              Stwórz domostwo
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {households.map((household) => (
                <div
                  key={household.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <HomeIcon className="w-5 h-5" />
                    <div>
                      <div className="font-medium">{household.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {household.invitationCode}
                      </div>
                    </div>
                  </div>
                  <Button variant="secondary" className="rounded-full">
                    Aktywuj
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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

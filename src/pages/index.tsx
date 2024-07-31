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
import { PlusIcon } from "lucide-react";
import MonthlyExpensesCard from "../components/monthly-expenses-card";
import DateTooltip from "../components/tables/date-tooltip";

import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
} from "next";
import type { User } from "lucia";
import { createClient } from "@/lib/supabase/server-props";
// import { AddExpenseDrawer } from "@/components/forms/expenses/add/drawer";
import dynamic from "next/dynamic";
import { parsePLN, trytm } from "@/lib/utils";
import { db } from "@/lib/db";
import { profilesTable } from "@/lib/db/tables/profiles";
import { eq } from "drizzle-orm";
import { redirect } from "next/dist/server/api-utils";
import { useEffect } from "react";
import { toast } from "sonner";

const AddExpenseDrawer = dynamic(
  () => import("@/components/households/expenses/add/drawer"),
  {
    loading: () => (
      <Button variant="outline" size="sm">
        Ładowanie...
      </Button>
    ),
    // SSR won't be necessary (probably)
    ssr: false,
  }
);

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

  const [userProfile, fetchUserProfileError] = await trytm(
    db.query.profilesTable.findFirst({
      columns: {},
      where: eq(profilesTable.id, data.user.id),
      with: {
        activeHousehold: {
          columns: {
            id: true,
            name: true,
          },
          with: {
            expenses: {
              columns: {
                id: true,
                amount: true,
                title: true,
                description: true,
                createdAt: true,
              },
              with: {
                user: {
                  columns: {
                    id: true,
                    fullName: true,
                    avatarURL: true,
                  },
                },
              },
            },
          },
        },
      },
    })
  );

  if (fetchUserProfileError) {
    console.error("fetchUserProfileError", fetchUserProfileError);
    throw new Error("Błąd serwera podczas pobierania profilu użytkownika");
  }

  if (!userProfile) {
    console.error("userProfile", userProfile);
    throw new Error("Nie znaleziono profilu użytkownika");
  }

  if (!userProfile.activeHousehold) {
    console.error("active household not found", "redirecting to /households");
    return {
      redirect: {
        destination: "/households",
        permanent: false,
      },
    };
  }

  const expenses = userProfile.activeHousehold.expenses.map(
    ({ createdAt, ...rest }) => ({
      ...rest,
      createdAt: createdAt && createdAt.toISOString(),
    })
  );
  const household = {
    id: userProfile.activeHousehold.id,
    name: userProfile.activeHousehold.name,
  };

  return {
    props: {
      user: data.user,
      expenses,
      household,
    },
  };
}

export default function HomePage({
  user,
  expenses,
  household,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const now = new Date();
  console.log(now);
  // console.log("user", user);

  useEffect(() => {
    toast("Wydatki zostały załadowane");
  }, []);

  return (
    <main className="flex flex-col items-start flex-1 sm:px-6 sm:py-0 gap-y-4">
      <MonthlyExpensesCard />
      <Card className="w-full max-w-5xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Ostatnie wydatki
          </CardTitle>
          <AddExpenseDrawer household={household}>
            <Button variant="outline" size="sm" className="gap-1">
              <PlusIcon className="w-4 h-4" />
              Dodaj wydatek
            </Button>
          </AddExpenseDrawer>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Nazwa</TableHead>
                <TableHead>Dodał(a)</TableHead>
                <TableHead className="text-right">Kwota</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map(
                (
                  { id, title, description, amount, user, createdAt },
                  index
                ) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        {createdAt ? (
                          <DateTooltip date={new Date(createdAt)} />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>{title}</TableCell>
                      <TableCell>{user.fullName.split(" ")[0]}</TableCell>
                      <TableCell className="text-right">
                        {parsePLN(amount)}
                      </TableCell>
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}

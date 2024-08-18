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
import { PlusIcon, XCircleIcon } from "lucide-react";
import MonthlyExpensesCard from "../components/monthly-expenses-card";
import DateTooltip from "../components/tables/date-tooltip";

import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
} from "next";
import { createClient } from "@/lib/supabase/server-props";
// import { AddExpenseDrawer } from "@/components/forms/expenses/add/drawer";
import dynamic from "next/dynamic";
import { formatPLN, trytm } from "@/lib/utils";
import { db } from "@/lib/db";
import { profilesTable } from "@/lib/db/tables/profiles";
import { eq } from "drizzle-orm";
import { redirect } from "next/dist/server/api-utils";
import { useEffect } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { ActiveHousehold } from "./api/households/active";
import { useActiveHousehold } from "@/hooks/useHousehold";
import Spinner from "@/components/spinner";

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
  // Get user data/session
  const supabase = createClient(context);
  const { data, error } = await supabase.auth.getUser();
  // console.log("get user", data, error);

  // Redirect to login if there's an error or no user data
  if (error || !data) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // Fetch household data from the database
  const [userProfile, fetchUserProfileError] = await trytm(
    db.query.profilesTable.findFirst({
      columns: {},
      where: eq(profilesTable.id, data.user.id),
      with: {
        activeHousehold: {
          columns: {
            id: true,
            name: true,
            invitationCode: true,
            ownerId: true,
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

  // Handle errors
  if (fetchUserProfileError) {
    console.error("fetchUserProfileError", fetchUserProfileError);
    throw new Error("Błąd serwera podczas pobierania profilu użytkownika");
  }
  if (!userProfile) {
    console.error("userProfile", userProfile);
    throw new Error("Nie znaleziono profilu użytkownika");
  }

  // Redirect to /households if there's no active household
  if (!userProfile.activeHousehold) {
    console.error("active household not found", "redirecting to /households");
    return {
      redirect: {
        destination: "/households",
        permanent: false,
      },
    };
  }

  const monthlyExpensesTotal = userProfile.activeHousehold.expenses.reduce(
    (acc, expense) => acc + Number(expense.amount),
    0
  );

  // Map expenses to a format that's easier to work with
  const expenses = userProfile.activeHousehold.expenses.map(
    ({ createdAt, ...rest }) => ({
      ...rest,
      createdAt: createdAt && createdAt.toISOString(),
    })
  );
  const household: ActiveHousehold = {
    id: userProfile.activeHousehold.id,
    name: userProfile.activeHousehold.name,
    invitationCode: userProfile.activeHousehold.invitationCode,
    ownerId: userProfile.activeHousehold.ownerId,
  };

  return {
    props: {
      user: data.user,
      expenses,
      initialHousehold: household,
      monthlyExpensesTotal,
    },
  };
}

export default function HomePage({
  user,
  expenses,
  initialHousehold,
  monthlyExpensesTotal,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const activeHouseholdQueryData = useActiveHousehold(initialHousehold);

  const AddExpenseButton = () => {
    const { data, isLoading, isError, isSuccess } = activeHouseholdQueryData;
    if (isLoading) {
      return (
        <Button variant="outline" size="sm" className="gap-1" disabled>
          <Spinner />
        </Button>
      );
    }

    if (isError) {
      return (
        <Button variant="outline" size="sm" className="gap-1" disabled>
          <XCircleIcon className="w-4 h-4" />
          Błąd serwera
        </Button>
      );
    }

    if (isSuccess) {
      return (
        <AddExpenseDrawer household={data}>
          <Button variant="outline" size="sm" className="gap-1">
            <PlusIcon className="w-4 h-4" />
            Dodaj wydatek
          </Button>
        </AddExpenseDrawer>
      );
    }

    return null;
  };

  return (
    <main className="flex flex-col items-start flex-1 sm:px-6 sm:py-0 gap-y-4">
      <MonthlyExpensesCard monthlyExpensesTotal={monthlyExpensesTotal} />
      <Card className="w-full max-w-5xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Ostatnie wydatki
          </CardTitle>
          {AddExpenseButton()}
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
                        {formatPLN(amount)}
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

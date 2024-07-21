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

const AddExpenseDrawer = dynamic(
  () => import("@/components/forms/expenses/add/drawer"),
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

  console.log("get user", data, error);

  if (error || !data) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: data.user,
    },
  };
}

export default function HomePage({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const now = new Date();
  console.log(now);
  // console.log("user", user);

  return (
    <main className="flex flex-col items-start flex-1 sm:px-6 sm:py-0 gap-y-4">
      <MonthlyExpensesCard />
      <Card className="w-full max-w-5xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Ostatnie wydatki
          </CardTitle>
          <AddExpenseDrawer
            household={{
              id: "1",
              name: "Długołęccy",
            }}
          >
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
                <TableHead>Opis</TableHead>
                <TableHead className="text-right">Kwota</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <DateTooltip date={now} />
                </TableCell>
                <TableCell>Paliwo</TableCell>
                <TableCell>Szymon</TableCell>
                <TableCell className="text-right">87.34</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <DateTooltip date={now} />
                </TableCell>{" "}
                <TableCell>Biedronka</TableCell>
                <TableCell>Zakupy na Wielkanoc</TableCell>
                <TableCell className="text-right">45.23</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}

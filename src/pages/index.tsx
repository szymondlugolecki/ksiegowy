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
import { MonthlyExpensesCard } from "./(components)/monthly-expenses-card";
import { DateTooltip } from "./(components)/date-tooltip";

const now = new Date();

export default function HomePage() {
  return (
    <main className="flex flex-col flex-1 items-start sm:px-6 sm:py-0 gap-y-4">
      <MonthlyExpensesCard />
      <Card className="w-full max-w-5xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Ostatnie wydatki
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-1">
            <PlusIcon className="h-4 w-4" />
            Dodaj wydatek
          </Button>
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

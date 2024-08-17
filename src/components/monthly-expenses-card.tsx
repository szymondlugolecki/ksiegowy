import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

const MonthlyExpensesCard = ({
  monthlyExpensesTotal,
}: {
  monthlyExpensesTotal: number;
}) => {
  const formattedTotal = Intl.NumberFormat("pl", {
    style: "currency",
    currency: "PLN",
  }).format(monthlyExpensesTotal);

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Wydatki, Lipiec</CardTitle>
        <DollarSign className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedTotal}</div>
        <p className="text-xs text-muted-foreground">
          +5.2% od ostatniego miesiąca
        </p>
      </CardContent>
    </Card>
  );
};

export default MonthlyExpensesCard;

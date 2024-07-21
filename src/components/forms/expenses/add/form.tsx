import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  addExpenseFormSchema,
  type AddExpenseForm,
} from "@/lib/db/tables/expenses";
import RequiredAsterisk from "@/components/required-asterisk";
import { ApiResponse, HouseholdData } from "@/lib/types";
import { toast } from "sonner";

export default function AddExpenseForm({
  household,
}: {
  household: HouseholdData;
}) {
  const form = useForm<AddExpenseForm>({
    resolver: zodResolver(addExpenseFormSchema),
    defaultValues: {
      title: "",
      householdId: household.id,
      amount: 0,
      description: "",
    },
  });

  async function onSubmit(values: AddExpenseForm) {
    console.log("sending data", values);

    const response = await fetch("/api/expenses/add", {
      method: "POST",
      body: JSON.stringify(values),
    });

    console.log("response", response);
    const data: ApiResponse = await response.json();
    console.log("data", data);

    if ("error" in data) {
      toast.error(data.message);
    }
    toast(data.message);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Wydatek
                <RequiredAsterisk />
              </FormLabel>
              <FormControl>
                <Input placeholder="Paliwo" {...field} />
              </FormControl>
              <FormDescription>
                Krótko opisz wydatek, np. Biedronka
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Kwota
                <RequiredAsterisk />
              </FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" step={0.01} {...field} />
              </FormControl>
              <FormDescription>Kwota w PLN</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Opis (opcjonalne)</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>Dodatkowe szczegóły wydatku</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="householdId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domostwo</FormLabel>
              <Input disabled value={household.name} />
              <FormControl className="hidden">
                <Input type="text" {...field} hidden />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Dodaj
        </Button>
      </form>
    </Form>
  );
}

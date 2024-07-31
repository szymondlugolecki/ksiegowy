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

import RequiredAsterisk from "@/components/required-asterisk";
import { ApiResponse, HouseholdData } from "@/lib/types";
import { toast } from "sonner";
import {
  addExpenseFormSchema,
  type AddExpenseForm,
} from "@/lib/schemas/expenses";
import Spinner from "@/components/spinner";

export default function AddExpenseForm({
  household,
  isSubmitting,
  setIsSubmitting,
  setIsDrawerOpen,
}: {
  household: HouseholdData;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setIsDrawerOpen: (isDrawerOpen: boolean) => void;
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

    setIsSubmitting(true);
    const response = await fetch("/api/expenses/add", {
      method: "POST",
      body: JSON.stringify(values),
    });

    console.log("response", response);
    const data: ApiResponse = await response.json();
    setIsSubmitting(false);
    console.log("data", data);

    if ("error" in data) {
      toast.error(data.message);
      return;
    } else {
      setIsDrawerOpen(false);
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
                <Input
                  placeholder="Paliwo"
                  {...field}
                  disabled={isSubmitting}
                />
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
                <Input
                  type="number"
                  placeholder="0"
                  step={0.01}
                  disabled={isSubmitting}
                  {...field}
                />
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
                <Textarea {...field} disabled={isSubmitting} />
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

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : "Dodaj"}
        </Button>
      </form>
    </Form>
  );
}

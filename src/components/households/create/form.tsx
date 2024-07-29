import { Button } from "@/components/ui/button";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { GetServerSidePropsContext } from "next";
import { createClient } from "@/lib/supabase/server-props";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateHouseholdForm,
  createHouseholdFormSchema,
} from "@/lib/schemas/households";
import { ApiResponse } from "@/lib/types";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import RequiredAsterisk from "@/components/required-asterisk";
import { useRouter } from "next/router";

export default function HouseholdCreateForm() {
  const router = useRouter();
  const form = useForm<CreateHouseholdForm>({
    resolver: zodResolver(createHouseholdFormSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: CreateHouseholdForm) {
    console.log("sending data", values);

    const response = await fetch("/api/households/create", {
      method: "POST",
      body: JSON.stringify(values),
    });

    console.log("response", response);
    const data: ApiResponse = await response.json();
    console.log("data", data);

    if ("error" in data) {
      toast.error(data.message);
    }

    router.reload();
    toast(data.message);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Nowe domostwo</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Domostwo
                    <RequiredAsterisk />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Kowalscy" {...field} />
                  </FormControl>
                  <FormDescription>
                    Nazwa domostwa, przykładowo nazwisko rodziny
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="justify-self-end">
              Stwórz
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

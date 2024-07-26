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
  JoinHouseholdForm,
  joinHouseholdFormSchema,
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

export default function HouseholdJoinForm() {
  const router = useRouter();
  const form = useForm<JoinHouseholdForm>({
    resolver: zodResolver(joinHouseholdFormSchema),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(values: JoinHouseholdForm) {
    console.log("sending data", values);

    const response = await fetch("/api/households/join", {
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
        <CardTitle className="text-sm font-medium">
          Dołącz do domostwa
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-8">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Kod zaproszenia
                    <RequiredAsterisk />
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Kod zaproszenia udostępniony przez członka domostwa
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="justify-self-end">
              Dołącz
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

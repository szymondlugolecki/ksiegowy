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
import { ApiResponse, ApiSuccessResponse } from "@/lib/types";
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
import { Badge } from "@/components/ui/badge";
import { useContext } from "react";
import { useHouseholdsPageContext } from "../households-page-context";
import { useAppContext } from "@/components/app-context";
import ky from "ky";

export default function HouseholdJoinForm() {
  const { isSubmitting, setIsSubmitting, setIsRefreshing } = useAppContext();
  const { isLimitReached } = useHouseholdsPageContext();
  const router = useRouter();
  const form = useForm<JoinHouseholdForm>({
    resolver: zodResolver(joinHouseholdFormSchema),
    defaultValues: {
      code: "",
    },
  });

  const disabled = isSubmitting || isLimitReached;

  const refreshData = async () => {
    setIsRefreshing(true);
    await router.replace(router.asPath);
    setIsRefreshing(false);
  };

  async function onSubmit(values: JoinHouseholdForm) {
    console.log("sending data", values);

    setIsSubmitting(true);
    ky.post("/api/households/join", { json: values })
      .json<ApiSuccessResponse>()
      .then(async (data) => {
        console.log("data", data);
        await refreshData();
        toast(data.message);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Wystąpił błąd: " + error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          Dołącz do domostwa
        </CardTitle>
        {isLimitReached && <Badge variant="destructive">LIMIT: 5</Badge>}
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
                    <Input {...field} disabled={disabled} />
                  </FormControl>
                  <FormDescription>
                    Kod zaproszenia udostępniony przez członka domostwa
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={disabled}
              type="submit"
              className="justify-self-end"
            >
              Dołącz
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

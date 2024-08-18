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
import { useHouseholdsPageContext } from "../households-page-context";
import { useAppContext } from "@/components/app-context";
import { useEffect } from "react";
import ky from "ky";
import { useQueryClient } from "@tanstack/react-query";

export default function HouseholdCreateForm() {
  const { isLimitReached } = useHouseholdsPageContext();
  const { setIsRefreshing, isSubmitting, setIsSubmitting } = useAppContext();
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    setIsRefreshing(false);
  }, []);

  const form = useForm<CreateHouseholdForm>({
    resolver: zodResolver(createHouseholdFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const disabled = isSubmitting || isLimitReached;

  const refreshData = async () => {
    setIsRefreshing(true);
    await router.replace(router.asPath);
    setIsRefreshing(false)
  };

  async function onSubmit(values: CreateHouseholdForm) {
    console.log("sending data", values);
    setIsSubmitting(true);
    ky.post("/api/households/create", { json: values })
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
        <CardTitle className="text-sm font-medium">Stwórz domostwo</CardTitle>
        {isLimitReached && <Badge variant="destructive">LIMIT: 5</Badge>}
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
                    <Input
                      placeholder="Kowalscy"
                      disabled={disabled}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Nazwa domostwa, przykładowo nazwisko rodziny
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
              Stwórz
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

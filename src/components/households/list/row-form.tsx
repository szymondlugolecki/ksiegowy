import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HomeIcon, RefreshCcw } from "lucide-react";
import { SelectHousehold } from "@/lib/db/tables/households";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChangeActiveHouseholdForm,
  changeActiveHouseholdFormSchema,
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
import { useHouseholdsPageContext } from "../households-page-context";
import { useAppContext } from "@/components/app-context";
import ky from "ky";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface HouseholdListRowProps {
  household: Pick<SelectHousehold, "id" | "name" | "invitationCode">;
  active: boolean;
}

export default function HouseholdListRow({
  household,
  active,
}: HouseholdListRowProps) {
  const { isSubmitting, setIsSubmitting, setIsRefreshing } = useAppContext();
  const queryClient = useQueryClient();
  const router = useRouter();
  const form = useForm<ChangeActiveHouseholdForm>({
    resolver: zodResolver(changeActiveHouseholdFormSchema),
    defaultValues: {
      id: household.id,
    },
  });

  const refreshData = async () => {
    setIsRefreshing(true);
    queryClient.invalidateQueries({
      queryKey: ["household"],
    });
    await router.replace(router.asPath);
    setIsRefreshing(false);
  };

  async function onSubmit(values: ChangeActiveHouseholdForm) {
    console.log("sending data", values);

    setIsSubmitting(true);

    ky.post("/api/households/activate", { json: values })
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 bg-card grow"
      >
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} className="hidden" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HomeIcon className="w-5 h-5" />
            <div>
              <div className="font-medium">{household.name}</div>
              <div className="text-xs text-muted-foreground">
                {household.invitationCode}
              </div>
            </div>
          </div>
          {active ? null : (
            <Button
              type="submit"
              variant="secondary"
              size="icon"
              disabled={isSubmitting}
            >
              <RefreshCcw className="w-5 h-5" />
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}

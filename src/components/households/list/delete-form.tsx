import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HomeIcon, TrashIcon } from "lucide-react";
import { SelectHousehold } from "@/lib/db/tables/households";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChangeActiveHouseholdForm,
  changeActiveHouseholdFormSchema,
  DeleteHouseholdForm,
  deleteHouseholdFormSchema,
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
import { AlertDialogAction } from "@/components/ui/alert-dialog";

interface HouseholdListRowProps {
  householdId: SelectHousehold["id"];
}

export default function HouseholdDeleteForm({
  householdId,
}: HouseholdListRowProps) {
  const { isSubmitting, setIsSubmitting, setIsRefreshing, isRefreshing } =
    useAppContext();
  const queryClient = useQueryClient();
  const router = useRouter();
  const form = useForm<DeleteHouseholdForm>({
    resolver: zodResolver(deleteHouseholdFormSchema),
    defaultValues: {
      id: householdId,
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

  const disabled = isSubmitting || isRefreshing;

  async function onSubmit(values: DeleteHouseholdForm) {
    console.log("sending data", values);

    setIsSubmitting(true);

    ky.delete("/api/households/delete", { json: values })
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
        className="flex flex-col bg-card"
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

        <AlertDialogAction
          className="bg-red-500"
          disabled={disabled}
          type="submit"
        >
          USUŃ
        </AlertDialogAction>
      </form>
    </Form>
  );
}

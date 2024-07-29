import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HomeIcon } from "lucide-react";
import { SelectHousehold } from "@/lib/db/tables/households";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChangeActiveHouseholdForm,
  changeActiveHouseholdFormSchema,
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

interface HouseholdListRowProps {
  household: Pick<SelectHousehold, "id" | "name" | "invitationCode">;
  active: boolean;
}

export default function HouseholdListRow({
  household,
  active,
}: HouseholdListRowProps) {
  const router = useRouter();
  const form = useForm<ChangeActiveHouseholdForm>({
    resolver: zodResolver(changeActiveHouseholdFormSchema),
    defaultValues: {
      id: household.id,
    },
  });

  async function onSubmit(values: ChangeActiveHouseholdForm) {
    console.log("sending data", values);

    const response = await fetch("/api/households/activate", {
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 bg-card"
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
            <Button type="submit" variant="secondary">
              Aktywuj
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}

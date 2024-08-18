import { useAppContext } from "@/components/app-context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import type { ReactNode } from "react";

export function DeleteHouseholdDialog({ children }: { children: ReactNode }) {
  const { isSubmitting } = useAppContext();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant="ghost" disabled={isSubmitting}>
          <TrashIcon className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Jesteś pewny/a, że chcesz usunąć to domostwo?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Ta akcja jest nieodwracalna i spowoduje trwałe usunięcie domostwa,
            wszystkich jego wydatków i listy zakupów.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          {children}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ActiveHousehold } from "@/pages/api/households/active";
import { Copy } from "lucide-react";

export default function InviteUserDialog({
  children,
  activeHousehold: household,
}: {
  children: React.ReactNode;
  activeHousehold: ActiveHousehold;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
        {/* <Button variant="outline">Share</Button> */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Udostępnij kod zaproszenia</DialogTitle>
          <DialogDescription>
            Ten kod pozwala dołączyć do tego domostwa
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="invitationCode" className="sr-only">
              Kod zaproszenia
            </Label>
            <Input
              id="invitationCode"
              defaultValue={household.invitationCode}
              readOnly
            />
          </div>
          <Button
            type="submit"
            size="sm"
            className="px-3"
            onClick={() => {
              navigator.clipboard.writeText(household.invitationCode);
            }}
          >
            <span className="sr-only">Skopiuj</span>
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

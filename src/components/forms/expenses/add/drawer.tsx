import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import AddExpenseForm from "./form";
import { HouseholdData } from "@/lib/types";

export default function AddExpenseDrawer({
  children,
  household,
}: {
  children: React.ReactNode;
  household: HouseholdData;
}) {
  {
    /* <Button variant="outline">Open Drawer</Button> */
  }
  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="w-full max-w-sm mx-auto">
          <DrawerHeader>
            <DrawerTitle>Dodaj wydatek</DrawerTitle>
            <DrawerDescription>
              Nowy wydatek do swojego domostwa
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <AddExpenseForm household={household} />
          </div>
          <DrawerFooter>
            {/* <Button>Submit</Button> */}
            <DrawerClose asChild>
              <Button variant="outline">Anuluj</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

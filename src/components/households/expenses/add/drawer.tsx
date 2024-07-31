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
import { useState } from "react";
import Spinner from "@/components/spinner";

export default function AddExpenseDrawer({
  children,
  household,
}: {
  children: React.ReactNode;
  household: HouseholdData;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
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
            <AddExpenseForm
              household={household}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
              setIsDrawerOpen={setIsDrawerOpen}
            />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline" disabled={isSubmitting}>
                Anuluj
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

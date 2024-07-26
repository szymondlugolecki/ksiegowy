import { useState } from "react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChevronRightIcon, PlusIcon } from "lucide-react";

export default function Component() {
  const selectedHousehold = {
    id: 1,
    name: "Długołęccy",
  };

  return (
    <main className="grid items-start flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Domostwa</CardTitle>
            <Button variant="outline" size="sm" className="gap-1">
              <PlusIcon className="w-4 h-4" />
              Stwórz domostwo
            </Button>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li
                className={`flex items-center justify-between rounded-md px-4 py-2 transition-colors hover:bg-muted ${
                  selectedHousehold.id === 1 ? "bg-muted" : ""
                }`}
              >
                <div>Długołęccy</div>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ChevronRightIcon className="w-5 h-5" />
                </Button>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

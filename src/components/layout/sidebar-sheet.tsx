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
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { HomeIcon, LayoutDashboard, Menu, Settings } from "lucide-react";

const SidebarSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          {/* <MenuIcon className="h-5 w-5" /> */}
          <Menu className="h-5 w-5" />
          <span className="sr-only">Włącz menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          {/* <Link
            href="#"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            prefetch={false}
          >
            <HomeIcon className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">Family Expenses</span>
          </Link> */}
          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-foreground"
            prefetch={false}
          >
            {/* <LayoutDashboardIcon className="h-5 w-5" /> */}
            <LayoutDashboard className="h-5 w-5" />
            Panel
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            prefetch={false}
          >
            <BarChartIcon className="h-5 w-5" />
            Statystyki
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            prefetch={false}
          >
            <HomeIcon className="h-5 w-5" />
            Moje Domostwo
          </Link>
          {/* <Link
              href="#"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              prefetch={false}
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link> */}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default SidebarSheet;

function BarChartIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  );
}

import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { HomeIcon, LayoutDashboard, Menu, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 flex-col hidden border-r w-14 bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <TooltipProvider>
          {/* <Link
            href="#"
            className="flex items-center justify-center gap-2 text-lg font-semibold rounded-full group h-9 w-9 shrink-0 bg-primary text-primary-foreground md:h-8 md:w-8 md:text-base"
            prefetch={false}
          >
            <HomeIcon className="w-4 h-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Family Expenses</span>
          </Link> */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/"
                className="flex items-center justify-center transition-colors rounded-lg h-9 w-9 bg-accent text-accent-foreground hover:text-foreground md:h-8 md:w-8"
                prefetch={false}
              >
                {/* <LayoutDashboardIcon className="w-5 h-5" /> */}
                <LayoutDashboard className="w-5 h-5" />
                <span className="sr-only">Panel</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Panel</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/"
                className="flex items-center justify-center transition-colors rounded-lg h-9 w-9 text-muted-foreground hover:text-foreground md:h-8 md:w-8"
                prefetch={false}
              >
                <BarChartIcon className="w-5 h-5" />
                <span className="sr-only">Statystyki</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Statystyki</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/"
                className="flex items-center justify-center transition-colors rounded-lg h-9 w-9 text-muted-foreground hover:text-foreground md:h-8 md:w-8"
                prefetch={false}
              >
                <HomeIcon className="w-5 h-5" />
                <span className="sr-only">Moje Domostwo</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Moje Domostwo</TooltipContent>
          </Tooltip>
          {/* <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex items-center justify-center transition-colors rounded-lg h-9 w-9 text-muted-foreground hover:text-foreground md:h-8 md:w-8"
                prefetch={false}
              >
                <Settings className="w-5 h-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip> */}
        </TooltipProvider>
      </nav>
      {/* Support Button */}
      {/* <nav className="flex flex-col items-center gap-4 px-2 mt-auto sm:py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex items-center justify-center transition-colors rounded-lg h-9 w-9 text-muted-foreground hover:text-foreground md:h-8 md:w-8"
                  prefetch={false}
                >
                  <HandHelpingIcon className="w-5 h-5" />
                  <span className="sr-only">Support</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Support</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav> */}
    </aside>
  );
}

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

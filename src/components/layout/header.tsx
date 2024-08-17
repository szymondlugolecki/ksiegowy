import Link from "next/link";
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
import SidebarSheet from "./sidebar-sheet";
import { createClient } from "@/lib/supabase/component";
import { useContext } from "react";
import { SessionContext } from "@/pages/layout";
import { usePathname, useRouter } from "next/navigation";
import { useActiveHousehold } from "@/hooks/useHousehold";
import HeaderBreadcrumbs from "./header-breadcrumbs";

const householdPaths = {
  "/": "Panel",
  "/stats": "Statystyki",
};

const otherPaths = {
  "/households": "Domostwa",
};

export default function Header() {
  const {
    data: activeHousehold,
    isLoading,
    isError,
    isSuccess,
  } = useActiveHousehold();

  console.log("activeHousehold", activeHousehold);

  const router = useRouter();
  const session = useContext(SessionContext);

  const supabase = createClient();

  if (isLoading) {
    return null;
  }

  if (isError) {
    return null;
  }

  if (isSuccess) {
    return (
      <header className="sticky top-0 z-30 flex items-center gap-4 px-4 border-b h-14 bg-background sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <SidebarSheet />
        <HeaderBreadcrumbs activeHouseholdName={activeHousehold.name} />
        <div className="flex items-center gap-2 ml-auto">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <img
                    src="/placeholder.svg"
                    width={36}
                    height={36}
                    alt="Avatar"
                    className="rounded-full"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Konto</DropdownMenuLabel>
                {/* <DropdownMenuSeparator />
                <DropdownMenuItem>Profil</DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    const { error } = await supabase.auth.signOut();
                    console.error("sign out error", error);
                    if (!error) {
                      router.push("/login");
                    }
                  }}
                >
                  Wyloguj
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              variant="outline"
              size="icon"
              className="rounded-full"
            >
              <Link href="/login">Zaloguj</Link>
            </Button>
          )}
        </div>
      </header>
    );
  }

  return null;
}

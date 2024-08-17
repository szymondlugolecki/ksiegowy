import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

const householdPaths = {
  "/": "Panel",
  "/stats": "Statystyki",
};

const otherPaths = {
  "/households": "Domostwa",
};

export default function HeaderBreadcrumbs({
  activeHouseholdName,
}: {
  activeHouseholdName: string;
}) {
  const pathname = usePathname();

  console.log("pathname", pathname, activeHouseholdName);

  return (
    <>
      {pathname in otherPaths ? (
        <Breadcrumb className="hidden sm:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>{householdPaths[pathname]}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      ) : null}
      {pathname in householdPaths ? (
        <Breadcrumb className="hidden sm:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/households" prefetch={false}>
                  {activeHouseholdName}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{householdPaths[pathname]}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      ) : null}
    </>
  );
}

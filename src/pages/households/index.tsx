import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  CircleHelp,
  EllipsisIcon,
  HomeIcon,
  MessageCircleQuestion,
  PlusIcon,
  UserPlus,
} from "lucide-react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { createClient } from "@/lib/supabase/server-props";
import HouseholdCreateForm from "@/components/households/create/form";
import HouseholdJoinForm from "@/components/households/join/form";
import { db } from "@/lib/db";
import { trytm } from "@/lib/utils";
import HouseholdList from "@/components/households/list";
import { eq, is } from "drizzle-orm";
import { profilesTable } from "@/lib/db/tables/profiles";
import { createContext, useContext, useEffect, useState } from "react";
import { HouseholdsPageContext } from "@/components/households/households-page-context";
import { profilesToHouseholdsTable } from "@/lib/db/tables/households";
import { SelectUser } from "@/lib/db/tables/profiles";
import HouseholdMembersList from "@/components/households/members-list";

export type HouseholdMember = Pick<
  SelectUser,
  "id" | "email" | "fullName" | "avatarURL"
> & { createdAt: string };

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = createClient(context);

  // Get user session
  const { data, error } = await supabase.auth.getUser();

  // Redirect to /login page if user is not logged in
  if (error || !data) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // Get list of user'shouseholds
  const [householdsRaw, fetchHouseholdsError] = await trytm(
    db.query.householdsTable.findMany({
      columns: {
        id: true,
        name: true,
        invitationCode: true,
        ownerId: true,
      },
      with: {
        usersWithActiveHousehold: {
          where: eq(profilesTable.id, data.user.id),
          columns: {
            id: true,
          },
        },
      },
    })
  );

  // Handle errors
  if (fetchHouseholdsError) {
    console.error("fetchHouseholdsError", fetchHouseholdsError);
    throw new Error("Błąd serwera podczas pobierania listy domostw");
  }

  // Get list of user's active household members
  const [activeHouseholdMembersRaw, fetchActiveHouseholdMembersError] =
    await trytm(
      db.query.profilesTable.findMany({
        columns: {},
        where: eq(profilesTable.id, data.user.id),
        with: {
          activeHousehold: {
            columns: {
              invitationCode: true,
            },
            with: {
              usersWithActiveHousehold: {
                columns: {
                  id: true,
                  email: true,
                  fullName: true,
                  avatarURL: true,
                  createdAt: true,
                },
              },
            },
          },
        },
      })
    );

  // Handle errors
  if (fetchActiveHouseholdMembersError) {
    console.error(
      "fetchActiveHouseholdMembersError",
      fetchActiveHouseholdMembersError
    );
    throw new Error("Błąd serwera podczas pobierania listy członków domostwa");
  }

  const x =
    activeHouseholdMembersRaw[0].activeHousehold?.usersWithActiveHousehold[0]
      .createdAt;
  console.log(
    "activeHouseholdMembersRaw",
    activeHouseholdMembersRaw,
    x,
    typeof x
  );

  const households = householdsRaw.map(
    ({ usersWithActiveHousehold, ...rest }) => ({ ...rest })
  );

  const activeHousehold = activeHouseholdMembersRaw[0].activeHousehold;
  const ownerId = householdsRaw[0] ? householdsRaw[0].ownerId : null;
  const invitationCode = activeHousehold
    ? activeHousehold.invitationCode
    : null;

  const activeHouseholdMembers: HouseholdMember[] = activeHouseholdMembersRaw
    .flatMap(({ activeHousehold }) =>
      activeHousehold?.usersWithActiveHousehold.map(({ createdAt, ...u }) => ({
        ...u,
        createdAt: createdAt.toISOString(),
      }))
    )
    .filter((x) => x !== undefined);

  return {
    props: {
      user: data.user,
      households,
      activeHousehold: householdsRaw.find(
        ({ usersWithActiveHousehold }) => usersWithActiveHousehold.length > 0
      )?.id,
      activeHouseholdMembers,
      ownerId,
      invitationCode,
    },
  };
}

export default function HouseholdsPage({
  user,
  households,
  activeHousehold,
  activeHouseholdMembers,
  ownerId,
  invitationCode,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLimitReached, setIsLimitReached] = useState(true);

  useEffect(() => {
    if (households.length < 5) {
      setIsLimitReached(false);
    } else {
      setIsLimitReached(true);
    }
  }, [households]);

  return (
    <HouseholdsPageContext.Provider
      value={{
        isSubmitting,
        setIsSubmitting,
        isLimitReached,
        setIsLimitReached,
        ownerId,
      }}
    >
      <main className="grid items-start flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Households List */}
          <HouseholdList households={households} />

          {/* Create Household */}
          <HouseholdCreateForm />

          {/* Join Household */}
          <HouseholdJoinForm />
        </div>

        {/* Household Members */}
        <HouseholdMembersList householdMembers={activeHouseholdMembers} />
      </main>
    </HouseholdsPageContext.Provider>
  );
}

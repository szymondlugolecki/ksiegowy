import { db } from "@/lib/db";
import {
  householdsTable,
  InsertHousehold,
  InsertHouseholdUser,
  profilesToHouseholdsTable,
  SelectHousehold,
} from "@/lib/db/tables/households";
import { profilesTable } from "@/lib/db/tables/profiles";
import createClient from "@/lib/supabase/api";
import { ApiResponse } from "@/lib/types";
import { trytm } from "@/lib/utils";
import { eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

export type ActiveHousehold = Pick<
  SelectHousehold,
  "id" | "name" | "invitationCode" | "ownerId"
>;

export type ApiResponseActiveHousehold = ApiResponse<ActiveHousehold | null>;

// This is used to get user's active household
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseActiveHousehold>
) {
  // Check request method
  if (req.method !== "GET") {
    return res.status(405).json({
      error: true,
      message: "Nieprawidłowa metoda żądania",
    });
  }

  // Handle auth
  const supabase = createClient(req, res);
  const { error, data: userData } = await supabase.auth.getUser();
  if (error) {
    return res.status(401).json({ error: true, message: "Brak autoryzacji" });
  }

  // Get user's active household
  const [activeHousehold, fetchActiveHouseholdError] = await trytm(
    db.query.profilesTable.findFirst({
      columns: {},
      where: eq(profilesTable.id, userData.user.id),
      with: {
        activeHousehold: {
          columns: {
            id: true,
            name: true,
            invitationCode: true,
            ownerId: true,
          },
        },
      },
    })
  );

  // Handle errors
  if (fetchActiveHouseholdError) {
    console.error("fetchActiveHouseholdError", fetchActiveHouseholdError);
    return res.status(500).json({
      error: true,
      message: "Błąd serwera podczas pobierania aktualnego domostwa",
    });
  }
  if (!activeHousehold || !activeHousehold.activeHousehold) {
    return res.status(200).json({
      success: true,
      message: "Nie jesteś członkiem żadnego domostwa",
      data: null,
    });
  }

  res.status(200).json({
    success: true,
    message: `Twoje aktualne domostwo: ${activeHousehold.activeHousehold.name}`,
    data: activeHousehold.activeHousehold,
  });
}

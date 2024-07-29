import { db } from "@/lib/db";
import { profilesToHouseholdsTable } from "@/lib/db/tables/households";
import { profilesTable } from "@/lib/db/tables/profiles";
import { changeActiveHouseholdFormSchema } from "@/lib/schemas/households";
import createClient from "@/lib/supabase/api";
import { ApiResponse } from "@/lib/types";
import { trytm } from "@/lib/utils";
import { and, count, eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Auth
  const supabase = createClient(req, res);
  const { error, data: userData } = await supabase.auth.getUser();
  if (error) {
    return res.status(401).json({ error: true, message: "Brak autoryzacji" });
  }

  // Validation
  const body = JSON.parse(req.body);
  const validation = changeActiveHouseholdFormSchema.safeParse(body);
  if (!validation.success) {
    return res
      .status(400)
      .json({ error: true, message: validation.error.flatten().formErrors[0] });
  }

  const {
    data: { id },
  } = validation;

  console.log(
    "Members:",
    await db.query.profilesToHouseholdsTable.findMany({
      with: {
        household: {
          columns: {
            name: true,
          },
        },
        profile: {
          columns: {
            fullName: true,
          },
        },
      },
    })
  );
  // Check if user is member of the household
  const [household, fetchHouseholdError] = await trytm(
    db.query.profilesToHouseholdsTable.findFirst({
      where: and(
        eq(profilesToHouseholdsTable.householdId, id),
        eq(profilesToHouseholdsTable.userId, userData.user.id)
      ),
      with: {
        household: {
          columns: {
            name: true,
          },
        },
      },
    })
  );

  if (fetchHouseholdError) {
    //     fetchHouseholdError Error: There is not enough information to infer relation "householdsTable.members"
    //     at normalizeRelation (file:///C:/Users/PC/Desktop/ksiegowy/node_modules/drizzle-orm/relations.js:250:9)
    //  POST /api/households/join 500 in 163ms
    console.error("fetchHouseholdError", fetchHouseholdError);
    return res.status(500).json({
      error: true,
      message: "Błąd serwera podczas szukania domostwa",
    });
  }
  if (!household) {
    return res.status(404).json({
      error: true,
      message: "Nie jesteś członkiem tego domostwa",
    });
  }

  const [, changeActiveHouseholdError] = await trytm(
    db
      .update(profilesTable)
      .set({
        mainHouseholdId: id,
      })
      .where(eq(profilesTable.id, userData.user.id))
  );
  if (changeActiveHouseholdError) {
    console.error("changeActiveHouseholdError", changeActiveHouseholdError);
    return res.status(500).json({
      error: true,
      message: "Błąd serwera podczas zmieniania aktywnego domostwa",
    });
  }

  res.status(200).json({
    success: true,
    message: `Zmieniono aktywne domostwo na ${household.household.name}`,
  });
}

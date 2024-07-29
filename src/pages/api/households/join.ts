import { db } from "@/lib/db";
import {
  householdsTable,
  InsertHousehold,
  InsertHouseholdUser,
  profilesToHouseholdsTable,
} from "@/lib/db/tables/households";
import {
  createHouseholdFormSchema,
  joinHouseholdFormSchema,
} from "@/lib/schemas/households";
import createClient from "@/lib/supabase/api";
import { ApiResponse } from "@/lib/types";
import { trytm } from "@/lib/utils";
import { count, eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const supabase = createClient(req, res);
  const { error, data: userData } = await supabase.auth.getUser();
  if (error) {
    return res.status(401).json({ error: true, message: "Brak autoryzacji" });
  }

  const body = JSON.parse(req.body);

  const validation = joinHouseholdFormSchema.safeParse(body);
  if (!validation.success) {
    return res
      .status(400)
      .json({ error: true, message: validation.error.flatten().formErrors[0] });
  }

  const {
    data: { code },
  } = validation;

  // Check if user is already a member of more than 5 households
  const [userHouseholdsCount, countUserHouseholdsError] = await trytm(
    db
      .select({ count: count() })
      .from(profilesToHouseholdsTable)
      .where(eq(profilesToHouseholdsTable.userId, userData.user.id))
  );
  if (countUserHouseholdsError) {
    console.error("countUserHouseholdsError", countUserHouseholdsError);
    return res.status(500).json({
      error: true,
      message: "Błąd serwera podczas sprawdzania liczby domostw",
    });
  }
  if (userHouseholdsCount && userHouseholdsCount[0].count > 5) {
    return res.status(400).json({
      error: true,
      message: "Można być członkiem maksymalnie 5 domostw",
    });
  }

  const [household, fetchHouseholdError] = await trytm(
    db.query.householdsTable.findFirst({
      where: eq(householdsTable.invitationCode, code),
      columns: {
        id: true,
        name: true,
      },
      with: {
        profilesToHouseholds: {
          where: eq(profilesToHouseholdsTable.userId, userData.user.id),
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
      message: "Nie znaleziono podanego kodu zaproszenia",
    });
  }

  if (household.profilesToHouseholds.length) {
    return res.status(400).json({
      error: true,
      message: "Jesteś już członkiem tego domostwa",
    });
  }

  const newHouseholdMember: InsertHouseholdUser = {
    householdId: household.id,
    userId: userData.user.id,
  };

  const [result, insertHouseholdMemberError] = await trytm(
    db
      .insert(profilesToHouseholdsTable)
      .values(newHouseholdMember)
      .onConflictDoNothing({
        target: [
          profilesToHouseholdsTable.householdId,
          profilesToHouseholdsTable.userId,
        ],
      })
      .returning({
        userId: profilesToHouseholdsTable.userId,
      })
  );
  if (insertHouseholdMemberError) {
    console.error("insertHouseholdMemberError", insertHouseholdMemberError);
    return res.status(500).json({
      error: true,
      message: "Błąd serwera podczas dołączania do domostwa",
    });
  }

  if (!result) {
    console.error("No user added");
    return res.status(400).json({
      error: true,
      message: "Błąd. Jesteś już członkiem tego domostwa",
    });
  }

  //   res.redirect(307, `/households`);

  res.status(200).json({
    success: true,
    message: `Dołączono do domostwa: ${household.name}`,
  });
}

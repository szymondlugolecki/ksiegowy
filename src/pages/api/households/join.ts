import { db } from "@/lib/db";
import {
  householdsTable,
  InsertHousehold,
  InsertHouseholdUser,
  members,
} from "@/lib/db/tables/households";
import {
  addHouseholdFormSchema,
  joinHouseholdFormSchema,
} from "@/lib/schemas/households";
import createClient from "@/lib/supabase/api";
import { ApiResponse } from "@/lib/types";
import { trytm } from "@/lib/utils";
import { eq } from "drizzle-orm";
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

  const [household, fetchHouseholdError] = await trytm(
    db.query.householdsTable.findFirst({
      where: eq(householdsTable.invitationCode, code),
      columns: {
        id: true,
        name: true,
      },
      with: {
        members: {
          where: eq(members.userId, userData.user.id),
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

  if (household.members.length) {
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
      .insert(members)
      .values(newHouseholdMember)
      .onConflictDoNothing({
        target: [members.householdId, members.userId],
      })
      .returning({
        userId: members.userId,
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

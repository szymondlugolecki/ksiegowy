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

// This is used to join a household
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Check request method
  if (req.method !== "POST") {
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

  // Validation
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

  // A user can be a member of up to 5 households:

  // Count user's households
  const [userHouseholdsCount, countUserHouseholdsError] = await trytm(
    db
      .select({ count: count() })
      .from(profilesToHouseholdsTable)
      .where(eq(profilesToHouseholdsTable.userId, userData.user.id))
  );
  // Handle errors
  if (countUserHouseholdsError) {
    console.error("countUserHouseholdsError", countUserHouseholdsError);
    return res.status(500).json({
      error: true,
      message: "Błąd serwera podczas sprawdzania liczby domostw",
    });
  }

  // Throw error if user is already a member of 5 households
  if (userHouseholdsCount && userHouseholdsCount[0].count >= 5) {
    return res.status(400).json({
      error: true,
      message: "Można być członkiem maksymalnie 5 domostw",
    });
  }

  // Fetch household by the invitation code
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
  // Handle errors
  if (fetchHouseholdError) {
    console.error("fetchHouseholdError", fetchHouseholdError);
    return res.status(500).json({
      error: true,
      message: "Błąd serwera podczas szukania domostwa",
    });
  }

  // Household with this invitation code doesn't exist
  if (!household) {
    return res.status(404).json({
      error: true,
      message: "Nie znaleziono podanego kodu zaproszenia",
    });
  }

  // Already a member
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

  // Join the household
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
  // Handle errors
  if (insertHouseholdMemberError) {
    console.error("insertHouseholdMemberError", insertHouseholdMemberError);
    return res.status(500).json({
      error: true,
      message: "Błąd serwera podczas dołączania do domostwa",
    });
  }
  if (!result) {
    // I doubt this is possible,
    // since we made sure that the user is not a member of the household
    console.error("No user added");
    return res.status(400).json({
      error: true,
      message: "Błąd podczas dołączania do domostwa",
    });
  }

  res.status(200).json({
    success: true,
    message: `Dołączono do domostwa: ${household.name}`,
  });
}

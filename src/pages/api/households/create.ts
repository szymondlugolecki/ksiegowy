import { db } from "@/lib/db";
import {
  householdsTable,
  InsertHousehold,
  InsertHouseholdUser,
  profilesToHouseholdsTable,
} from "@/lib/db/tables/households";
import { createHouseholdFormSchema } from "@/lib/schemas/households";
import createClient from "@/lib/supabase/api";
import { ApiResponse } from "@/lib/types";
import { trytm } from "@/lib/utils";
import { count, eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

// This is used to a new create household
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
    return res.status(401).json({ error: true, message: "Unauthorized" });
  }

  // Validation
  const validation = createHouseholdFormSchema.safeParse(req.body);
  if (!validation.success) {
    return res
      .status(400)
      .json({ error: true, message: validation.error.flatten().formErrors[0] });
  }

  const {
    data: { name },
  } = validation;

  const newHousehold: InsertHousehold = {
    name,
    ownerId: userData.user.id,
  };

  // Here's a server-side check to see if user is already a member of more than 5 households:

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

  // Create a new household
  const [, insertHouseholdError] = await trytm(
    db.transaction(async (txn) => {
      const createdHouseholds = await txn
        .insert(householdsTable)
        .values(newHousehold)
        .returning({
          id: householdsTable.id,
        });
      if (!createdHouseholds || !createdHouseholds.length) {
        console.error("No households created");
        txn.rollback();
      }

      const newHouseholdUser: InsertHouseholdUser = {
        userId: userData.user.id,
        householdId: createdHouseholds[0].id,
      };

      const addUser = await txn
        .insert(profilesToHouseholdsTable)
        .values(newHouseholdUser)
        .returning({ householdId: profilesToHouseholdsTable.householdId });

      if (!addUser || !addUser.length) {
        console.error("No user added");
        txn.rollback();
      }
    })
  );
  // Handle errors
  if (insertHouseholdError) {
    console.error("insertHouseholdError", insertHouseholdError);
    return res.status(500).json({
      error: true,
      message: "Błąd serwera podczas tworzenia domostwa",
    });
  }

  res
    .status(200)
    .json({ success: true, message: "Domostwo zostało utworzone" });
}

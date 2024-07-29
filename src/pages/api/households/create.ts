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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const supabase = createClient(req, res);
  const { error, data: userData } = await supabase.auth.getUser();
  if (error) {
    return res.status(401).json({ error: true, message: "Unauthorized" });
  }

  const body = JSON.parse(req.body);

  const validation = createHouseholdFormSchema.safeParse(body);
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
  if (insertHouseholdError) {
    console.error("insertHouseholdError", insertHouseholdError);
    return res.status(500).json({
      error: true,
      message: "Błąd serwera podczas tworzenia domostwa",
    });
  }

  // res.redirect(307, `/households`);

  res
    .status(200)
    .json({ success: true, message: "Domostwo zostało utworzone" });
}

import { db } from "@/lib/db";
import {
  householdsTable,
  InsertHousehold,
  InsertHouseholdUser,
  members,
} from "@/lib/db/tables/households";
import { addHouseholdFormSchema } from "@/lib/schemas/households";
import createClient from "@/lib/supabase/api";
import { ApiResponse } from "@/lib/types";
import { trytm } from "@/lib/utils";
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

  const validation = addHouseholdFormSchema.safeParse(body);
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
        .insert(members)
        .values(newHouseholdUser)
        .returning({ householdId: members.householdId });

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

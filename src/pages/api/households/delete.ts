import { db } from "@/lib/db";
import {
  householdsTable,
  profilesToHouseholdsTable,
} from "@/lib/db/tables/households";
import { profilesTable } from "@/lib/db/tables/profiles";
import {
  changeActiveHouseholdFormSchema,
  deleteHouseholdFormSchema,
} from "@/lib/schemas/households";
import createClient from "@/lib/supabase/api";
import { ApiResponse } from "@/lib/types";
import { trytm } from "@/lib/utils";
import { and, count, eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

// This is used to remove a household
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Check request method
  if (req.method !== "DELETE") {
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
  console.log("body", req.body);
  const validation = deleteHouseholdFormSchema.safeParse(req.body);
  if (!validation.success) {
    return res
      .status(400)
      .json({ error: true, message: validation.error.flatten().formErrors[0] });
  }

  const {
    data: { id },
  } = validation;

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
            ownerId: true,
          },
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
  if (!household) {
    return res.status(404).json({
      error: true,
      message: "Nie znaleziono domostwa",
    });
  }

  // Check if user is owner of the household
  if (userData.user.id !== household.household.ownerId) {
    return res.status(403).json({
      error: true,
      message: "Musisz być właścicielem domostwa, aby je usunąć",
    });
  }

  // Delete household
  const [, deleteHouseholdError] = await trytm(
    db.delete(householdsTable).where(eq(householdsTable.id, id))
  );

  // Handle errors
  if (deleteHouseholdError) {
    console.error("deleteHouseholdError", deleteHouseholdError);
    return res.status(500).json({
      error: true,
      message: "Błąd serwera podczas usuwania domostwa",
    });
  }

  res.status(200).json({
    success: true,
    message: `Usunięto domostwo ${household.household.name}`,
  });
}

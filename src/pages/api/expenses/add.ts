import { db } from "@/lib/db";
import { expensesTable, InsertExpense } from "@/lib/db/tables/expenses";
import { addExpenseFormSchema } from "@/lib/schemas/expenses";
import createClient from "@/lib/supabase/api";
import { ApiResponse } from "@/lib/types";
import { trytm } from "@/lib/utils";
import type { NextApiRequest, NextApiResponse } from "next";

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
  const validation = addExpenseFormSchema.safeParse(req.body);
  if (!validation.success) {
    return res
      .status(400)
      .json({ error: true, message: validation.error.flatten().formErrors[0] });
  }

  const {
    data: { title, amount, description, householdId },
  } = validation;

  const newExpense: InsertExpense = {
    title,
    amount,
    description,
    householdId,
    profileId: userData.user.id,
  };

  // Create expense
  const [, insertExpenseError] = await trytm(
    db.insert(expensesTable).values(newExpense)
  );
  // Handle errors
  if (insertExpenseError) {
    console.error("insertExpenseError", insertExpenseError);
    return res.status(500).json({
      error: true,
      message: "Błąd serwera podczas dodawania wydatku",
    });
  }

  res.status(200).json({ success: true, message: "Wydatek został dodany" });
}

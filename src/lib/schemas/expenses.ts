import { string, z } from "zod";

export const addExpenseFormSchema = z.object({
  title: z
    .string({
      required_error: "Tytuł wydatku jest wymagany",
      invalid_type_error: "Nieprawidłowy wydatek",
    })
    .min(1, "Brak tytułu wydatku"),
  description: z
    .string({ invalid_type_error: "Nieprawidłowy opis wydatku" })
    .optional(),
  amount: z.coerce
    .number({
      required_error: "Kwota wydatku jest wymagana",
      invalid_type_error: "Nieprawidłowa kwota wydatku",
    })
    .min(0, "Kwota wydatku nie może być ujemna"),
  householdId: z
    .string({
      required_error: "Domostwo jest wymagane",
      invalid_type_error: "Nieprawidłowe ID domostwa",
    })
    .min(1, "Nieprawidłowe ID domostwa"),
});

export type AddExpenseForm = z.infer<typeof addExpenseFormSchema>;

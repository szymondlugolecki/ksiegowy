import { z } from "zod";

export const addHouseholdFormSchema = z.object({
  name: z
    .string({
      required_error: "Nazwa domostwa jest wymagana",
      invalid_type_error: "Nieprawidłowa nazwa domostwa",
    })
    .min(3, "Nazwa domostwa musi zawierać przynajmniej 3 znaki"),
});

export const joinHouseholdFormSchema = z.object({
  code: z
    .string({
      required_error: "Kod zaproszenia jest wymagany",
      invalid_type_error: "Nieprawidłowy kod zaproszenia",
    })
    .min(3, "Kod zaproszenia musi zawierać przynajmniej 3 znaki"),
});

export type AddHouseholdForm = z.infer<typeof addHouseholdFormSchema>;
export type JoinHouseholdForm = z.infer<typeof joinHouseholdFormSchema>;

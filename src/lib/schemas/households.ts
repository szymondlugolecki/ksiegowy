import { z } from "zod";

export const createHouseholdFormSchema = z.object({
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

export const changeActiveHouseholdFormSchema = z.object({
  id: z
    .string({
      required_error: "Id domostwa jest wymagane",
      invalid_type_error: "Nieprawidłowe id domostwa",
    })
    .uuid("Nieprawidłowe id domostwa"),
});

export const deleteHouseholdFormSchema = z.object({
  id: z
    .string({
      required_error: "Id domostwa jest wymagane",
      invalid_type_error: "Nieprawidłowe id domostwa",
    })
    .uuid("Nieprawidłowe id domostwa"),
});

export type CreateHouseholdForm = z.infer<typeof createHouseholdFormSchema>;
export type JoinHouseholdForm = z.infer<typeof joinHouseholdFormSchema>;
export type ChangeActiveHouseholdForm = z.infer<
  typeof changeActiveHouseholdFormSchema
>;
export type DeleteHouseholdForm = z.infer<typeof deleteHouseholdFormSchema>;

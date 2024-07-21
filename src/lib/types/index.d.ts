import type { SelectHousehold } from "@/lib/db/tables/households";

type HouseholdData = Pick<SelectHousehold, "id" | "name">;

type ApiResponse<T extends unknown = unknown> =
  | {
      data?: T;
      success: true;
      message: string;
    }
  | {
      error: true;
      message: string;
    };

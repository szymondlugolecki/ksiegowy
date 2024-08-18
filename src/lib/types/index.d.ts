import type { SelectHousehold } from "@/lib/db/tables/households";

type HouseholdData = Pick<SelectHousehold, "id" | "name">;

type ApiSuccessResponse<T extends unknown = unknown> = {
  data?: T;
  success: true;
  message: string;
};

type ApiResponse<T extends unknown = unknown> =
  | ApiSuccessResponse<T>
  | {
      error: true;
      message: string;
    };

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This is a nice way to catch errors without the bracket hell
export const trytm = async <T>(
  promise: Promise<T>
): Promise<[T, null] | [null, Error]> => {
  try {
    const data = await promise;
    return [data, null];
  } catch (throwable) {
    if (throwable instanceof Error) return [null, throwable];

    throw throwable;
  }
};

// Formats a number as the PLN currency
export const formatPLN = (amount: number): string => {
  return amount.toLocaleString("pl-PL", {
    style: "currency",
    currency: "PLN",
  });
};

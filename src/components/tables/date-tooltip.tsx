import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function DateTooltip({ date }: { date: Date }) {
  const shortDate = date.toLocaleDateString("pl", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const extendedDate = date.toLocaleDateString("pl", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button>{shortDate}</button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{extendedDate}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

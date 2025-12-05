import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect } from "react";
import { TZDate } from "react-day-picker";
import { cn } from "@/lib/utils";
import { es } from "date-fns/locale";

export function DatePicker({
  field,
  locale,
}: {
  field: any;
  locale: "es" | "en";
}) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  useEffect(() => {
    if (field.value) {
      setDate(new TZDate(field.value));
    }
  }, [field.value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date"
          className={cn(
            "w-full justify-between px-3",
            date ? "" : " text-muted-foreground"
          )}
        >
          {date
            ? new Date(date).toLocaleString(locale, {
                timeZone: "UTC",
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : locale === "es"
            ? "Seleccionar fecha"
            : "Select date"}
          <CalendarIcon className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          locale={es}
          mode="single"
          captionLayout="dropdown"
          timeZone="UTC"
          selected={date}
          onSelect={(date) => {
            setDate(date);
            field.onChange(date?.toISOString() ?? null);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

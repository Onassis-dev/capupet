import { SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/hooks/use-i18n";

export const SearchInput = ({
  className,
  value,
  onChange,
}: React.ComponentProps<"input">) => {
  const t = useI18n({
    search: {
      es: "Buscar",
      en: "Search",
    },
  });

  return (
    <div className="relative w-full sm:max-w-60 h-full">
      <SearchIcon className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
      <Input
        placeholder={t("search")}
        type={"search"}
        className={cn("pl-9 h-9 w-full rounded-xl", className)}
        value={value}
        onChange={(e) => onChange?.(e)}
      />
    </div>
  );
};

SearchInput.displayName = "SearchInput";

const regexs = {
  integer: /^\d+$/,
  twoDecimals: /^\d+(\.\d{1,2})?$/,
  float: /^\d+(\.\d+)?$/,
};

export const NumberInput = ({
  onChange,
  ...props
}: React.ComponentProps<"input">) => {
  return (
    <Input
      {...props}
      pattern="^\d+$"
      onChange={(e) => {
        if (e.target.value.match(/^\d+$/) || e.target.value === "") {
          onChange?.(e);
        } else {
          e.preventDefault();
        }
      }}
    />
  );
};

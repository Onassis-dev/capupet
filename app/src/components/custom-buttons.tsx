import { Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@workspace/ui/components/ui/button";
import type { ComponentProps } from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@workspace/ui/lib/utils";

export const SubmitButton = ({
  disabled,
  children,
  className,
  ...props
}: ComponentProps<"button"> & VariantProps<typeof buttonVariants>) => {
  return (
    <Button
      {...props}
      disabled={disabled}
      className={cn("relative", className)}
    >
      {disabled && (
        <Loader2 className="size-4 animate-spin absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
      )}

      <span className={cn(disabled && "opacity-0")}>{children}</span>
    </Button>
  );
};

export const RegisterButton = ({
  className,
  children,
  ...props
}: ComponentProps<"button">) => {
  return (
    <Button
      className={cn("px-2 sm:px-4", className)}
      {...props}
      variant="default"
    >
      <span className="sr-only sm:not-sr-only">{children}</span>
    </Button>
  );
};

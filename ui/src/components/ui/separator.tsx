import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@workspace/ui/lib/utils";

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> & {
    children?: React.ReactNode;
  }
>(
  (
    {
      className,
      orientation = "horizontal",
      decorative = true,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("relative", className)}>
        <div className="absolute inset-0 flex items-center">
          <SeparatorPrimitive.Root
            ref={ref}
            decorative={decorative}
            orientation={orientation}
            className={cn(
              "shrink-0 bg-border",
              orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
              className
            )}
            {...props}
          />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className=" bg-background px-1 text-muted-foreground">
            {children}
          </span>
        </div>
      </div>
    );
  }
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };

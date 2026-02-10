import { cn } from "@workspace/ui/lib/utils";

export const PageWrapper = ({
  children,
  title,
  size,
}: {
  children: React.ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg";
}) => {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        size === "sm" && "max-w-2xl",
        size === "md" && "max-w-5xl",
        size === "lg" && "max-w-screen-2xl"
      )}
    >
      <header className="flex shrink-0 items-center gap-2 pb-8">
        {/* <SidebarTrigger /> */}
        {/* <Separator
                    orientation="vertical"
                    className="data-[orientation=vertical]:h-4"
                  /> */}
        {title && <h1 className={"font-bold text-3xl sm:text-4xl"}>{title}</h1>}
      </header>

      <div>{children}</div>
    </div>
  );
};

import { cn } from "@workspace/ui/lib/utils";

interface props {
  className?: string;
  children: React.ReactNode;
}

export const OptionsGrid = ({ className, children }: props) => {
  return (
    <div className={cn("flex justify-between gap-2 mb-6", className)}>
      {children}
    </div>
  );
};

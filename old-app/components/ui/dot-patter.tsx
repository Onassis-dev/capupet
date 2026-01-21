import { cn } from "@workspace/ui/lib/utils";

interface DotPatternProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The horizontal spacing between dots */
  width?: number;
  /** The vertical spacing between dots */
  height?: number;
  /** The radius of each dot */
  cr?: number;
  /** The color of the dots */
  color?: string;
  className?: string;
}

export function DotPattern({
  width = 16,
  height = 16,
  cr = 1,
  color = "rgb(247 115 43 / 0.3)",
  className,
  style,
  ...props
}: DotPatternProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full -z-10",
        className
      )}
      style={{
        backgroundImage: `radial-gradient(${color} ${cr}px, transparent ${cr}px)`,
        backgroundSize: `${width}px ${height}px`,
        ...style,
      }}
      {...props}
    />
  );
}

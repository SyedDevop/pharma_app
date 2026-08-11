import { cn } from "@/lib/utils";

export function DumInput({ children, className, ...rest }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("rounded-sm border bg-primary/5 p-1 text-sm tabular-nums", className)}
      {...rest}
    >
      {children}
    </div>
  );
}

export function DumTitle({ children, className, ...rest }: React.ComponentProps<"h1">) {
  return (
    <h1 className={cn("font-semibold text-lg text-primary", className)} {...rest}>
      {children}
    </h1>
  );
}

export function DumGroupe({ children, className, ...rest }: React.ComponentProps<"div">) {
  return (
    <div className={cn("space-y-1.5", className)} {...rest}>
      {children}
    </div>
  );
}

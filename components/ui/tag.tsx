import { cn } from "@/lib/utils";

export function Tag({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-mist",
        className
      )}
    >
      {children}
    </span>
  );
}

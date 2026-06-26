import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex min-h-11 items-center justify-center rounded-lg px-5 text-sm font-medium transition",
          "disabled:cursor-not-allowed disabled:opacity-60",
          variant === "primary" &&
            "bg-gradient-to-r from-gold to-rose text-night shadow-soft hover:opacity-95",
          variant === "secondary" &&
            "border border-white/10 bg-white/5 text-white hover:bg-white/10",
          variant === "ghost" && "text-mist hover:bg-white/5",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

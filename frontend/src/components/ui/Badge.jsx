import * as React from "react";
import { cn } from "../../lib/utils";

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-arcane/15 text-arcane border-arcane/30",
    secondary: "bg-ink-elevated text-bone-muted border-ink-border",
    destructive: "bg-[hsl(var(--danger))]/15 text-[hsl(var(--danger))] border-[hsl(var(--danger))]/30",
    outline: "text-bone border-ink-border bg-transparent",
    success: "bg-[hsl(var(--success))]/15 text-[hsl(var(--success))] border-[hsl(var(--success))]/30",
    warning: "bg-arcane/15 text-arcane border-arcane/30",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center border px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

export { Badge };

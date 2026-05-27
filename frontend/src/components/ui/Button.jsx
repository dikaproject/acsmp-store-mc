import * as React from "react";
import { cn } from "../../lib/utils";

const buttonVariants = {
  default:
    "group/btn relative bg-arcane text-bone border border-arcane hover:bg-arcane-glow hover:border-arcane-glow shadow-[0_1px_0_rgba(0,0,0,0.3)_inset,0_-1px_0_rgba(255,255,255,0.1)_inset] active:translate-y-px",
  primary:
    "group/btn relative bg-arcane text-bone border border-arcane hover:bg-arcane-glow hover:border-arcane-glow shadow-[0_1px_0_rgba(0,0,0,0.3)_inset,0_-1px_0_rgba(255,255,255,0.1)_inset] active:translate-y-px",
  outline:
    "group/btn relative border border-ink-border bg-transparent text-bone hover:border-arcane hover:text-arcane hover:bg-arcane/[0.06] active:translate-y-px",
  ghost:
    "group/btn relative bg-transparent text-bone-muted hover:text-bone hover:bg-ink-elevated active:translate-y-px",
  link:
    "text-arcane underline-offset-4 hover:underline px-0",
  destructive:
    "group/btn relative bg-transparent text-[hsl(var(--danger))] border border-[hsl(var(--danger))]/40 hover:bg-[hsl(var(--danger))]/10 hover:border-[hsl(var(--danger))] active:translate-y-px",
  // Legacy aliases — preserved during migration
  secondary:
    "group/btn relative bg-ink-elevated text-bone border border-ink-border hover:border-arcane/50 hover:bg-ink-elevated/70 active:translate-y-px",
  emerald:
    "group/btn relative bg-arcane text-bone border border-arcane hover:bg-arcane-glow active:translate-y-px",
  indigo:
    "group/btn relative bg-arcane text-bone border border-arcane hover:bg-arcane-glow active:translate-y-px",
  gold:
    "group/btn relative bg-arcane text-bone border border-arcane hover:bg-arcane-glow active:translate-y-px",
};

const buttonSizes = {
  default: "h-10 px-6 text-[12px] tracking-[0.14em] rounded-xl",
  sm: "h-8 px-4 text-[11px] tracking-[0.12em] rounded-lg",
  lg: "h-12 px-9 text-[13px] tracking-[0.16em] rounded-xl",
  icon: "h-10 w-10 rounded-xl",
};

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", disabled, children, ...props }, ref) => {
    const showSheen = variant !== "link" && variant !== "ghost";

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium uppercase overflow-hidden",
          "transition-all duration-200 ease-out will-change-transform",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-arcane focus-visible:ring-offset-2 focus-visible:ring-offset-ink",
          "disabled:pointer-events-none disabled:opacity-40 disabled:saturate-50",
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        ref={ref}
        disabled={disabled}
        {...props}
      >
        {/* Sheen sweep on hover */}
        {showSheen && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover/btn:translate-x-full"
          />
        )}

        <span className="relative z-10 inline-flex items-center gap-2">
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-semibold transition-[background-color,color,box-shadow,transform] duration-150 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-spruce text-white hover:bg-brand-dark",
        brand: "bg-brand text-white hover:bg-brand-dark",
        secondary: "bg-enamel text-spruce hover:bg-enamel-deep",
        outline: "border border-input bg-white text-spruce shadow-sm hover:bg-enamel/60",
        ghost: "text-spruce hover:bg-enamel/70",
        destructive: "bg-coral text-white hover:bg-[#b93a31]",
        danger: "bg-coral-soft text-coral hover:bg-[#f8d6d1]",
        link: "text-brand-dark underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 rounded-lg px-3.5 text-sm [&_svg]:size-4",
        default: "h-11 rounded-xl px-5 text-[15px] [&_svg]:size-[18px]",
        lg: "h-14 rounded-full px-7 text-base [&_svg]:size-5",
        icon: "size-10 rounded-xl [&_svg]:size-[18px]",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot className={cn(buttonVariants({ variant, size }), className)} ref={ref as React.Ref<HTMLElement>} {...props}>
          {children}
        </Slot>
      );
    }
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && <Loader2 className="animate-spin" aria-hidden />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };

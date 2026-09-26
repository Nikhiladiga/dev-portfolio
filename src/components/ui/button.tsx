import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  cn(
    "group/button font-head inline-flex cursor-pointer items-center justify-center gap-2 rounded-none font-bold whitespace-nowrap select-none transition-[transform,box-shadow,background-color] duration-150",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary aria-invalid:border-destructive",
    // Icons keep their own size; we only set a default when none is given so
    // Neobrutalism's h-4/size-4 icons aren't overridden.
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
  ),
  {
    variants: {
      variant: {
        default:
          "border-[length:var(--border-width)] border-border bg-primary text-primary-foreground shadow-md hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-lg active:translate-x-[5px] active:translate-y-[5px] active:shadow-none",
        secondary:
          "border-[length:var(--border-width)] border-border bg-secondary text-secondary-foreground shadow-md hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-secondary-hover hover:shadow-lg active:translate-x-[5px] active:translate-y-[5px] active:shadow-none",
        destructive:
          "border-[length:var(--border-width)] border-border bg-destructive text-destructive-foreground shadow-md hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-destructive/90 hover:shadow-lg active:translate-x-[5px] active:translate-y-[5px] active:shadow-none",
        outline:
          "border-[length:var(--border-width)] border-border bg-card text-card-foreground shadow-md hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-muted hover:shadow-lg active:translate-x-[5px] active:translate-y-[5px] active:shadow-none",
        ghost: "border-[length:var(--border-width)] border-transparent bg-transparent hover:border-border hover:bg-accent hover:text-accent-foreground",
        link: "bg-transparent hover:underline",
      },
      size: {
        default: "px-4 py-1.5 text-base",
        xs: "px-2 py-0.5 text-xs",
        sm: "px-3 py-1 text-sm",
        lg: "px-6 py-2 text-base lg:px-8 lg:py-3 lg:text-lg",
        icon: "p-2",
        "icon-xs": "p-1",
        "icon-sm": "p-1.5",
        "icon-lg": "p-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

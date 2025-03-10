import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex border-2 border-accent hover:bg-accent hover:text-primary hover:border-primary items-center justify-center gap-2 whitespace-nowrap backdrop-blur-sm rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: `
          text-white bg-primary/30 px-4 py-2 text-base 
          cursor-pointer`,

        destructive: `
          text-destructive-foreground bg-destructive/30 backdrop-blur-md
          shadow-[0_7px_var(--destructive-shadow)] 
          active:translate-y-0.5 active:shadow-[0_5px_var(--destructive-shadow)] 
          hover:bg-destructive/90`,

        outline: `
          border border-input bg-background/30 backdrop-blur-md
          shadow-[0_7px_var(--muted-shadow)] 
          active:translate-y-0.5 active:shadow-[0_5px_var(--muted-shadow)] 
          hover:bg-accent/50 hover:text-accent-foreground`,

        secondary: `
          text-secondary-foreground bg-secondary/30 backdrop-blur-md
          shadow-[0_7px_var(--secondary-shadow)] 
          active:translate-y-0.5 active:shadow-[0_5px_var(--secondary-shadow)] 
          hover:bg-secondary/80`,

        ghost: `
          hover:bg-accent/50 hover:text-accent-foreground`,

        link: `
          text-primary underline-offset-4 hover:underline`,
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

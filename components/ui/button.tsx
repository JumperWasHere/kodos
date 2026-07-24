import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 select-none gap-2",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b from-primary to-purple-700 text-primary-foreground shadow-[0_4px_0_#5b21b6] hover:shadow-[0_2px_0_#5b21b6] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground",
        secondary:
          "bg-gradient-to-b from-pink-400 to-pink-600 text-white shadow-[0_4px_0_#9d174d] hover:shadow-[0_2px_0_#9d174d] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]",
        ghost:
          "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        green:
          "bg-gradient-to-b from-green-400 to-green-600 text-white shadow-[0_4px_0_#166534] hover:shadow-[0_2px_0_#166534] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]",
        orange:
          "bg-gradient-to-b from-orange-400 to-orange-600 text-white shadow-[0_4px_0_#9a3412] hover:shadow-[0_2px_0_#9a3412] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]",
        yellow:
          "bg-gradient-to-b from-yellow-300 to-yellow-500 text-yellow-900 shadow-[0_4px_0_#854d0e] hover:shadow-[0_2px_0_#854d0e] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-8 text-base",
        xl: "h-16 px-10 text-lg",
        icon: "h-10 w-10",
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

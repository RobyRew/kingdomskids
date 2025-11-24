import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors duration-250 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 select-none",
  {
    variants: {
      variant: {
        default: "bg-black text-white hover:bg-orange border border-black hover:border-orange",
        donate: "bg-black text-white hover:bg-transparent hover:text-orange border border-black hover:border-orange",
        volunteer: "bg-transparent text-black hover:bg-orange hover:text-white border border-black hover:border-transparent",
        outline: "border border-black text-black hover:text-orange hover:border-orange bg-transparent",
        ghost: "hover:bg-off-white text-black",
        link: "text-black hover:text-orange underline-offset-4 hover:underline",
      },
      size: {
        default: "px-5 py-2.5",
        sm: "px-3 py-1.5 text-sm",
        lg: "px-8 py-3 text-lg",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
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
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

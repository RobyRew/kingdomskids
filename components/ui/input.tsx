import * as React from "react"
import { cva, type VariantProps as Props } from "class-variance-authority"
import { cn } from "@/lib/utils"

const variants = cva(
  [
    "w-full",
    "rounded-lg",
    "transition-colors duration-300",
    "focus:outline-none focus-visible:outline-none",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        primary: [
          "font-medium",
          "text-black placeholder:text-black",
          "caret-orange selection:bg-orange selection:text-white",
          "bg-white",
          "border border-transparent",
        ],
      },
      size: {
        primary: [
          "px-5 py-2.5",
        ],
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "primary",
    },
  }
)

function Input({
  className,
  variant,
  size,
  type,
  ...props
}: React.ComponentProps<"input"> & Props<typeof variants>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(variants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Input, variants }
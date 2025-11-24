import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full px-5 py-2.5 rounded-lg bg-white text-black placeholder:text-black caret-orange selection:bg-orange selection:text-white border-none focus:outline-1 focus:outline-transparent transition-colors duration-250 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }

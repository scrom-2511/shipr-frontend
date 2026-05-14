import * as React from "react"

import { cn } from "@/src/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-neutral-800 bg-black px-4 font-mono text-sm text-white placeholder:text-neutral-600 focus:border-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-600 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

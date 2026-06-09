import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "active" | "expiring" | "inactive"
}

function Badge({ className, variant = "active", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-status-active-bg text-status-active-text": variant === "active",
          "border-transparent bg-status-expiring-bg text-status-expiring-text": variant === "expiring",
          "border-transparent bg-status-inactive-bg text-status-inactive-text": variant === "inactive",
        },
        className
      )}
      {...props}
    >
      <div className={cn(
        "w-1.5 h-1.5 rounded-full mr-2",
        {
          "bg-status-active-text": variant === "active",
          "bg-status-expiring-text": variant === "expiring",
          "bg-status-inactive-text": variant === "inactive",
        }
      )} />
      {props.children}
    </div>
  )
}

export { Badge }

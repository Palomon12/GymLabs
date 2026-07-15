import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "alert" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-primary text-[#283500] hover:bg-primary-hover shadow-[0_0_15px_rgba(195,244,0,0.1)]": variant === "primary",
            "bg-transparent border border-primary text-primary hover:bg-primary/10": variant === "secondary",
            "bg-alert text-white hover:bg-alert/90": variant === "alert",
            "hover:bg-surface-hover hover:text-text-main text-text-muted": variant === "ghost",
          },
          {
            "h-10 px-4 py-2": size === "default",
            "h-8 rounded-md px-3 text-xs": size === "sm",
            "h-10 w-10": size === "icon",
            "h-12 rounded-md px-8": size === "lg",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }

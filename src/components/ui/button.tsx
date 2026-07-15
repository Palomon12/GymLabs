import * as React from "react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "alert" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "default", ...props }, ref) => {
    
    let variantClasses = "";
    if (variant === "primary") variantClasses = "bg-primary text-[#283500] hover:bg-primary-hover shadow-[0_0_15px_rgba(195,244,0,0.1)]";
    if (variant === "secondary") variantClasses = "bg-transparent border border-primary text-primary hover:bg-primary/10";
    if (variant === "alert") variantClasses = "bg-alert text-white hover:bg-alert/90";
    if (variant === "ghost") variantClasses = "hover:bg-surface-hover hover:text-text-main text-text-muted";

    let sizeClasses = "";
    if (size === "default") sizeClasses = "h-10 px-4 py-2";
    if (size === "sm") sizeClasses = "h-8 rounded-md px-3 text-xs";
    if (size === "icon") sizeClasses = "h-10 w-10";
    if (size === "lg") sizeClasses = "h-12 rounded-md px-8";

    const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50";

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }

import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "active" | "expiring" | "inactive"
}

function Badge({ className = "", variant = "active", ...props }: BadgeProps) {
  let variantClasses = "";
  let dotClasses = "";

  if (variant === "active") {
    variantClasses = "border-transparent bg-status-active-bg text-status-active-text";
    dotClasses = "bg-status-active-text";
  } else if (variant === "expiring") {
    variantClasses = "border-transparent bg-status-expiring-bg text-status-expiring-text";
    dotClasses = "bg-status-expiring-text";
  } else if (variant === "inactive") {
    variantClasses = "border-transparent bg-status-inactive-bg text-status-inactive-text";
    dotClasses = "bg-status-inactive-text";
  }

  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variantClasses} ${className}`}
      {...props}
    >
      <div className={`w-1.5 h-1.5 rounded-full mr-2 ${dotClasses}`} />
      {props.children}
    </div>
  )
}

export { Badge }

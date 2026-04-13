import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertTriangle, AlertCircle, CheckCircle, Info, X } from "lucide-react"
import { cn } from "../../lib/utils"

const statusBannerVariants = cva(
  "relative flex items-start gap-3 rounded-lg border p-4 transition-all",
  {
    variants: {
      variant: {
        error: "border-red-500/30 bg-red-500/5 text-red-700 dark:text-red-400 dark:border-red-500/20 dark:bg-red-500/10",
        warning: "border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-400 dark:border-amber-500/20 dark:bg-amber-500/10",
        success: "border-green-500/30 bg-green-500/5 text-green-700 dark:text-green-400 dark:border-green-500/20 dark:bg-green-500/10",
        info: "border-blue-500/30 bg-blue-500/5 text-blue-700 dark:text-blue-400 dark:border-blue-500/20 dark:bg-blue-500/10",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
)

const iconVariants = cva("mt-0.5 flex-shrink-0", {
  variants: {
    variant: {
      error: "text-red-600 dark:text-red-400",
      warning: "text-amber-600 dark:text-amber-400",
      success: "text-green-600 dark:text-green-400",
      info: "text-blue-600 dark:text-blue-400",
    },
    size: {
      default: "h-5 w-5",
      sm: "h-4 w-4",
      lg: "h-6 w-6",
    },
  },
  defaultVariants: {
    variant: "info",
    size: "default",
  },
})

const defaultIcons = {
  error: AlertCircle,
  warning: AlertTriangle,
  success: CheckCircle,
  info: Info,
}

interface StatusBannerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBannerVariants> {
  title?: string
  icon?: React.ReactNode
  iconSize?: "sm" | "default" | "lg"
  dismissible?: boolean
  onDismiss?: () => void
  action?: React.ReactNode
}

const StatusBanner = React.forwardRef<HTMLDivElement, StatusBannerProps>(
  (
    {
      className,
      variant = "info",
      title,
      icon,
      iconSize = "default",
      dismissible,
      onDismiss,
      action,
      children,
      ...props
    },
    ref
  ) => {
    const DefaultIcon = defaultIcons[variant || "info"]
    const IconComponent = icon ?? (
      <DefaultIcon className={cn(iconVariants({ variant, size: iconSize }))} />
    )

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(statusBannerVariants({ variant }), className)}
        {...props}
      >
        {IconComponent}
        <div className="flex-1 min-w-0">
          {title && (
            <p className="font-semibold text-sm leading-tight mb-1">{title}</p>
          )}
          {children && (
            <div className="text-sm opacity-90 [&_p]:leading-relaxed">
              {children}
            </div>
          )}
          {action && <div className="mt-3">{action}</div>}
        </div>
        {dismissible && onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="flex-shrink-0 rounded-md p-1 opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }
)
StatusBanner.displayName = "StatusBanner"

export { StatusBanner, statusBannerVariants }

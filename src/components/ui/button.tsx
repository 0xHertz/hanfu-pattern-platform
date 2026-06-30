import { cn } from "@/lib/utils"
import type { ButtonHTMLAttributes, ReactNode } from "react"

type ButtonVariant = "default" | "outline" | "secondary" | "ghost" | "destructive" | "link"
type ButtonSize = "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"

const variantClasses: Record<ButtonVariant, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/80",
  outline: "border border-border bg-background hover:bg-muted hover:text-foreground",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/70",
  ghost: "hover:bg-muted hover:text-foreground",
  destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20",
  link: "text-primary underline-offset-4 hover:underline",
}

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-9 gap-1.5 px-3",
  xs: "h-6 gap-1 rounded-md px-2 text-xs [&_svg]:size-3",
  sm: "h-7 gap-1 rounded-md px-2.5 text-xs [&_svg]:size-3.5",
  lg: "h-10 gap-1.5 px-4",
  icon: "size-8",
  "icon-xs": "size-6 rounded-md [&_svg]:size-3",
  "icon-sm": "size-7 rounded-md",
  "icon-lg": "size-9",
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
}

function Button({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      data-slot="button"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-lg text-sm font-medium whitespace-nowrap transition-all select-none cursor-pointer",
        "disabled:pointer-events-none disabled:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export { Button, type ButtonProps }

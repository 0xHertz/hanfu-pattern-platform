import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive/10 text-destructive",
        outline:
          "text-foreground",
        ming:
          "border-transparent bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
        tang:
          "border-transparent bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
        song:
          "border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
        han:
          "border-transparent bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
        general:
          "border-transparent bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {}

import type { ComponentProps } from "react"

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

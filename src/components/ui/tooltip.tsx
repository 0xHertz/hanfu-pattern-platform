import * as React from "react"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"
import { cn } from "@/lib/utils"

function TooltipProvider({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root {...props} />
}

function TooltipTrigger({
  className,
  asChild,
  ...props
}: TooltipPrimitive.Trigger.Props & { asChild?: boolean }) {
  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      className={cn(className)}
      {...props}
    />
  )
}

function TooltipContent({
  className,
  sideOffset = 4,
  side,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  side?: "top" | "bottom" | "left" | "right"
  sideOffset?: number
}) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        sideOffset={sideOffset}
        side={side}
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
            "data-[starting-style]:animate-in data-[starting-style]:fade-in-0 data-[starting-style]:zoom-in-95",
            "data-[ending-style]:animate-out data-[ending-style]:fade-out-0 data-[ending-style]:zoom-out-95",
            className
          )}
          {...props}
        />
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

export { TooltipProvider, TooltipTrigger, TooltipContent }

export const Tooltip = TooltipProvider

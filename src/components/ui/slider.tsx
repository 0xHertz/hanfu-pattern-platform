import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import { cn } from "@/lib/utils"

function Slider({
  className,
  ...props
}: SliderPrimitive.Root.Props) {
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full">
        <SliderPrimitive.Track className="relative h-1.5 w-full rounded-full bg-secondary">
          <SliderPrimitive.Indicator className="absolute h-full rounded-full bg-primary" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block size-4 rounded-full border border-primary/50 bg-background shadow-xs transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50" />
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
